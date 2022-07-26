import type { IBreadCrumbController } from '@nsf-open/ember-ui-foundation/constants';
import type { TestContext } from '@ember/test-helpers';

import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { visit } from '@ember/test-helpers';

module('Acceptance | Component | ui-bread-crumbs', function (hooks) {
  setupApplicationTest(hooks);

  function lookupController(owner: TestContext['owner'], fullName: string): IBreadCrumbController {
    return owner.lookup(fullName) as IBreadCrumbController;
  }

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
    lookupController(this.owner, 'controller:application').breadCrumb = undefined;
    await visit('/');
    assert.dom('.breadcrumb').doesNotExist();
  });

  test('it filters out breadcrumbs with no label text', async function (assert) {
    lookupController(this.owner, 'controller:playground').breadCrumb = { label: '' };

    await visit('/playground');

    assert.dom(nthCrumb(1)).hasText('Home');
    assert.dom(nthCrumb(2)).doesNotExist();
  });

  test('it supports a breadcrumb being able to "rewind", to remove, prior crumbs', async function (assert) {
    lookupController(this.owner, 'controller:playground').breadCrumb = {
      label: 'Foobar',
      rewind: 1,
    };

    await visit('/playground');

    assert.dom(nthCrumb(1)).hasText('Foobar');
    assert.dom(nthCrumb(2)).doesNotExist();

    lookupController(this.owner, 'controller:artists.artist').breadCrumb = {
      label: 'Baz',
      rewind: -1,
    };

    await visit('/artists/queen');

    assert.dom(nthCrumb(1)).hasText('Baz');
    assert.dom(nthCrumb(2)).doesNotExist();
  });

  test('it support a breadcrumb with fully custom href and target', async function (assert) {
    lookupController(this.owner, 'controller:playground').breadCrumb = undefined;
    lookupController(this.owner, 'controller:playground').breadCrumbs = [
      { label: 'Search', href: 'https://www.google.com' },
      { label: 'Playground' },
    ];

    await visit('/playground');

    assert.dom(nthCrumb(2)).hasText('Search');
    assert.dom(nthCrumb(2, true)).hasAttribute('href', 'https://www.google.com');
    assert.dom(nthCrumb(2, true)).hasAttribute('target', '_self');
    assert.dom(nthCrumb(4)).doesNotExist();

    lookupController(this.owner, 'controller:artists').breadCrumb = {
      label: 'Search More',
      href: 'https://www.bing.com',
      target: '_blank',
    };

    await visit('/artists/queen');

    assert.dom(nthCrumb(2)).hasText('Search More');
    assert.dom(nthCrumb(2, true)).hasAttribute('href', 'https://www.bing.com');
    assert.dom(nthCrumb(2, true)).hasAttribute('target', '_blank');
    assert.dom(nthCrumb(4)).doesNotExist();
  });
});
