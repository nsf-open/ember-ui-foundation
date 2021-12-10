import type UiStepFlow from '@nsf/ui-foundation/components/ui-stepflow/component';
import type { IProgressComponent } from '@nsf/ui-foundation/lib/ProgressComponent';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import defineComponent from 'dummy/tests/helpers/define-component';
import lookupComponent from 'dummy/tests/helpers/lookup-component';

module('Integration | Component | ui-stepflow', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register(
      'component:test-component-a',
      defineComponent('step-a', hbs`The First Step`)
    );

    this.owner.register(
      'component:test-component-b',
      defineComponent('step-b', hbs`The Penultimate Step`)
    );

    this.owner.register(
      'component:test-component-c',
      defineComponent('step-c', hbs`The Final Step`)
    );
  });

  test('it exposes additional properties to components that it renders', async function (assert) {
    const progressData = { content: 'Hello World' };

    this.set('data', progressData);
    this.set('steps', [{ label: 'Step A', component: 'test-component-a' }]);

    // language=handlebars
    await render(hbs`<UiStepflow @id="stepflow" @steps={{this.steps}} @data={{this.data}} />`);

    const flow = lookupComponent<UiStepFlow<unknown>>(this, 'stepflow');
    const stepA = lookupComponent<IProgressComponent<unknown>>(this, 'step-a');

    assert.strictEqual(stepA.progressManager, flow.manager);
    assert.strictEqual(stepA.progressItem, flow.manager.getStepAt(0));
    assert.strictEqual(stepA.progressData, progressData);
  });

  test('it displays a navigable set of components', async function (assert) {
    this.set('steps', [
      { label: 'Step A', component: 'test-component-a', indeterminate: true },
      { label: 'Step B', component: 'test-component-b', indeterminate: true },
      { label: 'Step C', title: 'Final Step', component: 'test-component-c', indeterminate: true },
    ]);

    // language=handlebars
    await render(hbs`<UiStepflow @steps={{this.steps}} />`);

    assert.dom('ol.progress-chevrons li').exists({ count: 3 });
    assert.dom('ol.progress-chevrons li:first-child').hasClass('active');
    assert.dom('.panel header').hasText('Step A');
    assert.dom('.panel-body').hasText('The First Step');
    assert.dom('[data-test-id="next-btn"]').isEnabled();
    assert.dom('[data-test-id="next-btn"]').hasText('Next');

    await click('[data-test-id="next-btn"]');

    assert.dom('ol.progress-chevrons li:nth-child(2)').hasClass('active');
    assert.dom('.panel header').hasText('Step B');
    assert.dom('.panel-body').hasText('The Penultimate Step');
    assert.dom('[data-test-id="previous-btn"]').isEnabled();
    assert.dom('[data-test-id="previous-btn"]').hasText('Previous');

    await click('[data-test-id="next-btn"]');

    assert.dom('ol.progress-chevrons li:nth-child(3)').hasClass('active');
    assert.dom('.panel header').hasText('Final Step');
    assert.dom('.panel-body').hasText('The Final Step');
    assert.dom('[data-test-id="next-btn"]').doesNotExist();
    assert.dom('[data-test-id="complete-btn"]').isEnabled();
    assert.dom('[data-test-id="complete-btn"]').hasText('Submit');
  });

  test('it displays a navigable button bar', async function (assert) {
    this.set('steps', [
      { label: 'Step A', component: 'test-component-a', indeterminate: true },
      { label: 'Step B', component: 'test-component-b' },
      { label: 'Step C', component: 'test-component-c' },
    ]);

    this.set('handleComplete', () => assert.step('Complete'));

    // language=handlebars
    await render(
      hbs`<UiStepflow
              @steps={{this.steps}}
              @testId="stepflow"
              @onCompleteStepFlow={{action this.handleComplete}}
      />`
    );

    const prevBtn = '[data-test-id="stepflow-navigation"] [data-test-id="previous-btn"]';
    const nextBtn = '[data-test-id="stepflow-navigation"] [data-test-id="next-btn"]';
    const saveBtn = '[data-test-id="stepflow-navigation"] [data-test-id="complete-btn"]';

    assert.dom(nextBtn).isVisible();
    assert.dom(nextBtn).isEnabled();
    assert.dom(prevBtn).doesNotExist();
    assert.dom(saveBtn).doesNotExist();

    await click(nextBtn);

    assert.dom(nextBtn).isVisible();
    assert.dom(nextBtn).isDisabled();
    assert.dom(prevBtn).isVisible();
    assert.dom(prevBtn).isEnabled();
    assert.dom(saveBtn).doesNotExist();

    const stepB = lookupComponent<IProgressComponent<unknown>>(this, 'step-b');

    stepB.progressItem.markComplete();
    await settled();
    assert.dom(nextBtn).isEnabled();

    stepB.progressItem.markIncomplete();
    await settled();
    assert.dom(nextBtn).isDisabled();

    stepB.progressItem.markComplete();
    await settled();
    await click(nextBtn);

    assert.dom(saveBtn).isVisible();
    assert.dom(saveBtn).isDisabled();
    assert.dom(prevBtn).isVisible();
    assert.dom(prevBtn).isEnabled();
    assert.dom(nextBtn).doesNotExist();

    await click(prevBtn);

    assert.dom(nextBtn).isVisible();
    assert.dom(nextBtn).isEnabled();
    assert.dom(prevBtn).isVisible();
    assert.dom(prevBtn).isEnabled();
    assert.dom(saveBtn).doesNotExist();

    await click(prevBtn);

    assert.dom(nextBtn).isVisible();
    assert.dom(nextBtn).isEnabled();
    assert.dom(prevBtn).doesNotExist();
    assert.dom(saveBtn).doesNotExist();

    await click(nextBtn);
    await click(nextBtn);

    const stepC = lookupComponent<IProgressComponent<unknown>>(this, 'step-c');

    stepC.progressItem.markComplete();
    await settled();

    assert.dom(saveBtn).isEnabled();

    await click(saveBtn);

    assert.verifySteps(['Complete']);
  });
});
