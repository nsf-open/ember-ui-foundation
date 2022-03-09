import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled, click, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import wait from 'dummy/tests/helpers/wait';
import UiAsyncBlock from '@nsf/ui-foundation/components/ui-async-block/component';
import MessageManager from '@nsf/ui-foundation/lib/MessageManager';

module('Integration | Component | ui-panel', function (hooks) {
  setupRenderingTest(hooks);

  test('it creates a panel with heading', async function (assert) {
    await render(hbs`<UiPanel @heading="Hello World" @testId="panel">Foo Bar</UiPanel>`);

    assert.dom('[data-test-id="panel"]').isVisible();
    assert.dom('[data-test-id="panel"]').hasTagName('section');
    assert.dom('[data-test-id="panel"]').hasClass('panel');
    assert.dom('[data-test-id="panel"]').hasClass('panel-default');

    assert.dom('[data-test-id="panel"] .panel-heading').isVisible();
    assert.dom('[data-test-id="panel"] .panel-heading').hasTagName('header');
    assert.dom('[data-test-id="panel"] .panel-heading .panel-title').isVisible();
    assert.dom('[data-test-id="panel"] .panel-heading .panel-title').hasTagName('h2');
    assert.dom('[data-test-id="panel"] .panel-heading .panel-title').hasText('Hello World');

    assert.dom('[data-test-id="panel"] .panel-body').isVisible();
    assert.dom('[data-test-id="panel"] .panel-body').hasText('Foo Bar');
  });

  test('it can create a panel without a heading', async function (assert) {
    await render(hbs`<UiPanel @testId="panel">Foo Bar</UiPanel>`);

    assert.dom('[data-test-id="panel"]').isVisible();
    assert.dom('[data-test-id="panel"]').hasTagName('section');
    assert.dom('[data-test-id="panel"]').hasClass('panel');
    assert.dom('[data-test-id="panel"]').hasClass('panel-default');

    assert.dom('[data-test-id="panel"] .panel-heading').doesNotExist();

    assert.dom('[data-test-id="panel"] .panel-body').isVisible();
    assert.dom('[data-test-id="panel"] .panel-body').hasText('Foo Bar');
  });

  test('it can create a panel in different variants', async function (assert) {
    this.set('variant', 'primary');

    // language=handlebars
    await render(
      hbs`<UiPanel @heading="Hello World" @variant={{this.variant}} @testId="panel">Foo Bar</UiPanel>`
    );
    assert.dom('[data-test-id="panel"].panel-primary').isVisible();

    this.set('variant', 'secondary');
    assert.dom('[data-test-id="panel"].panel-secondary').isVisible();

    this.set('variant', 'success');
    assert.dom('[data-test-id="panel"].panel-success').isVisible();
  });

  test('is can create a panel heading with different heading level (H1, H2, etc)', async function (assert) {
    this.set('headingLevel', 'h1');

    // language=handlebars
    await render(
      hbs`<UiPanel @heading="Hello World" @headingLevel={{this.headingLevel}} @testId="panel">Foo Bar</UiPanel>`
    );
    assert.dom('[data-test-id="panel"] .panel-heading .panel-title').hasTagName('h1');

    this.set('headingLevel', 'h3');
    assert.dom('[data-test-id="panel"] .panel-heading .panel-title').hasTagName('h3');

    this.set('headingLevel', 'h4');
    assert.dom('[data-test-id="panel"] .panel-heading .panel-title').hasTagName('h4');
  });

  test('it can yield provided content back without being wrapped in a panel', async function (assert) {
    this.set('renderPanel', true);

    // language=handlebars
    await render(
      hbs`<UiPanel @heading="Hello World" @renderPanel={{this.renderPanel}}>Foo Bar</UiPanel>`
    );

    assert.dom('.panel .panel-heading').isVisible();
    assert.dom('.panel .panel-body').isVisible();
    assert.dom('.panel .panel-body').hasText('Foo Bar');

    this.set('renderPanel', false);

    assert.dom('.panel .panel-heading').doesNotExist();
    assert.dom('.panel .panel-body').doesNotExist();
    assert.dom().hasText('Foo Bar');
  });

  test('it will provide a ui-async-block instance when given a promise', async function (assert) {
    const promise = wait(500, 'Hello World');
    this.set('promise', promise);

    // language=handlebars
    await render(
      hbs`<UiPanel
        @heading="Information"
        @name="Infotainment"
        @promise={{this.promise}}
      as |content|>
          {{content}}
      </UiPanel>`
    );

    assert.dom('[data-test-id="load-indicator"]').isVisible();
    assert.dom('[data-test-id="load-indicator"] p:nth-child(2)').hasText('Loading Infotainment');

    await promise;
    await settled();

    assert.dom('.panel-body').hasText('Hello World');
  });

  test('it will use the heading if a name is not provided for the ui-async-block', async function (assert) {
    const promise = wait(500, 'Hello World');
    this.set('promise', promise);

    // language=handlebars
    await render(
      hbs`<UiPanel
        @heading="Information"
        @promise={{this.promise}}
      as |content|>
          {{content}}
      </UiPanel>`
    );

    assert.dom('[data-test-id="load-indicator"]').isVisible();
    assert.dom('[data-test-id="load-indicator"] p:nth-child(2)').hasText('Loading Information');

    await promise;
    await settled();

    assert.dom('.panel-body').hasText('Hello World');
  });

  test('it can be provided a ui-async-block class to customize everything possible', async function (assert) {
    class TestAsyncBlock extends UiAsyncBlock {
      pendingMessage = 'Loading Foo and a bit of Bar';
    }

    this.owner.register('component:test-async-block', TestAsyncBlock);

    const promise = wait(500, 'Hello World');
    this.set('promise', promise);
    this.set('uiAsyncBlock', 'test-async-block');

    // language=handlebars
    await render(
      hbs`<UiPanel
        @heading="Information"
        @promise={{this.promise}}
        @uiAsyncBlock={{this.uiAsyncBlock}}
      as |content|>
          {{content}}
      </UiPanel>`
    );

    assert.dom('[data-test-id="load-indicator"]').isVisible();
    assert
      .dom('[data-test-id="load-indicator"] p:nth-child(2)')
      .hasText('Loading Foo and a bit of Bar');

    await promise;
    await settled();

    assert.dom('.panel-body').hasText('Hello World');
  });

  test('it renders a ui-alert-block if provided a MessageManager instance', async function (assert) {
    const manager = new MessageManager();
    this.set('manager', manager);

    manager.addSuccessMessages('Success Message A');

    // language=handlebars
    await render(hbs`
      <UiPanel @heading="Hello World" @testId="panel" @messageManager={{this.manager}} as |modal|>
        <p>Content Goes Here</p>
      </UiPanel>
    `);

    assert.dom('[data-test-id="panel"] [data-test-ident="context-message-success"]').isVisible();
    assert
      .dom('[data-test-id="panel"] [data-test-ident="context-message-item"]')
      .hasText('Success Message A');
  });

  test('it can be made collapsible', async function (assert) {
    this.set('collapsed', false);

    // language=handlebars
    await render(
      hbs`<UiPanel @collapsed={{this.collapsed}}>
        <p>Hello World</p>
      </UiPanel>`
    );

    const btnSelector = '.panel-heading button';

    assert.dom(btnSelector).isVisible();
    assert.dom(btnSelector).hasText('Collapse');
    assert.dom(btnSelector).hasAttribute('aria-label', 'collapse section');
    assert.dom(btnSelector).hasAttribute('aria-expanded', 'true');
    assert
      .dom(btnSelector)
      .hasAttribute('aria-controls', find('.panel-body')?.parentElement?.id ?? '');
    assert.dom('.panel-body').isVisible();

    await click(btnSelector);

    assert.dom(btnSelector).hasText('Expand');
    assert.dom(btnSelector).hasAttribute('aria-label', 'expand section');
    assert.dom(btnSelector).hasAttribute('aria-expanded', 'false');
    assert.dom('.panel-body').isNotVisible();

    // eslint-disable-next-line ember/no-get
    assert.true(this.get('collapsed'), 'The "collapsed" property is true');

    this.set('collapsed', false);
    await settled();

    assert.dom(btnSelector).hasText('Collapse');
    assert.dom('.panel-body').isVisible();
  });

  test('it can be initially rendered in the collapsed state', async function (assert) {
    // language=handlebars
    await render(
      hbs`<UiPanel @startCollapsed={{true}}>
        <p>Hello World</p>
      </UiPanel>`
    );

    const btnSelector = '.panel-heading button';

    assert.dom(btnSelector).isVisible();
    assert.dom('.panel-body').isNotVisible();

    await click(btnSelector);

    assert.dom('.panel-body').isVisible();
  });

  test('its onShow and onHidden callbacks are run when its collapsed state changes', async function (assert) {
    this.set('onShow', function () {
      assert.step('onShow');
    });

    this.set('onHidden', function () {
      assert.step('onHidden');
    });

    // language=handlebars
    await render(
      hbs`<UiPanel @startCollapsed={{false}} @onHidden={{action this.onHidden}} @onShow={{action this.onShow}}>
        <p>Hello World</p>
      </UiPanel>`
    );

    const btnSelector = '.panel-heading button';

    assert.dom('.panel-body').isVisible();

    await click(btnSelector);
    assert.dom('.panel-body').isNotVisible();

    await click(btnSelector);
    assert.dom('.panel-body').isVisible();

    assert.verifySteps(['onHidden', 'onShow']);
  });

  test('a promise returned from the onShow callback will be given to the ui-async-block', async function (assert) {
    let promise;

    this.set('onShow', function () {
      promise = wait(500, 'Hello World');
      return promise;
    });

    // language=handlebars
    await render(
      hbs`<UiPanel @heading="Information" @startCollapsed={{true}} @onShow={{action this.onShow}} as |content|>
          {{content}}
      </UiPanel>`
    );

    await click('.panel-heading button');

    assert.dom('[data-test-id="load-indicator"]').isVisible();
    assert.dom('[data-test-id="load-indicator"] p:nth-child(2)').hasText('Loading Information');

    await promise;
    await settled();

    assert.dom('.panel-body').hasText('Hello World');
  });

  test('the headerButtons array can be used to create button elements in the header', async function (assert) {
    function handleClick(event: Event) {
      const btn = event.target as HTMLButtonElement;
      assert.step(`${btn.textContent?.trim()} clicked`);
    }

    this.set('headerButtons', [
      { text: 'Button A', variant: 'info', onClick: handleClick },
      { text: 'Button B', class: 'test-classname', disabled: true, icon: 'superpowers' },
    ]);

    // language=handlebars
    await render(
      hbs`<UiPanel @heading="Panel Heading" @headerButtons={{this.headerButtons}}>
        Hello World
      </UiPanel>`
    );

    const btnA = '.panel-heading button:nth-child(1)';
    const btnB = '.panel-heading button:nth-child(2)';

    assert.dom(btnA).hasText('Button A');
    assert.dom(btnA).hasClass('btn-info');
    assert.dom(btnA).isNotDisabled();

    await click(btnA);

    assert.dom(btnB).hasText('Button B');
    assert.dom(btnB).hasClass('test-classname');
    assert.dom(btnB).isDisabled();
    assert.dom(`${btnB} .fa-superpowers`).exists();

    assert.verifySteps(['Button A clicked']);
  });

  test('the headerButtons array can be used to create button elements in the header next to a collapse toggle', async function (assert) {
    this.set('headerButtons', [
      { text: 'Button A', variant: 'info' },
      { text: 'Button B', variant: 'info' },
    ]);

    // language=handlebars
    await render(
      hbs`<UiPanel @heading="Panel Heading" @headerButtons={{this.headerButtons}} @startCollapsed={{true}}>
        Hello World
      </UiPanel>`
    );

    const btnA = '.panel-heading button:nth-child(1)';
    const btnB = '.panel-heading button:nth-child(2)';
    const btnC = '.panel-heading button:nth-child(3)';

    assert.dom(btnA).hasText('Button A');
    assert.dom(btnB).hasText('Button B');
    assert.dom(btnC).hasText('Expand');
  });
});
