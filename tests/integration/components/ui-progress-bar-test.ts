import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import ProgressManager from '@nsf-open/ember-ui-foundation/lib/ProgressManager';

module('Integration | Component | ui-progress-bar', function (hooks) {
  setupRenderingTest(hooks);

  test('it displays a navigable chevron bar', async function (assert) {
    const manager = new ProgressManager([
      { label: 'Step A', indeterminate: true },
      { label: 'Step B' },
      { label: 'Step C', complete: true },
    ]);

    this.set('manager', manager);

    // language=handlebars
    await render(hbs`<UiProgressBar @manager={{this.manager}} />`);

    const chevron1 = 'ol.progress-chevrons li:nth-child(1)';
    const chevron2 = 'ol.progress-chevrons li:nth-child(2)';
    const chevron3 = 'ol.progress-chevrons li:nth-child(3)';

    function shouldHaveClass(selector: string, classNames: string[]) {
      classNames.forEach(function (name) {
        assert.dom(selector).hasClass(name);
      });
    }

    function shouldNotHaveClass(selector: string, classNames: string[]) {
      classNames.forEach(function (name) {
        assert.dom(selector).doesNotHaveClass(name);
      });
    }

    shouldHaveClass(chevron1, ['chevron', 'active', 'indeterminate']);
    shouldNotHaveClass(chevron1, [
      'complete',
      'incomplete',
      'inactive',
      'prev-active',
      'past-active',
      'next-active',
      'future-active',
    ]);

    shouldHaveClass(chevron2, ['chevron', 'inactive', 'incomplete', 'prev-active', 'past-active']);
    shouldNotHaveClass(chevron2, [
      'complete',
      'indeterminate',
      'active',
      'next-active',
      'future-active',
    ]);

    shouldHaveClass(chevron3, ['chevron', 'inactive', 'complete', 'past-active']);
    shouldNotHaveClass(chevron3, [
      'incomplete',
      'indeterminate',
      'active',
      'prev-active',
      'next-active',
      'future-active',
    ]);

    assert.dom(`${chevron1} a`).doesNotExist();
    assert.dom(`${chevron2} a`).exists();
    assert.dom(`${chevron3} a`).doesNotExist();

    await click(`${chevron2} a`);

    shouldHaveClass(chevron1, [
      'chevron',
      'inactive',
      'indeterminate',
      'next-active',
      'future-active',
    ]);
    shouldNotHaveClass(chevron1, [
      'complete',
      'incomplete',
      'active',
      'prev-active',
      'past-active',
    ]);

    shouldHaveClass(chevron2, ['chevron', 'active', 'incomplete']);
    shouldNotHaveClass(chevron2, [
      'complete',
      'inactive',
      'prev-active',
      'past-active',
      'next-active',
      'future-active',
    ]);

    shouldHaveClass(chevron3, ['chevron', 'inactive', 'complete', 'prev-active', 'past-active']);
    shouldNotHaveClass(chevron3, [
      'incomplete',
      'indeterminate',
      'active',
      'next-active',
      'future-active',
    ]);

    assert.dom(`${chevron1} a`).exists();
    assert.dom(`${chevron2} a`).doesNotExist();
    assert.dom(`${chevron3} a`).doesNotExist();

    manager.getStepAt(1)?.markComplete();
    await settled();

    assert.dom(chevron2).hasClass('complete');
    assert.dom(chevron2).doesNotHaveClass('incomplete');

    assert.dom(`${chevron1} a`).exists();
    assert.dom(`${chevron2} a`).doesNotExist();
    assert.dom(`${chevron3} a`).exists();

    await click(`${chevron3} a`);

    shouldHaveClass(chevron1, ['chevron', 'inactive', 'indeterminate', 'future-active']);
    shouldNotHaveClass(chevron1, [
      'complete',
      'incomplete',
      'active',
      'prev-active',
      'past-active',
      'next-active',
    ]);

    shouldHaveClass(chevron2, ['chevron', 'inactive', 'complete', 'next-active', 'future-active']);
    shouldNotHaveClass(chevron2, ['incomplete', 'active', 'prev-active', 'past-active']);

    shouldHaveClass(chevron3, ['chevron', 'active', 'complete']);
    shouldNotHaveClass(chevron3, [
      'incomplete',
      'indeterminate',
      'inactive',
      'prev-active',
      'past-active',
      'next-active',
      'future-active',
    ]);
  });

  test('it optionally prefixes chevrons with numbers', async function (assert) {
    const manager = new ProgressManager([{ label: 'Step A' }, { label: 'Step B' }]);

    this.set('manager', manager);
    this.set('number', false);

    // language=handlebars
    await render(hbs`<UiProgressBar @manager={{this.manager}} @number={{this.number}} />`);

    const chevron1 = 'ol.progress-chevrons li:nth-child(1) .content';
    const chevron2 = 'ol.progress-chevrons li:nth-child(2) .content';

    assert.dom(`${chevron1} span:nth-child(1)`).hasClass('hidden-md-up');
    assert.dom(`${chevron1} span:nth-child(1)`).hasText('1.');
    assert.dom(`${chevron1} span:nth-child(2)`).hasText('Step A');

    assert.dom(`${chevron2} span:nth-child(1)`).hasClass('hidden-md-up');
    assert.dom(`${chevron2} span:nth-child(1)`).hasText('2.');
    assert.dom(`${chevron2} span:nth-child(2)`).hasText('Step B');

    this.set('number', true);

    assert.dom(`${chevron1} span:nth-child(1)`).doesNotHaveClass('hidden-md-up');
    assert.dom(`${chevron2} span:nth-child(1)`).doesNotHaveClass('hidden-md-up');
  });

  test('it optionally spans the whole width of its parent container', async function (assert) {
    const manager = new ProgressManager([{ label: 'Step A' }, { label: 'Step B' }]);

    this.set('manager', manager);
    this.set('compact', true);

    // language=handlebars
    await render(hbs`<UiProgressBar @manager={{this.manager}} @compact={{this.compact}} />`);

    assert.dom('ol.progress-chevrons').hasClass('progress-chevrons-compact');

    this.set('compact', false);

    assert.dom('ol.progress-chevrons').doesNotHaveClass('progress-chevrons-compact');
  });

  test('it optionally displays checkmarks at the end of completed steps', async function (assert) {
    const manager = new ProgressManager([
      { label: 'Step A', indeterminate: true },
      { label: 'Step B', complete: true },
      { label: 'Step C' },
    ]);

    this.set('manager', manager);
    this.set('checkmark', false);

    // language=handlebars
    await render(hbs`<UiProgressBar @manager={{this.manager}} @checkmark={{this.checkmark}} />`);

    const chevron1 = 'ol.progress-chevrons li:nth-child(1) .content';
    const chevron2 = 'ol.progress-chevrons li:nth-child(2) .content';
    const chevron3 = 'ol.progress-chevrons li:nth-child(3) .content';

    assert.dom(`${chevron1} span:nth-child(3)`).doesNotExist();
    assert.dom(`${chevron2} span:nth-child(3)`).doesNotExist();
    assert.dom(`${chevron3} span:nth-child(3)`).doesNotExist();

    this.set('checkmark', true);

    assert.dom(`${chevron1} span:nth-child(3)`).hasClass('fa-fw');
    assert.dom(`${chevron1} span:nth-child(3)`).hasClass('fa-check');

    assert.dom(`${chevron2} span:nth-child(3)`).hasClass('fa-fw');
    assert.dom(`${chevron2} span:nth-child(3)`).hasClass('fa-check');

    assert.dom(`${chevron3} span:nth-child(3)`).hasClass('fa-fw');
    assert.dom(`${chevron3} span:nth-child(3)`).doesNotHaveClass('fa-check');

    manager.getStepAt(2)?.markComplete();
    await settled();

    assert.dom(`${chevron3} span:nth-child(3)`).hasClass('fa-check');
  });
});
