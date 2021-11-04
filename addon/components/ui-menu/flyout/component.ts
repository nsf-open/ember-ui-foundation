import ContextualHelpElement from '@nsf/ui-foundation/components/-internals/contextual-container/element/component';
import { computed } from '@ember/object';

export default class UiMenuFlyout extends ContextualHelpElement {
  public ariaRole = 'menu';

  public innerClassName = 'tooltip-inner btn-group-vertical';

  @computed('fade', 'actualPlacement', 'showContent')
  public get popperClassNames() {
    const classNames = ['tooltip', 'menu', this.actualPlacement];

    if (this.fade) {
      classNames.push('fade');
    }

    if (this.showContent) {
      classNames.push('in');
    }

    return classNames;
  }

  protected getPopperModifiers() {
    const modifiers = super.getPopperModifiers();

    // WIP - This modifier will make the flyout the same width as its target.
    // modifiers.push({
    //   name: 'sameWidth',
    //   enabled: false,
    //   phase: 'beforeWrite',
    //
    //   fn({ state }) {
    //     state.styles.popper.width = `${state.rects.reference.width}px`;
    //   },
    //
    //   effect({ state }) {
    //     state.elements.popper.style.width = `${state.elements.reference.offsetWidth}px`;
    //   },
    // });

    return modifiers;
  }
}
