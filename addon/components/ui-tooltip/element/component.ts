import UiContextualElement from '@nsf/ui-foundation/components/-internals/contextual-container/element/component';
import { computed } from '@ember/object';

export default class UiTooltipContextElement extends UiContextualElement {
  @computed('fade', 'actualPlacement', 'showContent')
  public get popperClassNames() {
    const classNames = ['tooltip', this.actualPlacement];

    if (this.fade) {
      classNames.push('fade');
    }

    if (this.showContent) {
      classNames.push('in');
    }

    return classNames;
  }
}
