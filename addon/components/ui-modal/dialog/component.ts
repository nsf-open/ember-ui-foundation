import Component from '@ember/component';
import { computed } from '@ember/object';
import { layout, classNames, className, attribute } from '@ember-decorators/component';
import { KeyNames, SizeVariants } from '../../../constants';
import template from './template';

const FOCUSABLE = [
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[href]',
].join(', ');

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

  get focusableChildren(): NodeListOf<HTMLElement> {
    return (this.element as HTMLElement).querySelectorAll(FOCUSABLE);
  }

  updateStyles() {
    const element = this.element as HTMLElement;
    element.style.paddingLeft = this.paddingLeft ? `${this.paddingLeft}px` : '';
    element.style.paddingRight = this.paddingRight ? `${this.paddingRight}px` : '';
  }

  // eslint-disable-next-line ember/no-component-lifecycle-hooks
  didInsertElement() {
    super.didInsertElement();
    (this.element as HTMLElement).style.display = 'block';

    const focusChildren = this.focusableChildren;

    if (focusChildren.length) {
      focusChildren[0].focus();
    }

    this.updateStyles();
  }

  // eslint-disable-next-line ember/no-component-lifecycle-hooks
  didUpdateAttrs() {
    super.didUpdateAttrs();
    this.updateStyles();
  }

  keyDown(event: KeyboardEvent) {
    const evt = event;

    if (evt.key === KeyNames.Tab) {
      const children = this.focusableChildren;
      const current = document.activeElement;

      // The user is backwards-tabbing. Check that the currently focused item is not the first
      // in the list and if so, loop focus to the last element.
      if (evt.shiftKey) {
        if (children[0] === current) {
          children[children.length - 1].focus();
          evt.preventDefault();
        }
      }
      // The user is forwards-tabbing. Check that the currently focused item is not the last
      // in the list and if so, loop focus to the first element.
      else {
        if (children[children.length - 1] === current) {
          children[0].focus();
          evt.preventDefault();
        }
      }
    }
  }
}
