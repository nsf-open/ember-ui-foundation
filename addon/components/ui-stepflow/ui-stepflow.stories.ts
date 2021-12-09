import Component from '@ember/component';
import { hbs } from 'ember-cli-htmlbars';
import { ProgressComponent } from '@nsf/ui-foundation/lib/ProgressItem';

export default {
  title: 'ui-stepflow',
  component: 'UiStepflow',

  parameters: {
    docs: {
      iframeHeight: 300,
    },
  },
};

export const Default = (context: unknown) => ({
  context: Object.assign(
    {
      steps: [
        { label: 'Name', title: 'What is your name?', component: ComponentA },
        { label: 'Quest', title: 'What is your quest?', component: ComponentB },
        {
          label: 'Color',
          title: 'What is the airspeed velocity of an unladen swallow?',
          component: ComponentC,
        },
      ],

      data: {},
    },
    context
  ),

  // language=handlebars
  template: hbs`
    <UiStepflow
      @data={{this.data}}
      @steps={{this.steps}}
      @variant={{this.variant}}
      @submitButtonText={{this.submitButtonText}}
      @testId={{this.testId}}
      @cancellationRoute={{this.cancellationRoute}}
    />
  `,
});

// ****************************************
// The following are component definitions
// used above.
// ****************************************

type OneStep = ProgressComponent<Record<string, string>>;

// eslint-disable-next-line ember/no-classic-classes
const ComponentA = Component.extend({
  layout: hbs`
    <div class="form-group">
      <label for="name">Name</label>
      <input
        type="text"
        class="form-control"
        name="name"
        placeholder="It is Arthur, King of the Britons"
        value={{this.progressData.name}}
        oninput={{action this.handleInput}}
        onkeydown={{action this.handleKeyPress}}
      />
    </div>
  `,

  handleInput(this: OneStep, event: InputEvent) {
    const value = (event.target as HTMLInputElement).value;
    this.progressItem.updateCompleteState(value.trim().length > 0);
    this.progressData.name = value;
  },

  handleKeyPress(this: OneStep, event: KeyboardEvent) {
    if (event.key === 'Enter' && this.progressItem.isComplete) {
      this.progressManager.goToNextStep();
    }
  },
});

// eslint-disable-next-line ember/no-classic-classes
const ComponentB = Component.extend({
  layout: hbs`
    <div class="form-group">
      <label for="quest">Quest</label>
      <input
        type="text"
        class="form-control"
        name="query"
        placeholder="To seek the Holy Grail"
        value={{this.progressData.quest}}
        oninput={{action this.handleInput}}
        onkeydown={{action this.handleKeyPress}}
      />
    </div>
  `,

  handleInput(this: OneStep, event: InputEvent) {
    const value = (event.target as HTMLInputElement).value;
    this.progressItem.updateCompleteState(value.trim().length > 0);
    this.progressData.quest = value;
  },

  handleKeyPress(this: OneStep, event: KeyboardEvent) {
    if (event.key === 'Enter' && this.progressItem.isComplete) {
      this.progressManager.goToNextStep();
    }
  },
});

// eslint-disable-next-line ember/no-classic-classes
const ComponentC = Component.extend({
  layout: hbs`
    <div class="radio">
      <label><input type="radio" value="african" /> African?</label>
      <label><input type="radio" value="european" /> European?</label>
    </div>
  `,

  handleChange(this: OneStep, event: InputEvent) {
    const value = (event.target as HTMLInputElement).value.trim();
    this.progressItem.updateCompleteState(value.length > 0);
    this.progressData.quest = value;
  },
});
