import type { progressManager as managerDecorator } from '@nsf-open/ember-ui-foundation/lib/ProgressManager';
import { hbs } from 'ember-cli-htmlbars';

// @ts-expect-error - The method exists globally at runtime
const { progressManager } = requirejs('@nsf-open/ember-ui-foundation/lib/ProgressManager') as {
  progressManager: typeof managerDecorator;
};

export default {
  title: 'Elements/ui-progress-bar',
  component: 'components/ui-progress-bar/component',
};

export const Default = (context: unknown) => ({
  context: Object.assign(
    {
      manager: progressManager([
        { label: 'Indeterminate Step 1', indeterminate: true },
        { label: 'Completed Step 2', complete: true },
        { label: 'Incomplete Step 3' },
        { label: 'Step 4' },
      ]),
    },
    context
  ),

  // language=handlebars
  template: hbs`
    {{!--
      manager: progressManager([
        { label: 'Indeterminate Step 1', indeterminate: true },
        { label: 'Completed Step 2', complete: true },
        { label: 'Incomplete Step 3' },
        { label: 'Step 4' },
      ]),
    --}}

    <UiProgressBar
      @manager={{this.manager}}
      @checkmark={{this.checkmark}}
      @compact={{this.compact}}
      @number={{this.number}}
    />`,
});
Default.storyName = 'ui-progress-bar';
