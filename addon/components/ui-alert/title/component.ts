import type { AlertGroupDefinition } from '@nsf/ui-foundation/constants';

import Component from '@ember/component';
import { layout, tagName } from '@ember-decorators/component';
import template from './template';

/**
 * @class UiAlertTitle
 */
@tagName('')
@layout(template)
export default class UiAlertTitle extends Component {
  /**
   * True if you need the plural inflection of the title text.
   */
  public plural = false;

  /**
   * Provided by the implementing UiAlert instance.
   */
  protected groupOptions!: AlertGroupDefinition;
}
