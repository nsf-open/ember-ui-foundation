import type RouterService from '@ember/routing/router-service';
import type RouteInfo from '@ember/routing/-private/route-info';
import type { IBreadCrumbController, BreadCrumb } from '@nsf/ui-foundation/constants';
import Component from '@ember/component';
import { layout, tagName } from '@ember-decorators/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { getOwner } from '@ember/application';
import template from './template';

type FullBreadCrumb = Required<Exclude<BreadCrumb, string>>;

type EngineInfo = {
  fullName: string;
  instanceId: number;
  localFullName: string;
  mountPoint: string;
  name: string;
};

/**
 * The UiBreadCrumbs component will generate a breadcrumb trail of hyperlinks by
 * walking upwards from the current route to the topmost application route,
 * reading `breadCrumb` or `breadCrumbs` configuration off of each controller
 * as it goes.
 *
 * Controllers have the option of providing breadcrumb configuration in a couple
 * of ways. This is opt-in, so not every controller in the routing stack needs to
 * provide something.
 *
 * ## Examples
 *
 * A string `breadCrumb` will become the label of the breadcrumb. When required,
 * the link href will be generated from the controller's name.
 *
 * ```typescript
 * export default class UserController extends Controller {
 *   readonly breadCrumb = 'User';
 * }
 * ```
 *
 * The string `breadCrumb` can also be dynamic, based on the controller's model or
 * some other computed value.
 *
 * ```typescript
 * export default class UserController extends Controller {
 *   readonly model: UserRouteModel;
 *
 *   @readOnly('model.username')
 *   declare readonly breadCrumb: string;
 * }
 * ```
 *
 * If there are dynamic segments in the path, then a model will need to be supplied
 * to fill them. This works the same as supplying a model to a `<LinkTo>` element.
 *
 * ```typescript
 * export default class UserController extends Controller {
 *   readonly model: UserRouteModel;
 *
 *   @computed('model.{id,username}')
 *   get breadCrumb() {
 *     return {
 *       label: this.model.username,
 *       model: this.model.id,
 *     };
 *   };
 * }
 * ```
 *
 * It is also possible to provide a path to a completely different route, if required.
 * This is the value that you would provide to a `<LinkTo>` @route argument. The same
 * rules about supplying a model still apply.
 *
 * ```typescript
 * export default class UserController extends Controller {
 *   readonly model: UserRouteModel;
 *
 *   @computed('model.{id,username}')
 *   get breadCrumb() {
 *     return {
 *       label: this.model.username,
 *       model: this.model.id,
 *       path:  'some.other.route',
 *     };
 *   };
 * }
 * ```
 *
 * In some circumstances a single controller will need to describe multiple breadcrumb
 * segments. This is possible using the `breadCrumbs` (note, plural of `breadCrumb`)
 * property on a controller. An array can be provided now, with the same rules described
 * above still applying to each item.
 *
 * ```typescript
 * export default class UserController extends Controller {
 *   readonly model: UserRouteModel;
 *
 *   @computed('model.{id,username}')
 *   get breadCrumbs() {
 *     return [
 *       this.model.username,
 *       {
 *         label: 'Edit',
 *         model: this.model.id,
 *         path:  'users.user.edit',
 *       },
 *     ];
 *   };
 * ```
 */
@tagName('')
@layout(template)
export default class UiBreadCrumbs extends Component {
  @service
  declare readonly router: RouterService;

  @computed('router.currentRoute')
  get crumbs() {
    const crumbs: Exclude<BreadCrumb, string>[] = [];
    let routeInfo: RouteInfo | null = this.router.currentRoute;

    do {
      if (!routeInfo) {
        break;
      }

      const controller = this.lookupController(routeInfo.name);
      const breadCrumb = controller?.breadCrumb ?? controller?.breadCrumbs;

      if (Array.isArray(breadCrumb)) {
        const fullCrumbs = breadCrumb.map((item) =>
          this.buildSingleCrumb(item, routeInfo as RouteInfo)
        );
        crumbs.unshift(...fullCrumbs);
      } else if (breadCrumb) {
        crumbs.unshift(this.buildSingleCrumb(breadCrumb, routeInfo));
      }

      routeInfo = routeInfo.parent;
    } while (routeInfo);

    if (crumbs.length > 0) {
      crumbs[crumbs.length - 1].isCurrent = true;
    }

    return crumbs;
  }

  buildSingleCrumb(crumb: BreadCrumb, routeInfo: RouteInfo): FullBreadCrumb {
    const result = typeof crumb === 'string' ? { label: crumb } : crumb;

    return {
      path: routeInfo.name,
      model: undefined,
      linkable: true,
      isCurrent: false,
      ...result,
    };
  }

  lookupController(name: string): IBreadCrumbController | null {
    const controller = getOwner(this).lookup(`controller:${name}`);

    if (controller) {
      return controller;
    }

    const engineRouteInfo = this.lookupEngineInfoByRoute(name);

    if (engineRouteInfo) {
      const instance = this.lookupEngineInstance(engineRouteInfo);
      return instance?.lookup(`controller:${engineRouteInfo.localFullName}`);
    }

    return null;
  }

  lookupEngineInfoByRoute(name: string) {
    // @ts-expect-error - gasp, a private API. Needed for in-engine lookups.
    return this.router._router._engineInfoByRoute?.[name] as EngineInfo | undefined;
  }

  lookupEngineInstance(info: EngineInfo) {
    // @ts-expect-error - gasp, a private API. Needed for in-engine lookups.
    return this.router._router._engineInstances?.[info.name]?.[info.instanceId.toString()];
  }
}
