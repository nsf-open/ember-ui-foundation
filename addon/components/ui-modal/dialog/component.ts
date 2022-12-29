import Component from '@ember/component';
import { computed } from '@ember/object';
import { layout, classNames, className, attribute } from '@ember-decorators/component';
import { manageCaptureFocus } from '@nsf-open/ember-ui-foundation/utils';
import { SizeVariants } from '../../../constants';
import template from './template';

@classNames('modal', 'fade')
@layout(template)
export default class UiModalDialog extends Component {
  title?: string;

  centered = false;

  ariaRole = 'dialog';

  size: SizeVariants = SizeVariants.Medium;

  closeDisabled = false;

  onClose?: () => void;

  @attribute('data-test-id')
  testId?: string;

  @attribute('tabindex')
  tabIndex = '-1';

  @className('in')
  showModal = false;

  paddingLeft?: number;

  paddingRight?: number;

  @computed('size')
  get sizeClass() {
    return this.size ? `modal-${this.size}` : undefined;
  }

  @attribute('aria-labelledby')
  @computed('elementId')
  get titleId() {
    return `${this.elementId}-title`;
  }

  private removeFocus?: (returnFocus: boolean) => void;

  updateStyles() {
    const element = this.element as HTMLElement;
    element.style.paddingLeft = this.paddingLeft ? `${this.paddingLeft}px` : '';
    element.style.paddingRight = this.paddingRight ? `${this.paddingRight}px` : '';
  }

  // eslint-disable-next-line ember/no-component-lifecycle-hooks
  didInsertElement() {
    super.didInsertElement();

    (this.element as HTMLElement).style.display = 'block';
    this.removeFocus = manageCaptureFocus(this.element);
    this.updateStyles();
  }

  // eslint-disable-next-line ember/no-component-lifecycle-hooks
  willDestroyElement() {
    super.willDestroyElement();

    this.removeFocus?.(false);
    this.removeFocus = undefined;
  }

  // eslint-disable-next-line ember/no-component-lifecycle-hooks
  didUpdateAttrs() {
    super.didUpdateAttrs();
    this.updateStyles();
  }
}
