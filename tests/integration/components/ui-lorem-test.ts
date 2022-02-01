import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, getRootElement, findAll } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | ui-lorem', function (hooks) {
  setupRenderingTest(hooks);

  test('it will generate the given number of words', async function (assert) {
    this.set('count', 4);
    this.set('units', 'word');

    // language=hbs
    await render(hbs`<UiLorem @count={{this.count}} @units={{this.units}} />`);

    assert.strictEqual(getRootElement().textContent?.split(' ').length, 4, 'it generated 4 words');

    this.set('count', 10);

    assert.strictEqual(
      getRootElement().textContent?.split(' ').length,
      10,
      'it generated 10 words'
    );
  });

  test('it will generate the given number of sentences', async function (assert) {
    this.set('count', 4);
    this.set('units', 'sentence');

    // language=hbs
    await render(hbs`<UiLorem @count={{this.count}} @units={{this.units}} />`);

    assert.strictEqual(
      getRootElement().textContent?.split('. ').length,
      4,
      'it generated 4 sentences'
    );

    this.set('count', 10);

    assert.strictEqual(
      getRootElement().textContent?.split('. ').length,
      10,
      'it generated 10 sentences'
    );
  });

  test('it will generate the given number of paragraphs', async function (assert) {
    this.set('count', 4);
    this.set('units', 'paragraph');

    // language=hbs
    await render(hbs`<UiLorem @count={{this.count}} @units={{this.units}} />`);

    assert.strictEqual(findAll('p').length, 4, 'it generated 4 paragraphs');

    this.set('count', 10);

    assert.strictEqual(findAll('p').length, 10, 'it generated 10 paragraphs');
  });

  test('the number of words in a sentence can be controlled', async function (assert) {
    this.set('count', 1);
    this.set('units', 'sentence');
    this.set('wordsPerSentence', { min: 8, max: 8 });

    // language=hbs
    await render(
      hbs`<UiLorem @count={{this.count}} @units={{this.units}} @wordsPerSentence={{this.wordsPerSentence}} />`
    );

    assert.strictEqual(
      getRootElement().textContent?.split(' ').length,
      8,
      'it generated 8 words'
    );
  });

  test('the number of sentences in a paragraph can be controlled', async function (assert) {
    this.set('count', 1);
    this.set('units', 'paragraph');
    this.set('sentencesPerParagraph', { min: 8, max: 8 });

    // language=hbs
    await render(
      hbs`<UiLorem @count={{this.count}} @units={{this.units}} @sentencesPerParagraph={{this.sentencesPerParagraph}} />`
    );

    assert.strictEqual(
      getRootElement().textContent?.split('. ').length,
      8,
      'it generated 8 sentences'
    );
  });
});
