import UiContextualElement from '@nsf-open/ember-ui-foundation/components/-internals/contextual-container/element/component';
import { computed } from '@ember/object';

export default class UiPopoverContextElement extends UiContextualElement {
  arrowClassName = 'arrow';

  innerClassName = 'popover-content';

  titleTextClassName = 'popover-title';

  ariaRole = 'region';

  @computed('fade', 'actualPlacement', 'showContent')
  public get popperClassNames() {
    const classNames = ['popover', this.actualPlacement];

    if (this.fade) {
      classNames.push('fade');
    }

    if (this.showContent) {
      classNames.push('in');
    }

    return classNames;
  }
}
