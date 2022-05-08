import Component from '@ember/component';
import { layout, tagName } from '@ember-decorators/component';
import template from './template';

@tagName('')
@layout(template)
export default class UiTabPanel extends Component {
  public ariaLabel?: string;

  public testId?: string;

  protected role = 'tablist';

  protected selected?: unknown;

  protected onChange?: (newTabValue: unknown, tabId?: string, controlsId?: string) => void;

  protected onReady?: (newTabValue: unknown, tabId?: string, controlsId?: string) => void;
}
