import Component from '@ember/component';
import { layout, tagName } from '@ember-decorators/component';
import { action, set } from '@ember/object';
import template from './template';

/**
 * The UiTabPanel component exposes both a UiTabs instance and a generic container
 * `<div>` whose `id` is bound to the value of the active tab's `aria-controls`
 * attribute. Basically: it is UiTabs with some extra scaffolding, and boilerplate
 * bits taken care of - nice.
 *
 * ```handlebars
 * <UiTabPanel @selected="B" as |Panel|>
 *   <Panel.TabList as |Tabs|>
 *     <Tabs.Option @value="A" @text="Tab A" />
 *     <Tabs.Option @value="B" @text="Tab B" />
 *     <Tabs.Option @value="C" @text="Tab C" />
 *   </Panel.TabList>
 *
 *   <Panel.TabPanel as |value|>
 *     Whatever is set as "value" for the currently active tab will be yielded here.
 *   </Panel.TabPanel>
 *  </UiTabPanel>
 * ```
 *
 * Just like UiTabs, when the role is changed from "tablist" the overall configuration will
 * also change to maintain compliance. While UiTabs requires being wrapped in an outer element
 * for `role="navigation"`, the UiTabsPanel can be provided the role directly.
 *
 * ```handlebars
 * <UiTabPanel @role="navigation" as |Panel|>
 *   <Panel.TabList as |Tabs|>
 *     <Tabs.Option>
 *       <LinkTo @route="index">Home</LinkTo>
 *     </Tabs.Option>
 *
 *     <Tabs.Option>
 *       <LinkTo @route="about">About Us</LinkTo>
 *     </Tabs.Option>
 *   </Panel.TabList>
 *
 *   <Panel.TabPanel>
 *     {{outlet}}
 *   </Panel.TabPanel>
 *  </UiTabPanel>
 * ```
 *
 * @yields {Panel.TabList}
 * @yields {Path.TabPanel}
 */
@tagName('')
@layout(template)
export default class UiTabPanel extends Component {
  /**
   *
   */
  public role = 'tablist';

  /**
   *
   */
  public onChange?: (newTabValue: unknown, tabId?: string) => void;

  /**
   *
   */
  public onReady?: (newTabValue: unknown, tabId?: string) => void;

  /**
   *
   */
  public selected?: unknown;

  /**
   * @protected
   */
  tabPanelId?: string;

  @action
  protected handleTabsReady(newTabValue: unknown, tabId?: string, controlsId?: string) {
    set(this, 'tabPanelId', controlsId);
    this.onReady?.(newTabValue, tabId);
  }

  @action
  protected handleTabChange(newTabValue: unknown, tabId?: string, controlsId?: string) {
    set(this, 'tabPanelId', controlsId);
    this.onChange?.(newTabValue, tabId);
  }
}
