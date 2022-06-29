import Component from '@ember/component';
import { layout, tagName } from '@ember-decorators/component';
import { HeadingLevels } from '@nsf-open/ember-ui-foundation/constants';
import template from './template';

/**
 *
 */
@tagName('')
@layout(template)
export default class UiHeading extends Component {
  /**
   * The heading level, h1 - h6.
   */
  public level = HeadingLevels.H2;

  /**
   * The text content of the heading.
   */
  public text?: string;

  /**
   * CSS class names for the heading.
   */
  public class?: string;

  protected readonly HeadingLevels = HeadingLevels;
}
