import Component from '@ember/component';
import { layout, tagName } from '@ember-decorators/component';
import template from './template';

/**
 *
 */
@tagName('')
@layout(template)
export default class UiTabPanel extends Component {
  protected id?: string;

  protected selected?: unknown;
}
