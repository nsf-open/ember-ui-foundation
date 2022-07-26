import type UiPagerSizeOptions from '@nsf-open/ember-ui-foundation/components/ui-pager/size-options/component';
import type UiPagerNavbar from '@nsf-open/ember-ui-foundation/components/ui-pager/navbar/component';
import type UiFilterInput from '@nsf-open/ember-ui-foundation/components/ui-filter/input/component';

import Component from '@ember/component';
import { tagName, layout } from '@ember-decorators/component';
import template from './template';

@tagName('')
@layout(template)
export default class UiTableControlBar extends Component {
  declare PagerSizeOptions: UiPagerSizeOptions;

  declare PagerNavbar: UiPagerNavbar;

  declare FilterInput: UiFilterInput;

  declare pagerDescription: string;

  public showPagerSizeOptions = true;

  public showPagerNavbar = true;

  public showFilterInput = true;

  public showPagerDescription = true;
}
