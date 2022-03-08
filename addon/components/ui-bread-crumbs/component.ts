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

/**
 * The UiBreadCrumbs component will generate a breadcrumb trail of hyperlinks by
 * walking upwards from the current route to the topmost application route,
 * reading `breadCrumb` or `breadCrumbs` configuration off of each controller
 * as it goes.
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

  lookupController(name: string): IBreadCrumbController | null {
    return getOwner(this).lookup(`controller:${name}`);
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
}
