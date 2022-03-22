import type { AlertLevel, AlertGroupDefinition } from '@nsf/ui-foundation/constants';

import Component from '@ember/component';
import { layout, classNames, className, attribute } from '@ember-decorators/component';
import { computed } from '@ember/object';
import { isArray } from '@ember/array';
import { AlertGroups, AlertLevelKeys } from '@nsf/ui-foundation/constants';
import { getCorrectedAlertLevel } from '@nsf/ui-foundation/lib/MessageManager';
import { listenTo } from '@nsf/ui-foundation/utils';
import template from './template';

/**
 * A block notification banner, also commonly referred to as a "page-level alert". There are four
 * variants of banner:
 *
 * * success
 * * warning
 * * danger
 * * secondary (informational)
 *
 * Single alert messages, and arrays of strings are both supported by the component's inline form.
 *
 * ```handlebars
 *
 * {{ui-alert "success" "Hurray, it worked! An array of strings would have worked here too!"}}
 * ```
 *
 * Block content is also supported. To keep consistency across the platform, you will need to place
 * the alert's "title" yourself.
 *
 * ```handlebars
 * {{#ui-alert "success" as |alert|}}
 *   <p>{{alert.title}} Great job team!</p>
 * {{/ui-alert}}
 *
 * {{#ui-alert "success" as |alert|}}
 *   {{alert.title plural=true}}
 *
 *   <ul>
 *     <li>Task A worked!</li>
 *     <li>Task B rocked!</li>
 *   </ul>
 * {{/ui-alert}}
 * ```
 *
 * @class UiAlert
 *
 * @yield {object}        alert
 * @yield {UiAlertTitle}  alert.title  The title content for the alert.
 * */
@classNames('alert')
@layout(template)
export default class UiAlert extends Component {
  public static readonly positionalParams = ['variant', 'content'];

  public readonly ariaRole = 'alert';

  /**
   * The style of alert banner to create. For historical reasons and maximum cross-compatibility
   * there are a number for aliases for each variant.
   *
   * - success, successes
   * - warning, warnings
   * - danger, error, errors, alert
   * - info, informational, informationals, secondary
   * - default, muted
   */
  public variant?: AlertLevelKeys;

  /**
   * The text content of the alert banner. If provided and array of multiple strings
   * they will be formatted as an unordered list in the order supplied. This may also be
   * set as the second positional parameter of the component.
   */
  public content?: string | string[];

  /**
   * The value of the element's `data-test-ident` attribute, if required. By default,
   * it will be a string that follows the pattern "context-message-${variant}".
   */
  @attribute('data-test-ident')
  @listenTo('defaultTestId')
  public testId?: string;

  /**
   * An object whose keys are AlertLevel strings and corresponding value is an object
   * which can contain `icon`, `singular` and `plural` strings and will be used to
   * create the alert heading. Levels that are not defined here will fall back to the
   * defaults.
   */
  public alertGroups?: Record<AlertLevel, AlertGroupDefinition>;

  @computed('variant')
  protected get defaultTestId() {
    return `context-message-${this.variant}`;
  }

  @className()
  @computed('correctVariant')
  protected get variantClassName() {
    return `alert-${this.correctVariant}`;
  }

  @computed('content.[]')
  protected get pluralize() {
    return isArray(this.content) && this.content.length > 1;
  }

  @computed('pluralize', 'content.[]')
  protected get oneContentItem() {
    return isArray(this.content) ? this.content[0] : this.content;
  }

  @computed('variant')
  protected get correctVariant() {
    return getCorrectedAlertLevel(this.variant || '');
  }

  @computed('correctVariant', 'alertGroups')
  protected get groupOptions() {
    if (this.correctVariant) {
      return this.alertGroups?.[this.correctVariant] ?? AlertGroups[this.correctVariant];
    }

    return {};
  }
}
