import Component from '@ember/component';
import { computed } from '@ember/object';
import { attribute, className, classNames, layout, tagName } from '@ember-decorators/component';
import { HeadingLevels, PanelVariants } from '../../constants';
import template from './template';

/**
 * Panels are stylized content blocks with a heading and associated content.
 *
 * ```hbs
 * {{#ui-panel "Panel Heading"}}
 * 	<p>Whatever panel body content is required.</p>
 * {{/ui-panel}}
 * ```
 *
 * ## Variants
 * You're not going to need this day-to-day because panel usage is so uniform, but it is possible
 * to alter the Bootstrap variant by setting the second positional parameter, or the `variant`
 * argument. By default, this is "default".
 *
 * ```hbs
 * {{#ui-panel "Panel Heading" "primary"}}
 * 	<p>Whatever panel body content is required.</p>
 * {{/ui-panel}}
 * ```
 *
 * ## Headless Panels
 * Sometimes you just want a panel with only a body and no heading.
 * Simply leave off the heading argument.
 *
 * ```hbs
 * <UiPanel>
 * 	<p>Whatever panel body content is required.</p>
 * </UiPanel>
 * ```
 */
@tagName('section')
@classNames('panel')
@layout(template)
export default class UiPanel extends Component {
  public static readonly positionalParams = ['heading', 'variant'];

  public readonly headingLevels = HeadingLevels;

  /**
   * The title text of the panel.
   *
   * This can also be set as the first positional parameter of the component.
   */
  public heading?: string;

  /**
   * The heading level to use, if text is provided.
   */
  public level = HeadingLevels.H2;

  /**
   * The style variant of the panel is any valid Bootstrap type that you would add after
   * `panel-` in it's class attribute (e.g. `primary` for "panel-primary", `success` for
   * "panel-success" and so on).
   *
   * This can also be set as the second positional parameter of the component.
   */
  public variant? = PanelVariants.Default;

  /**
   * The value of the element's `data-test-id` attribute, if required.
   */
  @attribute('data-test-id')
  public testId?: string;

  @computed('heading')
  public get hasHeading(): boolean {
    return typeof this.heading === 'string' && this.heading !== '';
  }

  @className()
  @computed('variant')
  protected get variantClassName() {
    return this.variant ? `panel-${this.variant}` : undefined;
  }
}
