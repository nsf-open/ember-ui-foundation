import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { visit } from '@ember/test-helpers';

module('Acceptance | Component | ui-bread-crumbs', function (hooks) {
  setupApplicationTest(hooks);

  function nthCrumb(idx: number, anchor = false) {
    return `.breadcrumb li:nth-child(${idx})${anchor ? ' a' : ''}`;
  }

  test('it generates hyperlinks based on controller configuration', async function (assert) {
    await visit('/');

    assert.dom('.breadcrumb').exists();
    assert.dom(nthCrumb(1)).hasText('Home');
    assert.dom(nthCrumb(1, true)).doesNotExist();
    assert.dom(nthCrumb(2)).doesNotExist();

    await visit('/artists');

    assert.dom(nthCrumb(1, true)).hasText('Home');
    assert.dom(nthCrumb(1, true)).hasAttribute('href', '/');
    assert.dom(nthCrumb(2)).hasText('Artists');
    assert.dom(nthCrumb(2, true)).doesNotExist();

    await visit('/artists/queen/a-night-at-the-opera');

    assert.dom(nthCrumb(1, true)).hasText('Home');
    assert.dom(nthCrumb(1, true)).hasAttribute('href', '/');
    assert.dom(nthCrumb(2, true)).hasText('Artists');
    assert.dom(nthCrumb(2, true)).hasAttribute('href', '/artists');
    assert.dom(nthCrumb(3, true)).hasText('Queen');
    assert.dom(nthCrumb(3, true)).hasAttribute('href', '/artists/queen');
    assert.dom(nthCrumb(4, true)).hasText('Albums');
    assert.dom(nthCrumb(4, true)).hasAttribute('href', '/artists/queen/discography');
    assert.dom(nthCrumb(5)).hasText('A Night At The Opera');
    assert.dom(nthCrumb(5, true)).doesNotExist();
  });

  test('it does not render an empty ordered list', async function (assert) {
    this.owner.lookup('controller:application').breadCrumb = undefined;
    await visit('/');
    assert.dom('.breadcrumb').doesNotExist();
  });

  test('it filters out breadcrumbs with no label text', async function (assert) {
    this.owner.lookup('controller:playground').breadCrumb = { label: '' };

    await visit('/playground');

    assert.dom(nthCrumb(1)).hasText('Home');
    assert.dom(nthCrumb(2)).doesNotExist();
  });

  test('it supports a breadcrumb being able to "rewind", to remove, prior crumbs', async function (assert) {
    this.owner.lookup('controller:playground').breadCrumb = { label: 'Foobar', rewind: 1 };

    await visit('/playground');

    assert.dom(nthCrumb(1)).hasText('Foobar');
    assert.dom(nthCrumb(2)).doesNotExist();

    this.owner.lookup('controller:artists.artist').breadCrumb = { label: 'Baz', rewind: -1 };

    await visit('/artists/queen');

    assert.dom(nthCrumb(1)).hasText('Baz');
    assert.dom(nthCrumb(2)).doesNotExist();
  });
});
