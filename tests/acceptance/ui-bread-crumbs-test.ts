import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { visit } from '@ember/test-helpers';

module('Acceptance | Component | ui-bread-crumbs', function (hooks) {
  setupApplicationTest(hooks);

  test('it generates hyperlinks based on controller configuration', async function (assert) {
    await visit('/');

    function nthCrumb(idx: number, anchor = false) {
      return `.breadcrumb li:nth-child(${idx})${anchor ? ' a' : ''}`;
    }

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
});
