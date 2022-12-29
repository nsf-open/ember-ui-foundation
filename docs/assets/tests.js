'use strict';

define("dummy/tests/acceptance/ui-bread-crumbs-test", ["qunit", "ember-qunit", "@ember/test-helpers"], function (_qunit, _emberQunit, _testHelpers) {
  "use strict";

  0; //eaimeta@70e063a35619d71f0,"qunit",0,"ember-qunit",0,"@ember/test-helpers"eaimeta@70e063a35619d71f
  (0, _qunit.module)('Acceptance | Component | ui-bread-crumbs', function (hooks) {
    (0, _emberQunit.setupApplicationTest)(hooks);
    function lookupController(owner, fullName) {
      return owner.lookup(fullName);
    }
    function nthCrumb(idx) {
      let anchor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      return `.breadcrumb li:nth-child(${idx})${anchor ? ' a' : ''}`;
    }
    (0, _qunit.test)('it generates hyperlinks based on controller configuration', async function (assert) {
      await (0, _testHelpers.visit)('/');
      assert.dom('.breadcrumb').exists();
      assert.dom(nthCrumb(1)).hasText('Home');
      assert.dom(nthCrumb(1, true)).doesNotExist();
      assert.dom(nthCrumb(2)).doesNotExist();
      await (0, _testHelpers.visit)('/artists');
      assert.dom(nthCrumb(1, true)).hasText('Home');
      assert.dom(nthCrumb(1, true)).hasAttribute('href', '/');
      assert.dom(nthCrumb(2)).hasText('Artists');
      assert.dom(nthCrumb(2, true)).doesNotExist();
      await (0, _testHelpers.visit)('/artists/queen/a-night-at-the-opera');
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
    (0, _qunit.test)('it does not render an empty ordered list', async function (assert) {
      lookupController(this.owner, 'controller:application').breadCrumb = undefined;
      await (0, _testHelpers.visit)('/');
      assert.dom('.breadcrumb').doesNotExist();
    });
    (0, _qunit.test)('it filters out breadcrumbs with no label text', async function (assert) {
      lookupController(this.owner, 'controller:playground').breadCrumb = {
        label: ''
      };
      await (0, _testHelpers.visit)('/playground');
      assert.dom(nthCrumb(1)).hasText('Home');
      assert.dom(nthCrumb(2)).doesNotExist();
    });
    (0, _qunit.test)('it supports a breadcrumb being able to "rewind", to remove, prior crumbs', async function (assert) {
      lookupController(this.owner, 'controller:playground').breadCrumb = {
        label: 'Foobar',
        rewind: 1
      };
      await (0, _testHelpers.visit)('/playground');
      assert.dom(nthCrumb(1)).hasText('Foobar');
      assert.dom(nthCrumb(2)).doesNotExist();
      lookupController(this.owner, 'controller:artists.artist').breadCrumb = {
        label: 'Baz',
        rewind: -1
      };
      await (0, _testHelpers.visit)('/artists/queen');
      assert.dom(nthCrumb(1)).hasText('Baz');
      assert.dom(nthCrumb(2)).doesNotExist();
    });
    (0, _qunit.test)('it support a breadcrumb with fully custom href and target', async function (assert) {
      lookupController(this.owner, 'controller:playground').breadCrumb = undefined;
      lookupController(this.owner, 'controller:playground').breadCrumbs = [{
        label: 'Search',
        href: 'https://www.google.com'
      }, {
        label: 'Playground'
      }];
      await (0, _testHelpers.visit)('/playground');
      assert.dom(nthCrumb(2)).hasText('Search');
      assert.dom(nthCrumb(2, true)).hasAttribute('href', 'https://www.google.com');
      assert.dom(nthCrumb(2, true)).hasAttribute('target', '_self');
      assert.dom(nthCrumb(4)).doesNotExist();
      lookupController(this.owner, 'controller:artists').breadCrumb = {
        label: 'Search More',
        href: 'https://www.bing.com',
        target: '_blank'
      };
      await (0, _testHelpers.visit)('/artists/queen');
      assert.dom(nthCrumb(2)).hasText('Search More');
      assert.dom(nthCrumb(2, true)).hasAttribute('href', 'https://www.bing.com');
      assert.dom(nthCrumb(2, true)).hasAttribute('target', '_blank');
      assert.dom(nthCrumb(4)).doesNotExist();
    });
  });
});
define("dummy/tests/helpers/define-component", ["exports", "@ember/component"], function (_exports, _component) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = defineComponent;
  0; //eaimeta@70e063a35619d71f0,"@ember/component"eaimeta@70e063a35619d71f
  function defineComponent(id, layout) {
    // eslint-disable-next-line ember/no-classic-classes
    return _component.default.extend({
      layout,
      elementId: id
    });
  }
});
define("dummy/tests/helpers/lookup-component", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = lookupComponent;
  0; //eaimeta@70e063a35619d71feaimeta@70e063a35619d71f
  /**
   * Returns an active component instance with the provided id from
   * the view registry.
   */
  function lookupComponent(context, id) {
    const registry = context.owner.lookup('-view-registry:main');
    return registry[id];
  }
});
define("dummy/tests/helpers/silence-exceptions", ["exports", "@ember/test-helpers"], function (_exports, _testHelpers) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = silenceExceptions;
  0; //eaimeta@70e063a35619d71f0,"@ember/test-helpers"eaimeta@70e063a35619d71f
  /**
   * Sets Ember.onerror to a no-op for the duration of the callback, cleaning
   * up when it completes.
   */
  async function silenceExceptions(callback) {
    let tryCatch = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    (0, _testHelpers.setupOnerror)(function () {
      /* Don't look sweet child! */
    });
    if (tryCatch) {
      try {
        await callback();
      } catch (e) {
        /* We're intending for this to throw. */
      }
    } else {
      await callback();
    }
    await (0, _testHelpers.settled)();
    (0, _testHelpers.resetOnerror)();
  }
});
define("dummy/tests/helpers/wait", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = wait;
  0; //eaimeta@70e063a35619d71feaimeta@70e063a35619d71f
  /**
   * Creates a promise that will take the given number of milliseconds to
   * settle, returning the provided payload. Optionally, it can be told
   * to fail with the same payload.
   */
  function wait(milliseconds, payload) {
    let reject = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    return new Promise(function (resolveFn, rejectFn) {
      const settle = reject ? rejectFn : resolveFn;
      setTimeout(() => settle(payload), milliseconds);
    });
  }
});
define("dummy/tests/integration/components/ui-alert-block-test", ["@ember/template-factory", "qunit", "ember-qunit", "@ember/test-helpers", "@nsf-open/ember-ui-foundation/lib/MessageManager"], function (_templateFactory, _qunit, _emberQunit, _testHelpers, _MessageManager) {
  "use strict";

  0; //eaimeta@70e063a35619d71f0,"qunit",0,"ember-qunit",0,"@ember/test-helpers",0,"htmlbars-inline-precompile",0,"@nsf-open/ember-ui-foundation/lib/MessageManager"eaimeta@70e063a35619d71f
  (0, _qunit.module)('Integration | Component | ui-alert-block', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);
    const rootSelector = '[data-test-ident="context-message-block"]';
    const errorBlockSelector = '[data-test-ident="context-message-danger"]';
    const warningBlockSelector = '[data-test-ident="context-message-warning"]';
    const successBlockSelector = '[data-test-ident="context-message-success"]';
    const infoBlockSelector = '[data-test-ident="context-message-secondary"]';
    const mutedBlockSelector = '[data-test-ident="context-message-muted"]';
    const labelSelector = '[data-test-id="label"]';
    const itemSelector = '[data-test-ident="context-message-item"]';
    (0, _qunit.test)('it generates an ordered list of alert blocks based on the input of a message manager', async function (assert) {
      const manager = new _MessageManager.default();
      this.set('manager', manager);

      // language=hbs
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        <UiAlertBlock @manager={{this.manager}} />
      */
      {
        "id": "S8ZX4yRM",
        "block": "[[[8,[39,0],null,[[\"@manager\"],[[30,0,[\"manager\"]]]],null]],[],false,[\"ui-alert-block\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom(rootSelector).exists();
      assert.dom(errorBlockSelector).doesNotExist();
      assert.dom(warningBlockSelector).doesNotExist();
      assert.dom(successBlockSelector).doesNotExist();
      assert.dom(infoBlockSelector).doesNotExist();
      assert.dom(mutedBlockSelector).doesNotExist();
      manager.addInfoMessages('Info Message A');
      await (0, _testHelpers.settled)();
      assert.dom(infoBlockSelector).isVisible();
      assert.dom(`${infoBlockSelector} ${labelSelector}`).hasText('INFORMATION:');
      assert.dom(`${infoBlockSelector} ${itemSelector}`).hasText('Info Message A');
      const [successMessageId] = manager.addSuccessMessages('Success Message A');
      manager.addWarningMessages('Warning Message A');
      manager.addErrorMessages('Error Message A');
      await (0, _testHelpers.settled)();
      assert.dom(successBlockSelector).isVisible();
      assert.dom(`${successBlockSelector} ${labelSelector}`).hasText('SUCCESS:');
      assert.dom(`${successBlockSelector} ${itemSelector}`).hasText('Success Message A');
      assert.dom(warningBlockSelector).isVisible();
      assert.dom(`${warningBlockSelector} ${labelSelector}`).hasText('WARNING:');
      assert.dom(`${warningBlockSelector} ${itemSelector}`).hasText('Warning Message A');
      assert.dom(errorBlockSelector).isVisible();
      assert.dom(`${errorBlockSelector} ${labelSelector}`).hasText('ERROR:');
      assert.dom(`${errorBlockSelector} ${itemSelector}`).hasText('Error Message A');
      const blocks = (0, _testHelpers.findAll)(`${rootSelector} > div.alert`);
      const order = blocks.map(block => block.className.match(/alert-(\w+)/)).map(matches => matches ? matches[1] : '');
      assert.deepEqual(order, ['danger', 'warning', 'secondary', 'success'], 'The alert block order is correct');
      manager.addWarningMessages('Warning Message B');
      await (0, _testHelpers.settled)();
      assert.dom(`${warningBlockSelector} ${labelSelector}`).hasText('WARNINGS:');
      assert.dom(`${warningBlockSelector} ${itemSelector}:nth-child(1)`).hasText('Warning Message A');
      assert.dom(`${warningBlockSelector} ${itemSelector}:nth-child(2)`).hasText('Warning Message B');
      manager.updateMessage(successMessageId, 'Success Message B');
      await (0, _testHelpers.settled)();
      assert.dom(`${successBlockSelector} ${labelSelector}`).hasText('SUCCESS:');
      assert.dom(`${successBlockSelector} ${itemSelector}`).hasText('Success Message B');
    });
  });
});
define("dummy/tests/integration/components/ui-alert-test", ["@ember/template-factory", "qunit", "ember-qunit", "@ember/test-helpers", "@nsf-open/ember-ui-foundation/lib/MessageManager", "@nsf-open/ember-ui-foundation/constants"], function (_templateFactory, _qunit, _emberQunit, _testHelpers, _MessageManager, _constants) {
  "use strict";

  0; //eaimeta@70e063a35619d71f0,"qunit",0,"ember-qunit",0,"@ember/test-helpers",0,"htmlbars-inline-precompile",0,"@nsf-open/ember-ui-foundation/lib/MessageManager",0,"@nsf-open/ember-ui-foundation/constants"eaimeta@70e063a35619d71f
  (0, _qunit.module)('Integration | Component | ui-alert', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);
    (0, _qunit.test)('its title text and iconography are correct for the supported alert types', function (assert) {
      assert.expect(4);
      assert.deepEqual(_constants.AlertGroups[_constants.AlertLevel.ERROR], {
        singular: 'ERROR:',
        plural: 'ERRORS:',
        icon: 'fa fa-exclamation-triangle'
      }, 'Correct for ERROR');
      assert.deepEqual(_constants.AlertGroups[_constants.AlertLevel.WARNING], {
        singular: 'WARNING:',
        plural: 'WARNINGS:',
        icon: 'fa fa-exclamation-triangle'
      }, 'Correct for WARNING');
      assert.deepEqual(_constants.AlertGroups[_constants.AlertLevel.SUCCESS], {
        singular: 'SUCCESS:',
        plural: 'SUCCESS:',
        icon: 'fa fa-check-circle-o'
      }, 'Correct for SUCCESS');
      assert.deepEqual(_constants.AlertGroups[_constants.AlertLevel.INFO], {
        singular: 'INFORMATION:',
        plural: 'INFORMATION:',
        icon: 'fa fa-info-circle'
      }, 'Correct for INFORMATION');
    });
    (0, _qunit.test)('it will map numerous variant names to the supported types', function (assert) {
      assert.expect(11);
      assert.strictEqual(_constants.AlertLevel.ERROR, (0, _MessageManager.getCorrectedAlertLevel)('danger'));
      assert.strictEqual(_constants.AlertLevel.ERROR, (0, _MessageManager.getCorrectedAlertLevel)('errors'));
      assert.strictEqual(_constants.AlertLevel.ERROR, (0, _MessageManager.getCorrectedAlertLevel)('error'));
      assert.strictEqual(_constants.AlertLevel.WARNING, (0, _MessageManager.getCorrectedAlertLevel)('warnings'));
      assert.strictEqual(_constants.AlertLevel.WARNING, (0, _MessageManager.getCorrectedAlertLevel)('warning'));
      assert.strictEqual(_constants.AlertLevel.SUCCESS, (0, _MessageManager.getCorrectedAlertLevel)('successes'));
      assert.strictEqual(_constants.AlertLevel.SUCCESS, (0, _MessageManager.getCorrectedAlertLevel)('success'));
      assert.strictEqual(_constants.AlertLevel.INFO, (0, _MessageManager.getCorrectedAlertLevel)('secondary'));
      assert.strictEqual(_constants.AlertLevel.INFO, (0, _MessageManager.getCorrectedAlertLevel)('info'));
      assert.strictEqual(_constants.AlertLevel.INFO, (0, _MessageManager.getCorrectedAlertLevel)('information'));
      assert.strictEqual(_constants.AlertLevel.INFO, (0, _MessageManager.getCorrectedAlertLevel)('informationals'));
    });
    (0, _qunit.test)('it allows the default title text and iconography to be customized', async function (assert) {
      this.set('variant', 'success');
      this.set('alertGroups', {
        [_constants.AlertLevel.WARNING]: {
          singular: 'DANGER WILL ROBINSON:'
        }
      });

      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
              <UiAlert
                @variant={{this.variant}}
                @alertGroups={{this.alertGroups}}
                @content="Lorem Ipsum"
              />
          
      */
      {
        "id": "pIkt7QT+",
        "block": "[[[1,\"\\n        \"],[8,[39,0],null,[[\"@variant\",\"@alertGroups\",\"@content\"],[[30,0,[\"variant\"]],[30,0,[\"alertGroups\"]],\"Lorem Ipsum\"]],null],[1,\"\\n    \"]],[],false,[\"ui-alert\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('[data-test-id="label"]').hasText('SUCCESS:');
      this.set('variant', 'warning');
      assert.dom('[data-test-id="label"]').hasText('DANGER WILL ROBINSON:');
    });
    (0, _qunit.test)('it renders a single string message', async function (assert) {
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        {{ui-alert "error" "This is an error message"}}
      */
      {
        "id": "OV3QQys0",
        "block": "[[[1,[28,[35,0],[\"error\",\"This is an error message\"],null]]],[],false,[\"ui-alert\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('[data-test-id="label"]').hasText('ERROR:');
      assert.dom('[data-test-ident="context-message-item"]').hasTagName('span');
      assert.dom('[data-test-ident="context-message-item"]').hasText('This is an error message');
    });
    (0, _qunit.test)('it renders an array with one string message', async function (assert) {
      this.set('messages', ['This is an error message']);
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        {{ui-alert "error" this.messages}}
      */
      {
        "id": "Y8iCYrHa",
        "block": "[[[1,[28,[35,0],[\"error\",[30,0,[\"messages\"]]],null]]],[],false,[\"ui-alert\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('[data-test-id="label"]').hasText('ERROR:');
      assert.dom('[data-test-ident="context-message-item"]').hasTagName('span');
      assert.dom('[data-test-ident="context-message-item"]').hasText('This is an error message');
    });
    (0, _qunit.test)('it renders an array with multiple string messages', async function (assert) {
      this.set('messages', ['This is an error message', 'This is another error message']);
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        {{ui-alert "error" this.messages}}
      */
      {
        "id": "Y8iCYrHa",
        "block": "[[[1,[28,[35,0],[\"error\",[30,0,[\"messages\"]]],null]]],[],false,[\"ui-alert\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('[data-test-id="label"]').hasText('ERRORS:');
      assert.dom('[data-test-ident="context-message-item"]:nth-child(1)').hasTagName('li');
      assert.dom('[data-test-ident="context-message-item"]:nth-child(1)').hasText('This is an error message');
      assert.dom('[data-test-ident="context-message-item"]:nth-child(2)').hasTagName('li');
      assert.dom('[data-test-ident="context-message-item"]:nth-child(2)').hasText('This is another error message');
    });
    (0, _qunit.test)('it supports generic block content', async function (assert) {
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
      			{{#ui-alert "error" as |alert|}}
      				<p>{{alert.title}} <span data-test-ident="context-message-item">This is a custom error message</span></p>
      			{{/ui-alert}}
      		
      */
      {
        "id": "wqEvHVJy",
        "block": "[[[1,\"\\n\"],[6,[39,0],[\"error\"],null,[[\"default\"],[[[[1,\"\\t\\t\\t\\t\"],[10,2],[12],[1,[30,1,[\"title\"]]],[1,\" \"],[10,1],[14,\"data-test-ident\",\"context-message-item\"],[12],[1,\"This is a custom error message\"],[13],[13],[1,\"\\n\"]],[1]]]]],[1,\"\\t\\t\"]],[\"alert\"],false,[\"ui-alert\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('[data-test-id="label"]').hasText('ERROR:');
      assert.dom('[data-test-ident="context-message-item"]').hasTagName('span');
      assert.dom('[data-test-ident="context-message-item"]').hasText('This is a custom error message');
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
      			{{#ui-alert "error" as |alert|}}
      				{{alert.title plural=true}}
      				<ul>
      					<li data-test-ident="context-message-item">This is a custom error message</li>
      					<li data-test-ident="context-message-item">This is another custom error message</li>
      				</ul>
      			{{/ui-alert}}
      		
      */
      {
        "id": "WL7Oa+3j",
        "block": "[[[1,\"\\n\"],[6,[39,0],[\"error\"],null,[[\"default\"],[[[[1,\"\\t\\t\\t\\t\"],[1,[28,[30,1,[\"title\"]],null,[[\"plural\"],[true]]]],[1,\"\\n\\t\\t\\t\\t\"],[10,\"ul\"],[12],[1,\"\\n\\t\\t\\t\\t\\t\"],[10,\"li\"],[14,\"data-test-ident\",\"context-message-item\"],[12],[1,\"This is a custom error message\"],[13],[1,\"\\n\\t\\t\\t\\t\\t\"],[10,\"li\"],[14,\"data-test-ident\",\"context-message-item\"],[12],[1,\"This is another custom error message\"],[13],[1,\"\\n\\t\\t\\t\\t\"],[13],[1,\"\\n\"]],[1]]]]],[1,\"\\t\\t\"]],[\"alert\"],false,[\"ui-alert\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('[data-test-id="label"]').hasText('ERRORS:');
      assert.dom('[data-test-ident="context-message-item"]:nth-child(1)').hasText('This is a custom error message');
      assert.dom('[data-test-ident="context-message-item"]:nth-child(2)').hasText('This is another custom error message');
    });
  });
});
define("dummy/tests/integration/components/ui-async-block-test", ["@ember/template-factory", "qunit", "ember-qunit", "rsvp", "dummy/tests/helpers/silence-exceptions", "@ember/test-helpers"], function (_templateFactory, _qunit, _emberQunit, _rsvp, _silenceExceptions, _testHelpers) {
  "use strict";

  0; //eaimeta@70e063a35619d71f0,"qunit",0,"ember-qunit",0,"htmlbars-inline-precompile",0,"rsvp",0,"dummy/tests/helpers/silence-exceptions",0,"@ember/test-helpers"eaimeta@70e063a35619d71f
  (0, _qunit.module)('Integration | Component | ui-async-block', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);
    function resolvingPromise() {
      let ms = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 50;
      let payload = arguments.length > 1 ? arguments[1] : undefined;
      return new _rsvp.Promise(resolve => setTimeout(() => resolve(payload), ms));
    }
    function rejectingPromise() {
      let ms = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 50;
      let payload = arguments.length > 1 ? arguments[1] : undefined;
      return new _rsvp.Promise((_, reject) => setTimeout(() => reject(payload), ms));
    }
    (0, _qunit.test)('it renders content when not given a promise', async function (assert) {
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            {{#ui-async-block}}
              <p data-test-content>Hello World</p>
            {{/ui-async-block}}
          
      */
      {
        "id": "7/Or4zhZ",
        "block": "[[[1,\"\\n\"],[6,[39,0],null,null,[[\"default\"],[[[[1,\"        \"],[10,2],[14,\"data-test-content\",\"\"],[12],[1,\"Hello World\"],[13],[1,\"\\n\"]],[]]]]],[1,\"    \"]],[],false,[\"ui-async-block\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('[data-test-content]').isVisible();
      assert.dom('[data-test-content]').hasText('Hello World');
    });
    (0, _qunit.test)('it handles a resolved promised', async function (assert) {
      const promise = this.set('promise', resolvingPromise());

      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            <UiAsyncBlock @promise={{this.promise}}>
              <p data-test-content>Hello World</p>
            </UiAsyncBlock>
          
      */
      {
        "id": "zWH7EYT2",
        "block": "[[[1,\"\\n      \"],[8,[39,0],null,[[\"@promise\"],[[30,0,[\"promise\"]]]],[[\"default\"],[[[[1,\"\\n        \"],[10,2],[14,\"data-test-content\",\"\"],[12],[1,\"Hello World\"],[13],[1,\"\\n      \"]],[]]]]],[1,\"\\n    \"]],[],false,[\"ui-async-block\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('[data-test-id="load-indicator"]').isVisible();
      assert.dom('[data-test-id="load-indicator"]').hasText('Loading...');
      await promise;
      await (0, _testHelpers.settled)();
      assert.dom('[data-test-content]').isVisible();
      assert.dom('[data-test-content]').hasText('Hello World');
    });
    (0, _qunit.test)('it yields the resolved result to its content block', async function (assert) {
      const promise = this.set('promise', resolvingPromise(50, '1234'));
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
      			{{#ui-async-block promise=this.promise as |promiseResult|}}
      				<p data-test-content>{{promiseResult}}</p>
      			{{/ui-async-block}}
      		
      */
      {
        "id": "ggywc+Le",
        "block": "[[[1,\"\\n\"],[6,[39,0],null,[[\"promise\"],[[30,0,[\"promise\"]]]],[[\"default\"],[[[[1,\"\\t\\t\\t\\t\"],[10,2],[14,\"data-test-content\",\"\"],[12],[1,[30,1]],[13],[1,\"\\n\"]],[1]]]]],[1,\"\\t\\t\"]],[\"promiseResult\"],false,[\"ui-async-block\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      await promise;
      await (0, _testHelpers.settled)();
      assert.dom('[data-test-content]').isVisible();
      assert.dom('[data-test-content]').hasText('1234');
    });
    (0, _qunit.test)('it handles a rejected promise', async function (assert) {
      const promise = this.set('promise', rejectingPromise());
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
      			{{#ui-async-block promise=this.promise}}
      				<p data-test-content>Hello World</p>
      			{{/ui-async-block}}
      		
      */
      {
        "id": "iyDjko4s",
        "block": "[[[1,\"\\n\"],[6,[39,0],null,[[\"promise\"],[[30,0,[\"promise\"]]]],[[\"default\"],[[[[1,\"\\t\\t\\t\\t\"],[10,2],[14,\"data-test-content\",\"\"],[12],[1,\"Hello World\"],[13],[1,\"\\n\"]],[]]]]],[1,\"\\t\\t\"]],[],false,[\"ui-async-block\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('[data-test-id="load-indicator"]').isVisible();
      assert.dom('[data-test-id="load-indicator"]').hasText('Loading...');
      await (0, _silenceExceptions.default)(async () => {
        await promise;
      });
      assert.dom('[data-test-id="error-block"]').isVisible();
      assert.dom('[data-test-id="error-block"]').hasText('An Error Has Occurred');
      assert.dom('[data-test-id="error-block"] p:nth-child(1) span').hasClass('fa-exclamation-triangle');
    });
    (0, _qunit.test)('it handles a promise that resolves something "empty"', async function (assert) {
      const promise = this.set('promise', resolvingPromise());
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            {{#ui-async-block promise=this.promise noResults=true}}
              <p data-test-content>Hello World</p>
            {{/ui-async-block}}
          
      */
      {
        "id": "aqy51Pws",
        "block": "[[[1,\"\\n\"],[6,[39,0],null,[[\"promise\",\"noResults\"],[[30,0,[\"promise\"]],true]],[[\"default\"],[[[[1,\"        \"],[10,2],[14,\"data-test-content\",\"\"],[12],[1,\"Hello World\"],[13],[1,\"\\n\"]],[]]]]],[1,\"    \"]],[],false,[\"ui-async-block\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('[data-test-id="load-indicator"]').isVisible();
      assert.dom('[data-test-id="load-indicator"]').hasText('Loading...');
      await promise;
      await (0, _testHelpers.settled)();
      assert.dom('[data-test-id="no-results-block"]').isVisible();
      assert.dom('[data-test-id="no-results-block"]').hasText('No Content Is Available');
    });
    (0, _qunit.test)('it generates customized messages based on a provided "name"', async function (assert) {
      let promise = this.set('promise', resolvingPromise());
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            {{#ui-async-block "Witty Catchphrases" promise=this.promise noResults=true}}
              <p data-test-content>Hello World</p>
            {{/ui-async-block}}
          
      */
      {
        "id": "SYdjdShX",
        "block": "[[[1,\"\\n\"],[6,[39,0],[\"Witty Catchphrases\"],[[\"promise\",\"noResults\"],[[30,0,[\"promise\"]],true]],[[\"default\"],[[[[1,\"        \"],[10,2],[14,\"data-test-content\",\"\"],[12],[1,\"Hello World\"],[13],[1,\"\\n\"]],[]]]]],[1,\"    \"]],[],false,[\"ui-async-block\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('[data-test-id="load-indicator"]').hasText('Loading Witty Catchphrases');
      await promise;
      await (0, _testHelpers.settled)();
      assert.dom('[data-test-id="no-results-block"]').hasText('No Witty Catchphrases have been added');
      await (0, _testHelpers.clearRender)();
      promise = this.set('promise', rejectingPromise());
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            {{#ui-async-block "Witty Catchphrases" promise=this.promise}}
              <p data-test-content>Hello World</p>
            {{/ui-async-block}}
          
      */
      {
        "id": "MN2Etm32",
        "block": "[[[1,\"\\n\"],[6,[39,0],[\"Witty Catchphrases\"],[[\"promise\"],[[30,0,[\"promise\"]]]],[[\"default\"],[[[[1,\"        \"],[10,2],[14,\"data-test-content\",\"\"],[12],[1,\"Hello World\"],[13],[1,\"\\n\"]],[]]]]],[1,\"    \"]],[],false,[\"ui-async-block\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      await (0, _silenceExceptions.default)(async () => {
        await promise;
      });
      assert.dom('[data-test-id="error-block"]').hasText('Could not retrieve Witty Catchphrases');
    });
    (0, _qunit.test)('it shows fully custom message strings when provided', async function (assert) {
      let promise = this.set('promise', resolvingPromise());
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            {{#ui-async-block "Witty Catchphrases"
              promise          = this.promise
              noResults        = true
              pendingMessage   = "Foo"
              noResultsMessage = "Bar"
              rejectedMessage  = "Baz"
            }}
              <p data-test-content>Hello World</p>
            {{/ui-async-block}}
           
      */
      {
        "id": "XFA1/HgV",
        "block": "[[[1,\"\\n\"],[6,[39,0],[\"Witty Catchphrases\"],[[\"promise\",\"noResults\",\"pendingMessage\",\"noResultsMessage\",\"rejectedMessage\"],[[30,0,[\"promise\"]],true,\"Foo\",\"Bar\",\"Baz\"]],[[\"default\"],[[[[1,\"        \"],[10,2],[14,\"data-test-content\",\"\"],[12],[1,\"Hello World\"],[13],[1,\"\\n\"]],[]]]]],[1,\"     \"]],[],false,[\"ui-async-block\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('[data-test-id="load-indicator"]').hasText('Foo');
      await promise;
      await (0, _testHelpers.settled)();
      assert.dom('[data-test-id="no-results-block"]').hasText('Bar');
      await (0, _testHelpers.clearRender)();
      promise = this.set('promise', rejectingPromise());
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            {{#ui-async-block "Witty Catchphrases"
              promise          = this.promise
              pendingMessage   = "Foo"
              rejectedMessage  = "Baz"
            }}
              <p data-test-content>Hello World</p>
            {{/ui-async-block}}
          
      */
      {
        "id": "9yDbt13l",
        "block": "[[[1,\"\\n\"],[6,[39,0],[\"Witty Catchphrases\"],[[\"promise\",\"pendingMessage\",\"rejectedMessage\"],[[30,0,[\"promise\"]],\"Foo\",\"Baz\"]],[[\"default\"],[[[[1,\"        \"],[10,2],[14,\"data-test-content\",\"\"],[12],[1,\"Hello World\"],[13],[1,\"\\n\"]],[]]]]],[1,\"    \"]],[],false,[\"ui-async-block\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      await (0, _silenceExceptions.default)(async () => {
        await promise;
      });
      assert.dom('[data-test-id="error-block"]').hasText('Baz');
    });
    (0, _qunit.test)('it shows fully custom messages via function when provided', async function (assert) {
      let promise = this.set('promise', resolvingPromise());
      this.set('pendingMessageFunction', function (name) {
        return `Pending a response for ${name}`;
      });
      this.set('rejectedMessageFunction', function (name) {
        return `The request for ${name} failed`;
      });
      this.set('noResultsMessageFunction', function (name) {
        return `No results returned for ${name}`;
      });

      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            <UiAsyncBlock
              @name="Witty Catchphrases"
              @promise={{this.promise}}
              @noResults={{true}}
              @pendingMessage={{this.pendingMessageFunction}}
              @noResultsMessage={{this.noResultsMessageFunction}}
              @rejectedMessage={{this.rejectedMessageFunction}}
            >
              <p data-test-content>Hello World</p>
            </ UiAsyncBlock>
          
      */
      {
        "id": "GYzzzE3a",
        "block": "[[[1,\"\\n      \"],[8,[39,0],null,[[\"@name\",\"@promise\",\"@noResults\",\"@pendingMessage\",\"@noResultsMessage\",\"@rejectedMessage\"],[\"Witty Catchphrases\",[30,0,[\"promise\"]],true,[30,0,[\"pendingMessageFunction\"]],[30,0,[\"noResultsMessageFunction\"]],[30,0,[\"rejectedMessageFunction\"]]]],[[\"default\"],[[[[1,\"\\n        \"],[10,2],[14,\"data-test-content\",\"\"],[12],[1,\"Hello World\"],[13],[1,\"\\n      \"]],[]]]]],[1,\"\\n    \"]],[],false,[\"ui-async-block\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('[data-test-id="load-indicator"]').hasText('Pending a response for Witty Catchphrases');
      await promise;
      await (0, _testHelpers.settled)();
      assert.dom('[data-test-id="no-results-block"]').hasText('No results returned for Witty Catchphrases');
      await (0, _testHelpers.clearRender)();
      promise = this.set('promise', rejectingPromise());

      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            <UiAsyncBlock
              @name="Witty Catchphrases"
              @promise={{this.promise}}
              @pendingMessage={{this.pendingMessageFunction}}
              @rejectedMessage={{this.rejectedMessageFunction}}
            >
              <p data-test-content>Hello World</p>
            </ UiAsyncBlock>
          
      */
      {
        "id": "ci4PRbCF",
        "block": "[[[1,\"\\n      \"],[8,[39,0],null,[[\"@name\",\"@promise\",\"@pendingMessage\",\"@rejectedMessage\"],[\"Witty Catchphrases\",[30,0,[\"promise\"]],[30,0,[\"pendingMessageFunction\"]],[30,0,[\"rejectedMessageFunction\"]]]],[[\"default\"],[[[[1,\"\\n        \"],[10,2],[14,\"data-test-content\",\"\"],[12],[1,\"Hello World\"],[13],[1,\"\\n      \"]],[]]]]],[1,\"\\n    \"]],[],false,[\"ui-async-block\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      await (0, _silenceExceptions.default)(async () => {
        await promise;
      });
      assert.dom('[data-test-id="error-block"]').hasText('The request for Witty Catchphrases failed');
    });
  });
});
define("dummy/tests/integration/components/ui-button-test", ["@ember/template-factory", "qunit", "ember-qunit", "@ember/test-helpers"], function (_templateFactory, _qunit, _emberQunit, _testHelpers) {
  "use strict";

  0; //eaimeta@70e063a35619d71f0,"qunit",0,"ember-qunit",0,"@ember/test-helpers",0,"htmlbars-inline-precompile"eaimeta@70e063a35619d71f
  (0, _qunit.module)('Integration | Component | ui-button', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);
    (0, _qunit.test)('it renders a button in a variety of fun styles', async function (assert) {
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        <UiButton @text="Hello World" @variant="primary" @testId="btn" />
      */
      {
        "id": "UfLtjvmh",
        "block": "[[[8,[39,0],null,[[\"@text\",\"@variant\",\"@testId\"],[\"Hello World\",\"primary\",\"btn\"]],null]],[],false,[\"ui-button\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('[data-test-id="btn"]').isVisible();
      assert.dom('[data-test-id="btn"]').hasText('Hello World');
      assert.dom('[data-test-id="btn"]').isEnabled();
      assert.dom('[data-test-id="btn"]').hasClass('btn');
      assert.dom('[data-test-id="btn"]').hasClass('btn-primary');

      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        <UiButton @variant="secondary" @size="lg" @block={{true}}>Foo Bar</UiButton>
      */
      {
        "id": "8ExsD5l7",
        "block": "[[[8,[39,0],null,[[\"@variant\",\"@size\",\"@block\"],[\"secondary\",\"lg\",true]],[[\"default\"],[[[[1,\"Foo Bar\"]],[]]]]]],[],false,[\"ui-button\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('button').isVisible();
      assert.dom('button').hasText('Foo Bar');
      assert.dom('button').isEnabled();
      assert.dom('button').hasClass('btn-secondary');
      assert.dom('button').hasClass('btn-block');
      assert.dom('button').hasClass('btn-lg');
    });
    (0, _qunit.test)('it handles click events', async function (assert) {
      this.set('clickAction', function () {
        assert.step('click');
      });

      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
              <UiButton @text="Hello World" @variant="primary" @onClick={{action this.clickAction}} />
          
      */
      {
        "id": "5YWOPbod",
        "block": "[[[1,\"\\n        \"],[8,[39,0],null,[[\"@text\",\"@variant\",\"@onClick\"],[\"Hello World\",\"primary\",[28,[37,1],[[30,0],[30,0,[\"clickAction\"]]],null]]],null],[1,\"\\n    \"]],[],false,[\"ui-button\",\"action\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      await (0, _testHelpers.click)('button');
      assert.verifySteps(['click']);
    });
    (0, _qunit.test)('it cannot be clicked on when disabled', async function (assert) {
      this.setProperties({
        disabled: false,
        clickAction() {
          assert.step('click A');
        }
      });

      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
              <UiButton
                @text="Hello World"
                @variant="primary"
                @disabled={{this.disabled}}
                @onClick={{action this.clickAction}}
              />
          
      */
      {
        "id": "/BO/SlHt",
        "block": "[[[1,\"\\n        \"],[8,[39,0],null,[[\"@text\",\"@variant\",\"@disabled\",\"@onClick\"],[\"Hello World\",\"primary\",[30,0,[\"disabled\"]],[28,[37,1],[[30,0],[30,0,[\"clickAction\"]]],null]]],null],[1,\"\\n    \"]],[],false,[\"ui-button\",\"action\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      await (0, _testHelpers.click)('button');
      this.setProperties({
        disabled: true,
        clickAction() {
          assert.step('I should not be ran');
        }
      });
      try {
        await (0, _testHelpers.click)('button');
      } catch (e) {
        // Noop. @ember/test-helpers throws and error if the button is
        // disabled when you try to click on it.
      }
      this.setProperties({
        disabled: false,
        clickAction() {
          assert.step('click B');
        }
      });
      await (0, _testHelpers.click)('button');
      assert.verifySteps(['click A', 'click B']);
    });
    (0, _qunit.test)('it goes into a "pending" state when a promise is returned from the onClick action', async function (assert) {
      const promise = new Promise(resolve => setTimeout(resolve, 100));
      this.set('clickAction', function () {
        return promise;
      });

      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        <UiButton @text="Hello World" @onClick={{action this.clickAction}} />
      */
      {
        "id": "O8KsylKP",
        "block": "[[[8,[39,0],null,[[\"@text\",\"@onClick\"],[\"Hello World\",[28,[37,1],[[30,0],[30,0,[\"clickAction\"]]],null]]],null]],[],false,[\"ui-button\",\"action\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      await (0, _testHelpers.click)('button');
      assert.dom('button').isDisabled();
      assert.dom('button span:first-child').hasClass('fa-spinner');
      assert.dom('button span:first-child').hasClass('fa-spin');
      await promise;
      await (0, _testHelpers.settled)();
      assert.dom('button').isEnabled();
      assert.dom('button span').doesNotExist();
    });
    (0, _qunit.test)('it goes into a "pending" state when a promise is provided as an attribute', async function (assert) {
      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        <UiButton @text="Hello World" @promise={{this.promise}} />
      */
      {
        "id": "PelXgVQh",
        "block": "[[[8,[39,0],null,[[\"@text\",\"@promise\"],[\"Hello World\",[30,0,[\"promise\"]]]],null]],[],false,[\"ui-button\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      const promise = new Promise(resolve => setTimeout(resolve, 100));
      this.set('promise', promise);
      await (0, _testHelpers.settled)();
      assert.dom('button').isDisabled();
      assert.dom('button span:first-child').hasClass('fa-spinner');
      assert.dom('button span:first-child').hasClass('fa-spin');
      await promise;
      await (0, _testHelpers.settled)();
      assert.dom('button').isEnabled();
      assert.dom('button span').doesNotExist();
    });
    (0, _qunit.test)('it renders icons', async function (assert) {
      this.set('iconPlacement', 'left');

      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        <UiButton @text="Hello World" @icon="search" @iconPlacement={{this.iconPlacement}} />
      */
      {
        "id": "sYnwZ2LM",
        "block": "[[[8,[39,0],null,[[\"@text\",\"@icon\",\"@iconPlacement\"],[\"Hello World\",\"search\",[30,0,[\"iconPlacement\"]]]],null]],[],false,[\"ui-button\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('button span:nth-child(1)').hasClass('fa-search');
      this.set('iconPlacement', 'right');
      assert.dom('button span:nth-child(2)').hasClass('fa-search');
    });
    (0, _qunit.test)('it can be disabled', async function (assert) {
      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        <UiButton @text="Hello World" @disabled={{true}} />
      */
      {
        "id": "mfVvbfaQ",
        "block": "[[[8,[39,0],null,[[\"@text\",\"@disabled\"],[\"Hello World\",true]],null]],[],false,[\"ui-button\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('button').isDisabled();
    });
    (0, _qunit.test)('it has numerous other attribute bindings', async function (assert) {
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            <UiButton @text="Hello World"
              @title="Foo"
              @type="submit"
              @ariaExpanded="true"
              @ariaLabel="Bar"
              @ariaLabelledBy="123"
              @ariaDescribedBy="456"
              @ariaControls="789"
              @ariaSelected="false"
              @ariaHasPopup="000"
              @tabIndex="-1"
            />
          
      */
      {
        "id": "yvH2lELD",
        "block": "[[[1,\"\\n      \"],[8,[39,0],null,[[\"@text\",\"@title\",\"@type\",\"@ariaExpanded\",\"@ariaLabel\",\"@ariaLabelledBy\",\"@ariaDescribedBy\",\"@ariaControls\",\"@ariaSelected\",\"@ariaHasPopup\",\"@tabIndex\"],[\"Hello World\",\"Foo\",\"submit\",\"true\",\"Bar\",\"123\",\"456\",\"789\",\"false\",\"000\",\"-1\"]],null],[1,\"\\n    \"]],[],false,[\"ui-button\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('button').hasAttribute('title', 'Foo');
      assert.dom('button').hasAttribute('type', 'submit');
      assert.dom('button').hasAttribute('aria-expanded', 'true');
      assert.dom('button').hasAttribute('aria-label', 'Bar');
      assert.dom('button').hasAttribute('aria-labelledby', '123');
      assert.dom('button').hasAttribute('aria-describedby', '456');
      assert.dom('button').hasAttribute('aria-controls', '789');
      assert.dom('button').hasAttribute('aria-selected', 'false');
      assert.dom('button').hasAttribute('aria-haspopup', '000');
      assert.dom('button').hasAttribute('tabindex', '-1');
    });
    (0, _qunit.test)('it can display a tooltip while being "disabled"', async function (assert) {
      this.set('disabled', false);
      this.set('handleClick', () => {
        throw new Error('onClick should be disabled');
      });

      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
              <UiButton
                @text="Hello World"
                @disabledTooltip="Lorem Ipsum"
                @disabled={{this.disabled}}
                @onClick={{this.handleClick}}
              />
          
      */
      {
        "id": "l6oyU/I9",
        "block": "[[[1,\"\\n        \"],[8,[39,0],null,[[\"@text\",\"@disabledTooltip\",\"@disabled\",\"@onClick\"],[\"Hello World\",\"Lorem Ipsum\",[30,0,[\"disabled\"]],[30,0,[\"handleClick\"]]]],null],[1,\"\\n    \"]],[],false,[\"ui-button\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('button').isNotDisabled().hasText('Hello World').doesNotHaveAttribute('aria-disabled').doesNotHaveAttribute('tabindex').doesNotHaveClass('disabled');
      assert.dom('button .fa').doesNotExist();
      this.set('disabled', true);
      assert.dom('button').isNotDisabled().hasAttribute('aria-disabled', 'true').hasAttribute('tabindex', '-1').hasClass('disabled');
      assert.dom('button .fa').doesNotExist();
      assert.dom('.tooltip').exists().isNotVisible();
      await (0, _testHelpers.focus)('button');
      assert.dom('.tooltip').isVisible();
      await (0, _testHelpers.click)('button');
    });
  });
});
define("dummy/tests/integration/components/ui-collapse-test", ["@ember/template-factory", "qunit", "ember-qunit", "@ember/test-helpers"], function (_templateFactory, _qunit, _emberQunit, _testHelpers) {
  "use strict";

  0; //eaimeta@70e063a35619d71f0,"qunit",0,"ember-qunit",0,"@ember/test-helpers",0,"htmlbars-inline-precompile"eaimeta@70e063a35619d71f
  // // @ts-expect-error - Testing testing 1, 2, 3
  // window.__WAIT_FOR_TRANSITION_END__ = true;

  (0, _qunit.module)('Integration | Component | ui-collapse', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);
    (0, _qunit.test)('it vertically expands a block element', async function (assert) {
      this.set('collapsed', true);

      // language=Handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        <UiCollapse @collapsed={{this.collapsed}}>
                <div style="border: solid 1px #000; padding: 20px; background: #fff;">
                    Hello World
                </div>
            </UiCollapse>
      */
      {
        "id": "TeoxOtu4",
        "block": "[[[8,[39,0],null,[[\"@collapsed\"],[[30,0,[\"collapsed\"]]]],[[\"default\"],[[[[1,\"\\n          \"],[10,0],[14,5,\"border: solid 1px #000; padding: 20px; background: #fff;\"],[12],[1,\"\\n              Hello World\\n          \"],[13],[1,\"\\n      \"]],[]]]]]],[],false,[\"ui-collapse\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('.ui-collapse').exists();
      assert.dom('.ui-collapse').hasClass('collapse');
      assert.dom('.ui-collapse').doesNotHaveClass('show');
      assert.dom('.ui-collapse').isNotVisible();
      assert.dom('.ui-collapse').hasStyle({
        height: 'auto'
      });
      this.set('collapsed', false);
      await (0, _testHelpers.waitFor)('.ui-collapse.collapsing');
      await (0, _testHelpers.waitFor)('.ui-collapse.show');
      assert.dom('.ui-collapse').hasClass('show');
      assert.dom('.ui-collapse').isVisible();
      assert.dom('.ui-collapse').hasStyle({
        height: `${(0, _testHelpers.find)('.ui-collapse')?.scrollHeight}px`
      });
      this.set('collapsed', true);
      await (0, _testHelpers.waitFor)('.ui-collapse.collapsing');
      await (0, _testHelpers.waitFor)('.ui-collapse.collapse');
      assert.dom('.ui-collapse').doesNotHaveClass('show');
      assert.dom('.ui-collapse').isNotVisible();
      assert.dom('.ui-collapse').hasStyle({
        height: 'auto'
      });
    });
    (0, _qunit.test)('it can start in the expanded state', async function (assert) {
      this.set('collapsed', false);

      // language=Handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        <UiCollapse @collapsed={{this.collapsed}}>
                <div style="border: solid 1px #000; padding: 20px; background: #fff;">
                    Hello World
                </div>
            </UiCollapse>
      */
      {
        "id": "TeoxOtu4",
        "block": "[[[8,[39,0],null,[[\"@collapsed\"],[[30,0,[\"collapsed\"]]]],[[\"default\"],[[[[1,\"\\n          \"],[10,0],[14,5,\"border: solid 1px #000; padding: 20px; background: #fff;\"],[12],[1,\"\\n              Hello World\\n          \"],[13],[1,\"\\n      \"]],[]]]]]],[],false,[\"ui-collapse\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('.ui-collapse').hasClass('show');
      assert.dom('.ui-collapse').isVisible();
      assert.dom('.ui-collapse').hasStyle({
        height: `${(0, _testHelpers.find)('.ui-collapse')?.scrollHeight}px`
      });
      this.set('collapsed', true);
      await (0, _testHelpers.waitFor)('.ui-collapse.collapsing');
      await (0, _testHelpers.waitFor)('.ui-collapse.collapse');
      assert.dom('.ui-collapse').doesNotHaveClass('show');
      assert.dom('.ui-collapse').isNotVisible();
      assert.dom('.ui-collapse').hasStyle({
        height: 'auto'
      });
    });
    (0, _qunit.test)('it runs provided callback actions', async function (assert) {
      this.set('collapsed', true);
      this.set('handleOnShow', function () {
        assert.step('onShow');
      });
      this.set('handleOnShown', function () {
        assert.step('onShown');
      });
      this.set('handleOnHide', function () {
        assert.step('onHide');
      });
      this.set('handleOnHidden', function () {
        assert.step('onHidden');
      });

      // language=Handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        <UiCollapse
                    @collapsed={{this.collapsed}}
                    @onShow={{this.handleOnShow}}
                    @onShown={{this.handleOnShown}}
                    @onHide={{this.handleOnHide}}
                    @onHidden={{this.handleOnHidden}}
            >
                <div style="border: solid 1px #000; padding: 20px; background: #fff;">
                    Hello World
                </div>
            </UiCollapse>
      */
      {
        "id": "6Bk1X3zf",
        "block": "[[[8,[39,0],null,[[\"@collapsed\",\"@onShow\",\"@onShown\",\"@onHide\",\"@onHidden\"],[[30,0,[\"collapsed\"]],[30,0,[\"handleOnShow\"]],[30,0,[\"handleOnShown\"]],[30,0,[\"handleOnHide\"]],[30,0,[\"handleOnHidden\"]]]],[[\"default\"],[[[[1,\"\\n          \"],[10,0],[14,5,\"border: solid 1px #000; padding: 20px; background: #fff;\"],[12],[1,\"\\n              Hello World\\n          \"],[13],[1,\"\\n      \"]],[]]]]]],[],false,[\"ui-collapse\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      this.set('collapsed', false);
      await (0, _testHelpers.waitFor)('.ui-collapse.show');
      this.set('collapsed', true);
      await (0, _testHelpers.waitFor)('.ui-collapse.collapse');
      assert.verifySteps(['onShow', 'onShown', 'onHide', 'onHidden']);
    });
    (0, _qunit.test)('it can have its expanded and collapsed size explicitly set', async function (assert) {
      this.set('collapsed', true);
      this.set('expandedSize', 40);
      this.set('collapsedSize', 10);

      // language=Handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        <UiCollapse
                    @collapsed={{this.collapsed}}
                    @expandedSize={{this.expandedSize}}
                    @collapsedSize={{this.collapsedSize}}
                    @resetSizeBetweenTransitions={{false}}
            >
                <div style="border: solid 1px #000; padding: 20px; background: #fff;">
                    Hello World
                </div>
            </UiCollapse>
      */
      {
        "id": "N7zTNsVp",
        "block": "[[[8,[39,0],null,[[\"@collapsed\",\"@expandedSize\",\"@collapsedSize\",\"@resetSizeBetweenTransitions\"],[[30,0,[\"collapsed\"]],[30,0,[\"expandedSize\"]],[30,0,[\"collapsedSize\"]],false]],[[\"default\"],[[[[1,\"\\n          \"],[10,0],[14,5,\"border: solid 1px #000; padding: 20px; background: #fff;\"],[12],[1,\"\\n              Hello World\\n          \"],[13],[1,\"\\n      \"]],[]]]]]],[],false,[\"ui-collapse\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      this.set('collapsed', false);
      await (0, _testHelpers.waitFor)('.ui-collapse.show');
      assert.dom('.ui-collapse').hasAttribute('style', 'height: 40px;');
      this.set('expandedSize', 30);
      await (0, _testHelpers.settled)();
      assert.dom('.ui-collapse').hasAttribute('style', 'height: 30px;');
      this.set('collapsed', true);
      await (0, _testHelpers.waitFor)('.ui-collapse.collapse');
      assert.dom('.ui-collapse').hasAttribute('style', 'height: 10px;');
      this.set('collapsedSize', 20);
      await (0, _testHelpers.settled)();
      assert.dom('.ui-collapse').hasAttribute('style', 'height: 20px;');
    });
    (0, _qunit.test)('it waits for rendering to finish before moving past "onShow"', async function (assert) {
      // It is a fairly common pattern to have the onShow action doing something that
      // causes the content of the ui-collapse component to change. Those changes need
      // to occur before the final size to expand to is calculated so there isn't an abrupt
      // visual jerk at the end of the animation.

      // The way that this works is to capture an initial size of the expanded block.
      // Collapse it. Expand it again, and in doing so trigger some additional content to be
      // rendered. The new size that it has calculated as what it needs to transition to
      // should be larger than the original.

      function fromPx(str) {
        return typeof str === 'string' ? parseInt(str.replace(/\D/g, ''), 10) : undefined;
      }
      this.set('collapsed', false);
      this.set('showMore', false);
      this.set('handleOnShow', () => {
        this.set('showMore', true);
      });

      // language=Handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        <UiCollapse
                    @collapsed={{this.collapsed}}
                    @onShow={{action this.handleOnShow}}
            >
                <div style="border: solid 1px #000; padding: 20px; background: #fff;">
                    Hello World
                    {{#if this.showMore}}<p>Foo Bar Baz</p>{{/if}}
                </div>
            </UiCollapse>
      */
      {
        "id": "Y+51P9ez",
        "block": "[[[8,[39,0],null,[[\"@collapsed\",\"@onShow\"],[[30,0,[\"collapsed\"]],[28,[37,1],[[30,0],[30,0,[\"handleOnShow\"]]],null]]],[[\"default\"],[[[[1,\"\\n          \"],[10,0],[14,5,\"border: solid 1px #000; padding: 20px; background: #fff;\"],[12],[1,\"\\n              Hello World\\n              \"],[41,[30,0,[\"showMore\"]],[[[10,2],[12],[1,\"Foo Bar Baz\"],[13]],[]],null],[1,\"\\n          \"],[13],[1,\"\\n      \"]],[]]]]]],[],false,[\"ui-collapse\",\"action\",\"if\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      const originalHeight = (0, _testHelpers.find)('.ui-collapse')?.scrollHeight || 0;
      this.set('collapsed', true);
      await (0, _testHelpers.settled)();
      this.set('collapsed', false);
      await (0, _testHelpers.waitUntil)(() => fromPx((0, _testHelpers.find)('.ui-collapse')?.getAttribute('style')) || 0 > 0);
      const newHeight = fromPx((0, _testHelpers.find)('.ui-collapse')?.getAttribute('style')) || 0;
      assert.ok(newHeight > originalHeight, `The new block height (${newHeight}px) is greater than the original (${originalHeight}px)`);
    });
  });
});
define("dummy/tests/integration/components/ui-filter-test", ["@ember/template-factory", "qunit", "ember-qunit", "@ember/test-helpers"], function (_templateFactory, _qunit, _emberQunit, _testHelpers) {
  "use strict";

  0; //eaimeta@70e063a35619d71f0,"qunit",0,"ember-qunit",0,"@ember/test-helpers",0,"htmlbars-inline-precompile"eaimeta@70e063a35619d71f
  (0, _qunit.module)('Integration | Component | ui-filter', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);
    const recordSet = [{
      name: 'Herbert Labadie',
      email: 'Rashad.Littel63@gmail.com',
      isAdmin: false,
      age: 37,
      hobbies: []
    }, {
      name: 'Caleb Welch DDS',
      email: 'Christelle.Schroeder97@hotmail.com',
      isAdmin: true,
      age: 51,
      hobbies: []
    }, {
      name: 'Ms. Lila Yundt',
      email: 'Eryn.Barton@yahoo.com',
      isAdmin: true,
      age: 31,
      hobbies: 'camping'
    }, {
      name: 'Mr. Brittany Kuhic',
      email: 'Amelia51@yahoo.com',
      isAdmin: false,
      age: 20,
      hobbies: ['camping', 'hiking']
    }, {
      name: 'Terence Brakus',
      email: 'Jovany.Ferry82@hotmail.com',
      isAdmin: false,
      age: 41,
      hobbies: 'knitting'
    }, {
      name: 'Iris Feil',
      email: 'Raleigh_Mills5@yahoo.com',
      isAdmin: false,
      age: 37,
      hobbies: ['fishing']
    }, {
      name: 'Homer Dietrich',
      email: 'Hershel_Barrows48@gmail.com',
      isAdmin: true,
      age: 24,
      hobbies: ['archery']
    }, {
      name: 'Karla Hayes',
      email: 'Daisy18@gmail.com',
      isAdmin: false,
      age: 19,
      hobbies: ['camping', 'cooking']
    }, {
      name: 'Stacy Moen',
      email: 'Keeley.Wolf60@yahoo.com',
      isAdmin: false,
      age: 36,
      hobbies: null
    }, {
      name: 'Clifton Koelpin',
      email: 'Erick.Herzog49@gmail.com',
      isAdmin: false,
      age: undefined,
      hobbies: undefined
    }, {
      name: 'Olive Debra Abernathy',
      email: 'Nellie39@gmail.com',
      isAdmin: false,
      age: null,
      hobbies: false
    }, {
      name: 'Debra Feil',
      email: 'Roberta26@hotmail.com',
      isAdmin: true,
      age: 33,
      hobbies: ['baseball']
    }, {
      name: 'Ms. Melody Kreiger',
      email: 'Toni85@gmail.com',
      isAdmin: false,
      age: 29,
      hobbies: ['LARP', 'D&D']
    }, {
      name: 'Lyle Halvorson II',
      email: 'Rose9@gmail.com',
      isAdmin: false,
      age: 37,
      hobbies: ['water polo']
    }, {
      name: 'Mr. Belinda Emard Sr.',
      email: 'Jared.Kuhn@hotmail.com',
      isAdmin: false,
      age: 35,
      hobbies: ['photography']
    }];
    async function renderComponent() {
      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            <UiFilter
              @records={{this.recordSet}}
              @filterRules={{this.filterRules}}
              @filterMethod={{this.filterMethod}}
              @updateDelay={{16}}
              @advancedQueryUpdateDelay={{16}}
            as |Filter|>
              <Filter.Input
                @filters={{this.filters}}
                @showClearButton={{this.showClearButton}}
              />
      
              <table>
                <tbody>
                  {{#each Filter.filteredRecords as |record|}}
                    <tr>
                      <td>{{record.name}}</td>
                      <td>{{record.email}}</td>
                      <td>{{if record.isAdmin 'Admin' 'Non-Admin'}}</td>
                    </tr>
                  {{/each}}
                </tbody>
              </table>
            </UiFilter>
          
      */
      {
        "id": "duOHHXTM",
        "block": "[[[1,\"\\n      \"],[8,[39,0],null,[[\"@records\",\"@filterRules\",\"@filterMethod\",\"@updateDelay\",\"@advancedQueryUpdateDelay\"],[[30,0,[\"recordSet\"]],[30,0,[\"filterRules\"]],[30,0,[\"filterMethod\"]],16,16]],[[\"default\"],[[[[1,\"\\n        \"],[8,[30,1,[\"Input\"]],null,[[\"@filters\",\"@showClearButton\"],[[30,0,[\"filters\"]],[30,0,[\"showClearButton\"]]]],null],[1,\"\\n\\n        \"],[10,\"table\"],[12],[1,\"\\n          \"],[10,\"tbody\"],[12],[1,\"\\n\"],[42,[28,[37,2],[[28,[37,2],[[30,1,[\"filteredRecords\"]]],null]],null],null,[[[1,\"              \"],[10,\"tr\"],[12],[1,\"\\n                \"],[10,\"td\"],[12],[1,[30,2,[\"name\"]]],[13],[1,\"\\n                \"],[10,\"td\"],[12],[1,[30,2,[\"email\"]]],[13],[1,\"\\n                \"],[10,\"td\"],[12],[1,[52,[30,2,[\"isAdmin\"]],\"Admin\",\"Non-Admin\"]],[13],[1,\"\\n              \"],[13],[1,\"\\n\"]],[2]],null],[1,\"          \"],[13],[1,\"\\n        \"],[13],[1,\"\\n      \"]],[1]]]]],[1,\"\\n    \"]],[\"Filter\",\"record\"],false,[\"ui-filter\",\"each\",\"-track-array\",\"if\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
    }
    (0, _qunit.test)('it filters an array using string filter rules', async function (assert) {
      this.set('recordSet', recordSet);
      this.set('filterRules', ['name', 'email', 'doesNotExist']);
      await renderComponent();
      assert.dom('table tbody tr').exists({
        count: 15
      });
      assert.dom('input[type="text"]').hasNoValue();
      await (0, _testHelpers.fillIn)('input[type="text"]', '@hotmail.com');
      assert.dom('table tbody tr').exists({
        count: 4
      });
      await (0, _testHelpers.fillIn)('input[type="text"]', '@noexist.com');
      assert.dom('table tbody tr').doesNotExist();
      await (0, _testHelpers.fillIn)('input[type="text"]', '');
      assert.dom('table tbody tr').exists({
        count: 15
      });
    });
    (0, _qunit.test)('it filters an array using object filter rules', async function (assert) {
      this.set('recordSet', recordSet);
      this.set('filterRules', [{
        propertyName: 'name',
        startsWith: true,
        caseSensitive: true
      }, {
        propertyName: 'email',
        exactMatch: true
      }, {
        propertyName: 'isAdmin',
        exactMatch: true,
        booleanMap: ['Admin', 'Non-Admin']
      }, 'age']);
      await renderComponent();
      assert.dom('table tbody tr').exists({
        count: 15
      });
      assert.dom('input[type="text"]').hasNoValue();
      await (0, _testHelpers.fillIn)('input[type="text"]', '@hotmail.com');
      assert.dom('table tbody tr').doesNotExist();
      await (0, _testHelpers.fillIn)('input[type="text"]', 'Hershel_Barrows48@gmail.com');
      assert.dom('table tbody tr').exists({
        count: 1
      });
      await (0, _testHelpers.fillIn)('input[type="text"]', 'Mr.');
      assert.dom('table tbody tr').exists({
        count: 2
      });
      await (0, _testHelpers.fillIn)('input[type="text"]', 'debra');
      assert.dom('table tbody tr').doesNotExist();
      await (0, _testHelpers.fillIn)('input[type="text"]', 'Debra');
      assert.dom('table tbody tr').exists({
        count: 1
      });
      await (0, _testHelpers.fillIn)('input[type="text"]', '37');
      assert.dom('table tbody tr').exists({
        count: 3
      });
      await (0, _testHelpers.fillIn)('input[type="text"]', 'Admin');
      assert.dom('table tbody tr').exists({
        count: 4
      });
      await (0, _testHelpers.fillIn)('input[type="text"]', 'Non-Admin');
      assert.dom('table tbody tr').exists({
        count: 11
      });
    });
    (0, _qunit.test)('it filters an array using a custom method', async function (assert) {
      this.set('recordSet', recordSet);
      this.set('filterMethod', function (term, records) {
        const regex = new RegExp(term, 'i');
        return records.filter(record => {
          return regex.test(record.name) || regex.test(record.age?.toString() ?? '');
        });
      });
      await renderComponent();
      assert.dom('table tbody tr').exists({
        count: 15
      });
      assert.dom('input[type="text"]').hasNoValue();
      await (0, _testHelpers.fillIn)('input[type="text"]', '37');
      assert.dom('table tbody tr').exists({
        count: 3
      });
      await (0, _testHelpers.fillIn)('input[type="text"]', 'Mr.');
      assert.dom('table tbody tr').exists({
        count: 2
      });
      await (0, _testHelpers.fillIn)('input[type="text"]', 'Non-Admin');
      assert.dom('table tbody tr').doesNotExist();
    });
    (0, _qunit.test)('it filters an array using the query parser', async function (assert) {
      this.set('recordSet', recordSet);
      await renderComponent();
      assert.dom('table tbody tr').exists({
        count: 15
      });
      assert.dom('input[type="text"]').hasNoValue();
      await (0, _testHelpers.fillIn)('input[type="text"]', 'QUERY: age EQUALS 37');
      assert.dom('table tbody tr').exists({
        count: 3
      });
      await (0, _testHelpers.fillIn)('input[type="text"]', 'QUERY: name DOES NOT START WITH "Lyle"');
      assert.dom('table tbody tr').exists({
        count: 14
      });
      await (0, _testHelpers.fillIn)('input[type="text"]', 'QUERY: age EQUALS null OR age EQUALS undefined');
      assert.dom('table tbody tr').exists({
        count: 2
      });
      await (0, _testHelpers.fillIn)('input[type="text"]', 'QUERY: name DOES NOT END WITH "Feil"');
      assert.dom('table tbody tr').exists({
        count: 13
      });
      await (0, _testHelpers.fillIn)('input[type="text"]', 'QUERY: age EQUALS 37 AND name STARTS WITH "Lyle"');
      assert.dom('table tbody tr').exists({
        count: 1
      });
      await (0, _testHelpers.fillIn)('input[type="text"]', 'QUERY: email INCLUDES "hotmail"');
      assert.dom('table tbody tr').exists({
        count: 4
      });
      await (0, _testHelpers.fillIn)('input[type="text"]', 'QUERY: hobbies INCLUDES "cooking"');
      assert.dom('table tbody tr').exists({
        count: 1
      });
      await (0, _testHelpers.fillIn)('input[type="text"]', 'QUERY: (isAdmin EQUALS true AND name ENDS WITH "Yundt") OR isAdmin DOES NOT EQUAL true');
      assert.dom('table tbody tr').exists({
        count: 12
      });
      await (0, _testHelpers.fillIn)('input[type="text"]', 'QUERY: (isAdmin EQUALS true AND (name ENDS WITH "Yundt" OR name INCLUDES "ebra Fei")) OR isAdmin DOES NOT EQUAL true');
      assert.dom('table tbody tr').exists({
        count: 13
      });
      await (0, _testHelpers.fillIn)('input[type="text"]', 'QUERY: (age EQUALS 37');
      assert.dom('.tooltip-danger').containsText('does not have a closing brace');
      await (0, _testHelpers.fillIn)('input[type="text"]', 'QUERY: age FOO 37');
      assert.dom('.tooltip-danger').containsText('Unexpected value "FOO"');
    });
    (0, _qunit.test)('it can be given pre-determined filter values', async function (assert) {
      this.set('recordSet', recordSet);
      this.set('filterRules', ['name', 'email']);
      this.set('showClearButton', true);
      this.set('filters', [{
        label: 'People Named Homer',
        value: 'Homer'
      }, {
        label: 'Non-Hotmail Addresses',
        value: 'QUERY: email DOES NOT END WITH "@hotmail.com"'
      }]);
      await renderComponent();
      assert.dom('table tbody tr').exists({
        count: 15
      });
      assert.dom('input[type="text"]').hasNoValue();
      const menuId = `#${(0, _testHelpers.find)('.input-group button')?.getAttribute('aria-controls')}`;
      assert.dom('.input-group button').hasText('Filters');
      assert.dom(menuId).exists().isNotVisible();
      await (0, _testHelpers.click)('.input-group button');
      assert.dom(menuId).isVisible();
      assert.dom(`${menuId} button`).exists({
        count: 2
      });
      assert.dom(`${menuId} button:nth-child(1)`).hasText('People Named Homer');
      assert.dom(`${menuId} button:nth-child(2)`).hasText('Non-Hotmail Addresses');
      await (0, _testHelpers.click)(`${menuId} button:nth-child(2)`);
      assert.dom(menuId).exists().isNotVisible();
      assert.dom('input[type="text"]').isFocused().hasValue('QUERY: email DOES NOT END WITH "@hotmail.com"');
      assert.dom('table tbody tr').exists({
        count: 11
      });
      assert.dom('.input-group .input-group-btn:last-child button').hasAria('label', 'Reset Filter Input Field');
      await (0, _testHelpers.click)('.input-group .input-group-btn:last-child button');
      assert.dom('input[type="text"]').hasNoValue();
    });
  });
});
define("dummy/tests/integration/components/ui-heading-test", ["@ember/template-factory", "qunit", "ember-qunit", "@ember/test-helpers", "@nsf-open/ember-ui-foundation/constants"], function (_templateFactory, _qunit, _emberQunit, _testHelpers, _constants) {
  "use strict";

  0; //eaimeta@70e063a35619d71f0,"qunit",0,"ember-qunit",0,"@ember/test-helpers",0,"htmlbars-inline-precompile",0,"@nsf-open/ember-ui-foundation/constants"eaimeta@70e063a35619d71f
  (0, _qunit.module)('Integration | Component | ui-heading', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);
    (0, _qunit.test)('it will render the heading levels H1 - H6', async function (assert) {
      this.set('level', _constants.HeadingLevels.H1);

      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        <UiHeading @level={{this.level}} @text="Hello World" @class="a-heading-class" />
      */
      {
        "id": "E3K5E1Y8",
        "block": "[[[8,[39,0],null,[[\"@level\",\"@text\",\"@class\"],[[30,0,[\"level\"]],\"Hello World\",\"a-heading-class\"]],null]],[],false,[\"ui-heading\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('h1').hasText('Hello World');
      assert.dom('h1').hasClass('a-heading-class');
      this.set('level', _constants.HeadingLevels.H2);
      assert.dom('h2').hasText('Hello World');
      this.set('level', _constants.HeadingLevels.H3);
      assert.dom('h3').hasText('Hello World');
      this.set('level', _constants.HeadingLevels.H4);
      assert.dom('h4').hasText('Hello World');
      this.set('level', _constants.HeadingLevels.H5);
      assert.dom('h5').hasText('Hello World');
      this.set('level', _constants.HeadingLevels.H6);
      assert.dom('h6').hasText('Hello World');
    });
    (0, _qunit.test)('it will render the heading levels H1 - H6 with a content block', async function (assert) {
      this.set('level', _constants.HeadingLevels.H1);

      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        <UiHeading @level={{this.level}} @class="a-heading-class">Hello World</UiHeading>
      */
      {
        "id": "ZjKzrZO+",
        "block": "[[[8,[39,0],null,[[\"@level\",\"@class\"],[[30,0,[\"level\"]],\"a-heading-class\"]],[[\"default\"],[[[[1,\"Hello World\"]],[]]]]]],[],false,[\"ui-heading\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('h1').hasText('Hello World');
      assert.dom('h1').hasClass('a-heading-class');
      this.set('level', _constants.HeadingLevels.H2);
      assert.dom('h2').hasText('Hello World');
      this.set('level', _constants.HeadingLevels.H3);
      assert.dom('h3').hasText('Hello World');
      this.set('level', _constants.HeadingLevels.H4);
      assert.dom('h4').hasText('Hello World');
      this.set('level', _constants.HeadingLevels.H5);
      assert.dom('h5').hasText('Hello World');
      this.set('level', _constants.HeadingLevels.H6);
      assert.dom('h6').hasText('Hello World');
    });
  });
});
define("dummy/tests/integration/components/ui-icon-test", ["@ember/template-factory", "qunit", "ember-qunit", "@ember/test-helpers"], function (_templateFactory, _qunit, _emberQunit, _testHelpers) {
  "use strict";

  0; //eaimeta@70e063a35619d71f0,"qunit",0,"ember-qunit",0,"@ember/test-helpers",0,"htmlbars-inline-precompile"eaimeta@70e063a35619d71f
  (0, _qunit.module)('Integration | Component | ui-icon', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);
    (0, _qunit.test)('it renders a span element with Font Awesome class names', async function (assert) {
      this.set('iconName', 'superpowers');
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        <UiIcon @name="{{this.iconName}}" />
      */
      {
        "id": "i3gM33cW",
        "block": "[[[8,[39,0],null,[[\"@name\"],[[29,[[30,0,[\"iconName\"]]]]]],null]],[],false,[\"ui-icon\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('span').exists();
      assert.dom('span').hasAria('hidden', 'true');
      assert.dom('span').hasClass('fa');
      assert.dom('span').hasClass('fa-superpowers');
      this.set('iconName', 'mail');
      assert.dom('span').hasClass('fa-mail');
    });
    (0, _qunit.test)('it supports fixed width icons', async function (assert) {
      this.set('iconName', 'superpowers');
      this.set('fixedWidth', false);
      await (0, _testHelpers.render)( // language=Handlebars
      (0, _templateFactory.createTemplateFactory)(
      /*
        <UiIcon @name="{{this.iconName}}" @fw={{this.fixedWidth}} />
      */
      {
        "id": "cDsxx/tb",
        "block": "[[[8,[39,0],null,[[\"@name\",\"@fw\"],[[29,[[30,0,[\"iconName\"]]]],[30,0,[\"fixedWidth\"]]]],null]],[],false,[\"ui-icon\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('span').hasClass('fa');
      assert.dom('span').hasClass('fa-superpowers');
      assert.dom('span').doesNotHaveClass('fa-fw');
      this.set('fixedWidth', true);
      assert.dom('span').hasClass('fa-superpowers');
      assert.dom('span').hasClass('fa-fw');
      this.set('iconName', 'mail');
      assert.dom('span').hasClass('fa-mail');
      assert.dom('span').hasClass('fa-fw');
    });
    (0, _qunit.test)('it supports spinning icons', async function (assert) {
      this.set('iconName', 'superpowers');
      this.set('spin', false);
      await (0, _testHelpers.render)( // language=Handlebars
      (0, _templateFactory.createTemplateFactory)(
      /*
        <UiIcon @name="{{this.iconName}}" @spin={{this.spin}} />
      */
      {
        "id": "UJKGh/4r",
        "block": "[[[8,[39,0],null,[[\"@name\",\"@spin\"],[[29,[[30,0,[\"iconName\"]]]],[30,0,[\"spin\"]]]],null]],[],false,[\"ui-icon\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('span').hasClass('fa');
      assert.dom('span').hasClass('fa-superpowers');
      assert.dom('span').doesNotHaveClass('fa-spin');
      this.set('spin', true);
      assert.dom('span').hasClass('fa-superpowers');
      assert.dom('span').hasClass('fa-spin');
      this.set('iconName', 'mail');
      assert.dom('span').hasClass('fa-mail');
      assert.dom('span').hasClass('fa-spin');
    });
    (0, _qunit.test)('it has a special pending style that will always show a loading spinner', async function (assert) {
      this.set('iconName', 'superpowers');
      this.set('pending', false);
      await (0, _testHelpers.render)( // language=Handlebars
      (0, _templateFactory.createTemplateFactory)(
      /*
        <UiIcon @name="{{this.iconName}}" @pending={{this.pending}} />
      */
      {
        "id": "5ylFKsYX",
        "block": "[[[8,[39,0],null,[[\"@name\",\"@pending\"],[[29,[[30,0,[\"iconName\"]]]],[30,0,[\"pending\"]]]],null]],[],false,[\"ui-icon\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('span').hasClass('fa');
      assert.dom('span').hasClass('fa-superpowers');
      assert.dom('span').doesNotHaveClass('fa-spin');
      assert.dom('span').doesNotHaveClass('fa-spinner');
      this.set('pending', true);
      assert.dom('span').doesNotHaveClass('fa-superpowers');
      assert.dom('span').hasClass('fa-spin');
      assert.dom('span').hasClass('fa-spinner');
    });
  });
});
define("dummy/tests/integration/components/ui-inline-text-icon-layout-test", ["@ember/template-factory", "qunit", "ember-qunit", "@ember/test-helpers"], function (_templateFactory, _qunit, _emberQunit, _testHelpers) {
  "use strict";

  0; //eaimeta@70e063a35619d71f0,"qunit",0,"ember-qunit",0,"@ember/test-helpers",0,"htmlbars-inline-precompile"eaimeta@70e063a35619d71f
  (0, _qunit.module)('Integration | Component | ui-inline-text-icon-layout', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);
    (0, _qunit.test)('it renders text', async function (assert) {
      this.set('text', 'Hello World');
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        <UiInlineTextIconLayout @text="{{this.text}}" />
      */
      {
        "id": "UqUP5JpK",
        "block": "[[[8,[39,0],null,[[\"@text\"],[[29,[[30,0,[\"text\"]]]]]],null]],[],false,[\"ui-inline-text-icon-layout\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom().hasText('Hello World');
      assert.dom('span').doesNotExist();
      this.set('text', 'foobar');
      assert.dom().hasText('foobar');
    });
    (0, _qunit.test)('it renders an icon followed by text', async function (assert) {
      this.set('icon', 'superpowers');

      // Inline
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        <UiInlineTextIconLayout @text="Hello World" @icon="{{this.icon}}" />
      */
      {
        "id": "22nu6xuR",
        "block": "[[[8,[39,0],null,[[\"@text\",\"@icon\"],[\"Hello World\",[29,[[30,0,[\"icon\"]]]]]],null]],[],false,[\"ui-inline-text-icon-layout\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('span:nth-child(1)').hasClass('fa');
      assert.dom('span:nth-child(1)').hasClass('fa-superpowers');
      assert.dom('span:nth-child(2)').hasText('Hello World');
      assert.dom('span:nth-child(2)').hasClass('ml-5px');
      this.set('icon', 'mail');
      assert.dom('span:nth-child(1)').hasClass('fa-mail');
    });
    (0, _qunit.test)('it renders text followed by an icon', async function (assert) {
      this.set('icon', 'superpowers');
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        <UiInlineTextIconLayout @text="Hello World" @icon="{{this.icon}}" @iconPlacement="right" />
      */
      {
        "id": "9dc0AX8I",
        "block": "[[[8,[39,0],null,[[\"@text\",\"@icon\",\"@iconPlacement\"],[\"Hello World\",[29,[[30,0,[\"icon\"]]]],\"right\"]],null]],[],false,[\"ui-inline-text-icon-layout\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('span:nth-child(1)').hasText('Hello World');
      assert.dom('span:nth-child(1)').hasClass('mr-5px');
      assert.dom('span:nth-child(2)').hasClass('fa');
      assert.dom('span:nth-child(2)').hasClass('fa-superpowers');
      this.set('icon', 'mail');
      assert.dom('span:nth-child(2)').hasClass('fa-mail');
    });
    (0, _qunit.test)('it will not render an empty text span next to an icon', async function (assert) {
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        <UiInlineTextIconLayout @icon="superpowers" />
      */
      {
        "id": "PiiGBeiS",
        "block": "[[[8,[39,0],null,[[\"@icon\"],[\"superpowers\"]],null]],[],false,[\"ui-inline-text-icon-layout\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('span:nth-child(1)').hasClass('fa');
      assert.dom('span:nth-child(2)').doesNotExist();
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        <UiInlineTextIconLayout @icon="superpowers"></UiInlineTextIconLayout>
      */
      {
        "id": "Qo8/ksmV",
        "block": "[[[8,[39,0],null,[[\"@icon\"],[\"superpowers\"]],[[\"default\"],[[[],[]]]]]],[],false,[\"ui-inline-text-icon-layout\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('span:nth-child(1)').hasClass('fa');
      assert.dom('span:nth-child(2)').exists();
    });
    (0, _qunit.test)('it will provide a responsive class name to hide text when required', async function (assert) {
      this.set('icon', 'superpowers');
      this.set('responsive', false);
      await (0, _testHelpers.render)( // language=Handlebars
      (0, _templateFactory.createTemplateFactory)(
      /*
        <UiInlineTextIconLayout @text="Hello World" @icon="{{this.icon}}" @responsive={{this.responsive}} />
      */
      {
        "id": "JamFhiWT",
        "block": "[[[8,[39,0],null,[[\"@text\",\"@icon\",\"@responsive\"],[\"Hello World\",[29,[[30,0,[\"icon\"]]]],[30,0,[\"responsive\"]]]],null]],[],false,[\"ui-inline-text-icon-layout\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));

      // With icon but not responsive flag
      assert.dom('span:nth-child(2)').hasText('Hello World');
      assert.dom('span:nth-child(2)').hasClass('ml-5px');
      assert.dom('span:nth-child(2)').doesNotHaveClass('hidden-sm-down');

      // With icon and responsive flag
      this.set('responsive', true);
      assert.dom('span:nth-child(2)').hasClass('ml-5px');
      assert.dom('span:nth-child(2)').hasClass('hidden-sm-down');

      // Without an icon, responsiveness would just mean the text disappearing
      this.set('icon', undefined);
      assert.dom('span:nth-child(1)').doesNotExist();
      assert.dom('span:nth-child(2)').doesNotExist();
    });
    (0, _qunit.test)('it has a special tooltip style that will always show a tip icon', async function (assert) {
      this.set('icon', 'superpowers');
      this.set('responsive', true);
      this.set('tooltip', undefined);
      await (0, _testHelpers.render)( // language=Handlebars
      (0, _templateFactory.createTemplateFactory)(
      /*
        <UiInlineTextIconLayout
                      @text="Foo"
                      @icon="{{this.icon}}"
                      @responsive={{this.responsive}}
                      @tooltip="{{this.tooltip}}"
              />
      */
      {
        "id": "VZVto6NX",
        "block": "[[[8,[39,0],null,[[\"@text\",\"@icon\",\"@responsive\",\"@tooltip\"],[\"Foo\",[29,[[30,0,[\"icon\"]]]],[30,0,[\"responsive\"]],[29,[[30,0,[\"tooltip\"]]]]]],null]],[],false,[\"ui-inline-text-icon-layout\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('span:nth-child(1)').hasClass('fa-superpowers');
      assert.dom('span:nth-child(2)').hasText('Foo');
      assert.dom('span:nth-child(2)').hasClass('ml-5px');
      assert.dom('span:nth-child(2)').hasClass('hidden-sm-down');

      // The tooltip icon should always come after the text content
      this.set('tooltip', 'Hello World');
      assert.dom('span:nth-child(2)').hasClass('fa-question-circle');
      assert.dom('span:nth-child(1)').hasText('Foo');
      assert.dom('span:nth-child(1)').hasClass('mr-5px');
      // Don't hide tooltip icon text
      assert.dom('span:nth-child(1)').doesNotHaveClass('hidden-sm-down');
    });
  });
});
define("dummy/tests/integration/components/ui-load-indicator-test", ["@ember/template-factory", "qunit", "ember-qunit", "@ember/test-helpers"], function (_templateFactory, _qunit, _emberQunit, _testHelpers) {
  "use strict";

  0; //eaimeta@70e063a35619d71f0,"qunit",0,"ember-qunit",0,"@ember/test-helpers",0,"htmlbars-inline-precompile"eaimeta@70e063a35619d71f
  (0, _qunit.module)('Integration | Component | ui-load-indicator', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);
    (0, _qunit.test)('it renders a spinner', async function (assert) {
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        <UiLoadIndicator />
      */
      {
        "id": "clf1YF75",
        "block": "[[[8,[39,0],null,null,null]],[],false,[\"ui-load-indicator\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('[data-test-id="load-indicator"]').isVisible();
      assert.dom('[data-test-id="load-indicator"] p:nth-child(1)').hasClass('text-center');
      assert.dom('[data-test-id="load-indicator"] p:nth-child(1) span').hasClass('fa');
      assert.dom('[data-test-id="load-indicator"] p:nth-child(1) span').hasClass('fa-spinner');
      assert.dom('[data-test-id="load-indicator"] p:nth-child(1) span').hasClass('fa-4x');
      assert.dom('[data-test-id="load-indicator"] p:nth-child(2)').hasClass('text-center');
      assert.dom('[data-test-id="load-indicator"] p:nth-child(2)').hasText('Loading...');
    });
    (0, _qunit.test)('it shows custom loading text', async function (assert) {
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        <UiLoadIndicator @text="Heavy lifting in progress" />
      */
      {
        "id": "Y4sxq4CH",
        "block": "[[[8,[39,0],null,[[\"@text\"],[\"Heavy lifting in progress\"]],null]],[],false,[\"ui-load-indicator\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('[data-test-id="load-indicator"] p:nth-child(2)').hasText('Heavy lifting in progress');
    });
    (0, _qunit.test)('it shows multiple animation styles', async function (assert) {
      this.set('animation', 'spin');

      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        <UiLoadIndicator @animation={{this.animation}} />
      */
      {
        "id": "zWhaKzE6",
        "block": "[[[8,[39,0],null,[[\"@animation\"],[[30,0,[\"animation\"]]]],null]],[],false,[\"ui-load-indicator\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('[data-test-id="load-indicator"] p:nth-child(1) span').hasClass('fa-spin');
      this.set('animation', 'pulse');
      assert.dom('[data-test-id="load-indicator"] p:nth-child(1) span').hasClass('fa-pulse');
    });
  });
});
define("dummy/tests/integration/components/ui-lorem-test", ["@ember/template-factory", "qunit", "ember-qunit", "@ember/test-helpers"], function (_templateFactory, _qunit, _emberQunit, _testHelpers) {
  "use strict";

  0; //eaimeta@70e063a35619d71f0,"qunit",0,"ember-qunit",0,"@ember/test-helpers",0,"htmlbars-inline-precompile"eaimeta@70e063a35619d71f
  (0, _qunit.module)('Integration | Component | ui-lorem', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);
    (0, _qunit.test)('it will generate the given number of words', async function (assert) {
      this.set('count', 4);
      this.set('units', 'word');

      // language=hbs
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        <UiLorem @count={{this.count}} @units={{this.units}} />
      */
      {
        "id": "ZscHAM6X",
        "block": "[[[8,[39,0],null,[[\"@count\",\"@units\"],[[30,0,[\"count\"]],[30,0,[\"units\"]]]],null]],[],false,[\"ui-lorem\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.strictEqual((0, _testHelpers.getRootElement)().textContent?.split(' ').length, 4, 'it generated 4 words');
      this.set('count', 10);
      assert.strictEqual((0, _testHelpers.getRootElement)().textContent?.split(' ').length, 10, 'it generated 10 words');
    });
    (0, _qunit.test)('it will generate the given number of sentences', async function (assert) {
      this.set('count', 4);
      this.set('units', 'sentence');

      // language=hbs
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        <UiLorem @count={{this.count}} @units={{this.units}} />
      */
      {
        "id": "ZscHAM6X",
        "block": "[[[8,[39,0],null,[[\"@count\",\"@units\"],[[30,0,[\"count\"]],[30,0,[\"units\"]]]],null]],[],false,[\"ui-lorem\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.strictEqual((0, _testHelpers.getRootElement)().textContent?.split('. ').length, 4, 'it generated 4 sentences');
      this.set('count', 10);
      assert.strictEqual((0, _testHelpers.getRootElement)().textContent?.split('. ').length, 10, 'it generated 10 sentences');
    });
    (0, _qunit.test)('it will generate the given number of paragraphs', async function (assert) {
      this.set('count', 4);
      this.set('units', 'paragraph');

      // language=hbs
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        <UiLorem @count={{this.count}} @units={{this.units}} />
      */
      {
        "id": "ZscHAM6X",
        "block": "[[[8,[39,0],null,[[\"@count\",\"@units\"],[[30,0,[\"count\"]],[30,0,[\"units\"]]]],null]],[],false,[\"ui-lorem\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.strictEqual((0, _testHelpers.findAll)('p').length, 4, 'it generated 4 paragraphs');
      this.set('count', 10);
      assert.strictEqual((0, _testHelpers.findAll)('p').length, 10, 'it generated 10 paragraphs');
    });
    (0, _qunit.test)('the number of words in a sentence can be controlled', async function (assert) {
      this.set('count', 1);
      this.set('units', 'sentence');
      this.set('wordsPerSentence', {
        min: 8,
        max: 8
      });

      // language=hbs
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        <UiLorem @count={{this.count}} @units={{this.units}} @wordsPerSentence={{this.wordsPerSentence}} />
      */
      {
        "id": "BPDixcDE",
        "block": "[[[8,[39,0],null,[[\"@count\",\"@units\",\"@wordsPerSentence\"],[[30,0,[\"count\"]],[30,0,[\"units\"]],[30,0,[\"wordsPerSentence\"]]]],null]],[],false,[\"ui-lorem\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.strictEqual((0, _testHelpers.getRootElement)().textContent?.split(' ').length, 8, 'it generated 8 words');
    });
    (0, _qunit.test)('the number of sentences in a paragraph can be controlled', async function (assert) {
      this.set('count', 1);
      this.set('units', 'paragraph');
      this.set('sentencesPerParagraph', {
        min: 8,
        max: 8
      });

      // language=hbs
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        <UiLorem @count={{this.count}} @units={{this.units}} @sentencesPerParagraph={{this.sentencesPerParagraph}} />
      */
      {
        "id": "IqmtqgeV",
        "block": "[[[8,[39,0],null,[[\"@count\",\"@units\",\"@sentencesPerParagraph\"],[[30,0,[\"count\"]],[30,0,[\"units\"]],[30,0,[\"sentencesPerParagraph\"]]]],null]],[],false,[\"ui-lorem\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.strictEqual((0, _testHelpers.getRootElement)().textContent?.split('. ').length, 8, 'it generated 8 sentences');
    });
  });
});
define("dummy/tests/integration/components/ui-menu-test", ["@ember/template-factory", "qunit", "ember-qunit", "@ember/test-helpers"], function (_templateFactory, _qunit, _emberQunit, _testHelpers) {
  "use strict";

  0; //eaimeta@70e063a35619d71f0,"qunit",0,"ember-qunit",0,"@ember/test-helpers",0,"ember-cli-htmlbars"eaimeta@70e063a35619d71f
  (0, _qunit.module)('Integration | Component | ui-menu', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);
    (0, _qunit.test)('it opens and closes a flyout menu', async function (assert) {
      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            {{#ui-menu "Align" testId="menu" as |Menu|}}
              {{Menu.Item "Left"}}
              {{Menu.Item "Right"}}
              {{Menu.Item "Center"}}
            {{/ui-menu}}
          
      */
      {
        "id": "kWHo9Ob7",
        "block": "[[[1,\"\\n\"],[6,[39,0],[\"Align\"],[[\"testId\"],[\"menu\"]],[[\"default\"],[[[[1,\"        \"],[1,[28,[30,1,[\"Item\"]],[\"Left\"],null]],[1,\"\\n        \"],[1,[28,[30,1,[\"Item\"]],[\"Right\"],null]],[1,\"\\n        \"],[1,[28,[30,1,[\"Item\"]],[\"Center\"],null]],[1,\"\\n\"]],[1]]]]],[1,\"    \"]],[\"Menu\"],false,[\"ui-menu\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      const trigger = (0, _testHelpers.find)('button[data-test-id="menu"]');
      const overlay = (0, _testHelpers.find)('div[data-test-id="menu"]');
      assert.dom(trigger).isVisible();
      assert.dom(trigger).hasText('Align');
      assert.dom(trigger).hasAttribute('aria-haspopup', 'true');
      assert.dom(trigger).hasAttribute('aria-expanded', 'false');
      assert.dom(trigger).hasAttribute('aria-controls', overlay.id);
      assert.dom(overlay).isNotVisible();
      await (0, _testHelpers.click)(trigger);
      assert.dom(trigger).hasAttribute('aria-expanded', 'true');
      assert.dom(overlay).isVisible();
      assert.dom('button:nth-child(1)', overlay).isFocused();
      await (0, _testHelpers.click)(trigger);
      assert.dom(trigger).hasAttribute('aria-expanded', 'false');
      assert.dom(overlay).isNotVisible();
    });
    (0, _qunit.test)('it can be navigated by keyboard', async function (assert) {
      this.set('handleClick', function (name) {
        assert.step(name);
      });

      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            {{#ui-menu "Align" testId="menu" as |Menu|}}
              {{Menu.Item "Left" onClick=(action this.handleClick "left")}}
              {{Menu.Item "Right" disabled=true}}
              {{Menu.Item "Center" onClick=(action this.handleClick "right")}}
            {{/ui-menu}}
          
      */
      {
        "id": "9awHLMpt",
        "block": "[[[1,\"\\n\"],[6,[39,0],[\"Align\"],[[\"testId\"],[\"menu\"]],[[\"default\"],[[[[1,\"        \"],[1,[28,[30,1,[\"Item\"]],[\"Left\"],[[\"onClick\"],[[28,[37,1],[[30,0],[30,0,[\"handleClick\"]],\"left\"],null]]]]],[1,\"\\n        \"],[1,[28,[30,1,[\"Item\"]],[\"Right\"],[[\"disabled\"],[true]]]],[1,\"\\n        \"],[1,[28,[30,1,[\"Item\"]],[\"Center\"],[[\"onClick\"],[[28,[37,1],[[30,0],[30,0,[\"handleClick\"]],\"right\"],null]]]]],[1,\"\\n\"]],[1]]]]],[1,\"    \"]],[\"Menu\"],false,[\"ui-menu\",\"action\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      const trigger = (0, _testHelpers.find)('button[data-test-id="menu"]');
      const overlay = (0, _testHelpers.find)('div[data-test-id="menu"]');
      assert.dom(overlay).isNotVisible();
      await (0, _testHelpers.focus)(trigger);

      // Should open an focus on first option
      await (0, _testHelpers.triggerKeyEvent)(trigger, 'keyup', 'ArrowDown');
      assert.dom(overlay).isVisible();
      assert.dom('button:nth-child(1)', overlay).isFocused();

      // Second option is disabled, should move to third
      await (0, _testHelpers.triggerKeyEvent)(overlay, 'keyup', 'ArrowDown');
      assert.dom('button:nth-child(3)', overlay).isFocused();

      // Should loop back to first option
      await (0, _testHelpers.triggerKeyEvent)(overlay, 'keyup', 'ArrowDown');
      assert.dom('button:nth-child(1)', overlay).isFocused();

      // Should loop back to third option
      await (0, _testHelpers.triggerKeyEvent)(overlay, 'keyup', 'ArrowUp');
      assert.dom('button:nth-child(3)', overlay).isFocused();

      // Second option is disabled, should move to first
      await (0, _testHelpers.triggerKeyEvent)(overlay, 'keyup', 'ArrowUp');
      assert.dom('button:nth-child(1)', overlay).isFocused();

      // Should close and return focus to trigger
      await (0, _testHelpers.triggerKeyEvent)(overlay, 'keyup', 'Escape');
      assert.dom(overlay).isNotVisible();
      assert.dom(trigger).isFocused();

      // Should close after clicking an option
      await (0, _testHelpers.triggerKeyEvent)(trigger, 'keyup', 'ArrowDown');
      assert.dom('button:nth-child(1)', overlay).isFocused();
      await (0, _testHelpers.click)(overlay.querySelector('button:nth-child(1)') || '');
      assert.dom(overlay).isNotVisible();
      assert.dom(trigger).isFocused();

      // Should close when focus in on the trigger and the up arrow is typed
      await (0, _testHelpers.click)(trigger);
      assert.dom(overlay).isVisible();
      await (0, _testHelpers.focus)(trigger);
      await (0, _testHelpers.triggerKeyEvent)(trigger, 'keyup', 'ArrowUp');
      assert.dom(overlay).isNotVisible();

      // Should close when focus is on the trigger and the escape key is typed
      await (0, _testHelpers.click)(trigger);
      assert.dom(overlay).isVisible();
      await (0, _testHelpers.focus)(trigger);
      await (0, _testHelpers.triggerKeyEvent)(trigger, 'keyup', 'Escape');
      assert.dom(overlay).isNotVisible();
      assert.verifySteps(['left']);
    });
  });
});
define("dummy/tests/integration/components/ui-modal-test", ["@ember/template-factory", "@ember/object", "qunit", "ember-qunit", "ember-concurrency", "@ember/test-helpers", "@nsf-open/ember-ui-foundation/lib/MessageManager"], function (_templateFactory, _object, _qunit, _emberQunit, _emberConcurrency, _testHelpers, _MessageManager) {
  "use strict";

  0; //eaimeta@70e063a35619d71f0,"@ember/object",0,"qunit",0,"ember-qunit",0,"ember-cli-htmlbars",0,"ember-concurrency",0,"@ember/test-helpers",0,"@nsf-open/ember-ui-foundation/lib/MessageManager"eaimeta@70e063a35619d71f
  (0, _qunit.module)('Integration | Component | ui-modal', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);
    (0, _qunit.test)('it renders a modal window that can be opened and closed', async function (assert) {
      this.set('isOpen', false);

      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            <UiModal @title="Hello World" @testId="modal" @open={{this.isOpen}}>
              <p>Content Goes Here</p>
            </UiModal>
          
      */
      {
        "id": "6Y9iC8Su",
        "block": "[[[1,\"\\n      \"],[8,[39,0],null,[[\"@title\",\"@testId\",\"@open\"],[\"Hello World\",\"modal\",[30,0,[\"isOpen\"]]]],[[\"default\"],[[[[1,\"\\n        \"],[10,2],[12],[1,\"Content Goes Here\"],[13],[1,\"\\n      \"]],[]]]]],[1,\"\\n    \"]],[],false,[\"ui-modal\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('.modal-backdrop').doesNotExist();
      assert.dom('[data-test-id="modal"]').doesNotExist();
      this.set('isOpen', true);
      await (0, _testHelpers.waitFor)('.modal-backdrop');
      assert.dom('.modal-backdrop').hasClass('fade');
      assert.dom('.modal-backdrop').hasClass('in');
      assert.dom('[data-test-id="modal"]').doesNotExist();
      await (0, _testHelpers.waitFor)('[data-test-id="modal"]');
      assert.dom('[data-test-id="modal"]').hasClass('fade');
      assert.dom('[data-test-id="modal"]').hasStyle({
        opacity: '0'
      });
      await (0, _testHelpers.waitFor)('[data-test-id="modal"].fade.in');
      assert.dom('[data-test-id="modal"]').hasClass('in');
      assert.dom('[data-test-id="modal"] .modal-dialog').exists();
      await (0, _testHelpers.waitUntil)(() => getComputedStyle((0, _testHelpers.find)('[data-test-id="modal"]')).opacity === '1');
      assert.dom('[data-test-id="modal"]').hasAttribute('role', 'dialog');
      assert.dom('[data-test-id="modal"]').hasAttribute('tabindex', '-1');
      assert.dom('[data-test-id="modal"]').hasAttribute('aria-labelledby', (0, _testHelpers.find)('.modal-header')?.id || '');
      assert.dom('[data-test-id="modal"] .modal-dialog').isVisible();
      assert.dom('[data-test-id="modal"] .modal-dialog').hasAttribute('role', 'document');
      assert.dom('[data-test-id="modal"] .modal-dialog').hasClass('modal-md');
      assert.dom('[data-test-id="modal"] .modal-title').hasText('Hello World');
      assert.dom('[data-test-id="modal"] .modal-header button.close').isFocused();
      assert.dom('[data-test-id="modal"] .modal-body').hasText('Content Goes Here');
      this.set('isOpen', false);
      await (0, _testHelpers.settled)();
      assert.dom('.modal-backdrop').doesNotExist();
      assert.dom('[data-test-id="modal"]').doesNotExist();
    });
    (0, _qunit.test)('it can be rendered directly into the open state', async function (assert) {
      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            <UiModal @title="Hello World" @testId="modal" @open={{true}}>
              <p>Content Goes Here</p>
            </UiModal>
          
      */
      {
        "id": "nzH7DtUC",
        "block": "[[[1,\"\\n      \"],[8,[39,0],null,[[\"@title\",\"@testId\",\"@open\"],[\"Hello World\",\"modal\",true]],[[\"default\"],[[[[1,\"\\n        \"],[10,2],[12],[1,\"Content Goes Here\"],[13],[1,\"\\n      \"]],[]]]]],[1,\"\\n    \"]],[],false,[\"ui-modal\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('[data-test-id="modal"] .modal-dialog').isVisible();
      assert.dom('[data-test-id="modal"] .modal-title').hasText('Hello World');
      assert.dom('[data-test-id="modal"] .modal-header button.close').isFocused();
      assert.dom('[data-test-id="modal"] .modal-body').hasText('Content Goes Here');
    });
    (0, _qunit.test)('it can be closed via the close button in the dialog header', async function (assert) {
      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            <UiModal @title="Hello World" @testId="modal" @open={{true}}>
              <p>Content Goes Here</p>
            </UiModal>
          
      */
      {
        "id": "nzH7DtUC",
        "block": "[[[1,\"\\n      \"],[8,[39,0],null,[[\"@title\",\"@testId\",\"@open\"],[\"Hello World\",\"modal\",true]],[[\"default\"],[[[[1,\"\\n        \"],[10,2],[12],[1,\"Content Goes Here\"],[13],[1,\"\\n      \"]],[]]]]],[1,\"\\n    \"]],[],false,[\"ui-modal\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('[data-test-id="modal"] .modal-dialog').isVisible();
      await (0, _testHelpers.click)('[data-test-id="modal"] .modal-header button.close');
      assert.dom('.modal-backdrop').doesNotExist();
      assert.dom('[data-test-id="modal"]').doesNotExist();
    });
    (0, _qunit.test)('it can be opened and closed via the modal service', async function (assert) {
      const modal = this.owner.lookup('service:modal');

      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            <UiModal @title="Hello World" @testId="modal" @name="testModal">
              <p>Content Goes Here</p>
            </UiModal>
          
      */
      {
        "id": "+KmS0vkf",
        "block": "[[[1,\"\\n      \"],[8,[39,0],null,[[\"@title\",\"@testId\",\"@name\"],[\"Hello World\",\"modal\",\"testModal\"]],[[\"default\"],[[[[1,\"\\n        \"],[10,2],[12],[1,\"Content Goes Here\"],[13],[1,\"\\n      \"]],[]]]]],[1,\"\\n    \"]],[],false,[\"ui-modal\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('.modal-backdrop').doesNotExist();
      assert.dom('[data-test-id="modal"]').doesNotExist();
      modal.open('testModal');
      await (0, _testHelpers.settled)();
      assert.dom('.modal-backdrop').isVisible();
      assert.dom('[data-test-id="modal"]').isVisible();
      modal.close();
      await (0, _testHelpers.settled)();
      assert.dom('.modal-backdrop').doesNotExist();
      assert.dom('[data-test-id="modal"]').doesNotExist();
    });
    (0, _qunit.test)('it can be dynamically passed data and a title via the modal service', async function (assert) {
      const modal = this.owner.lookup('service:modal');

      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            <UiModal @testId="modal" @name="testModal" as |modal|>
              <p>{{modal.data}}</p>
            </UiModal>
          
      */
      {
        "id": "UAGbLRT6",
        "block": "[[[1,\"\\n      \"],[8,[39,0],null,[[\"@testId\",\"@name\"],[\"modal\",\"testModal\"]],[[\"default\"],[[[[1,\"\\n        \"],[10,2],[12],[1,[30,1,[\"data\"]]],[13],[1,\"\\n      \"]],[1]]]]],[1,\"\\n    \"]],[\"modal\"],false,[\"ui-modal\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      modal.open('testModal', 'Test modal content', 'Test modal title');
      await (0, _testHelpers.settled)();
      assert.dom('[data-test-id="modal"] .modal-title').hasText('Test modal title');
      assert.dom('[data-test-id="modal"] .modal-body').hasText('Test modal content');
    });
    (0, _qunit.test)('it will close one modal when another is requested to be opened', async function (assert) {
      const modal = this.owner.lookup('service:modal');

      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            <UiModal @testId="modalA" @name="testModalA" as |modal|>
              <p>{{modal.data}}</p>
            </UiModal>
      
            <UiModal @testId="modalB" @name="testModalB" as |modal|>
                <p>{{modal.data}}</p>
            </UiModal>
          
      */
      {
        "id": "yxcDyqiR",
        "block": "[[[1,\"\\n      \"],[8,[39,0],null,[[\"@testId\",\"@name\"],[\"modalA\",\"testModalA\"]],[[\"default\"],[[[[1,\"\\n        \"],[10,2],[12],[1,[30,1,[\"data\"]]],[13],[1,\"\\n      \"]],[1]]]]],[1,\"\\n\\n      \"],[8,[39,0],null,[[\"@testId\",\"@name\"],[\"modalB\",\"testModalB\"]],[[\"default\"],[[[[1,\"\\n          \"],[10,2],[12],[1,[30,2,[\"data\"]]],[13],[1,\"\\n      \"]],[2]]]]],[1,\"\\n    \"]],[\"modal\",\"modal\"],false,[\"ui-modal\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('.modal-backdrop').doesNotExist();
      assert.dom('[data-test-id="modalA"]').doesNotExist();
      assert.dom('[data-test-id="modalB"]').doesNotExist();
      modal.open('testModalA', 'Test Modal A Content', 'Test modal A Title');
      await (0, _testHelpers.settled)();
      assert.dom('[data-test-id="modalA"] .modal-title').hasText('Test modal A Title');
      assert.dom('[data-test-id="modalA"] .modal-body').hasText('Test Modal A Content');
      assert.dom('.modal-backdrop').isVisible();
      assert.dom('[data-test-id="modalB"]').doesNotExist();
      modal.open('testModalB', 'Test Modal B Content', 'Test modal B Title');
      await (0, _testHelpers.waitUntil)(() => !document.querySelector('[data-test-id="modalA"]'));

      // The backdrop should never go away when transitioning between modals
      assert.dom('.modal-backdrop').isVisible();
      await (0, _testHelpers.settled)();
      assert.dom('[data-test-id="modalB"] .modal-title').hasText('Test modal B Title');
      assert.dom('[data-test-id="modalB"] .modal-body').hasText('Test Modal B Content');
      modal.close();
      await (0, _testHelpers.settled)();
      assert.dom('.modal-backdrop').doesNotExist();
      assert.dom('[data-test-id="modalA"]').doesNotExist();
      assert.dom('[data-test-id="modalB"]').doesNotExist();
    });
    (0, _qunit.test)('it allows an open modal to cancel the opening of a new modal', async function (assert) {
      const modal = this.owner.lookup('service:modal');
      this.set('canHideModal', function () {
        assert.step('blocking');
        return false;
      });
      this.set('showModalBlocked', function () {
        assert.step('blocked');
      });

      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            <UiModal @testId="modalA" @name="testModalA" @onCanHide={{action this.canHideModal}} as |modal|>
              <p>{{modal.data}}</p>
            </UiModal>
      
            <UiModal @testId="modalB" @name="testModalB" @onHideBlocked={{action this.showModalBlocked}} as |modal|>
                <p>{{modal.data}}</p>
            </UiModal>
          
      */
      {
        "id": "79uGzGpq",
        "block": "[[[1,\"\\n      \"],[8,[39,0],null,[[\"@testId\",\"@name\",\"@onCanHide\"],[\"modalA\",\"testModalA\",[28,[37,1],[[30,0],[30,0,[\"canHideModal\"]]],null]]],[[\"default\"],[[[[1,\"\\n        \"],[10,2],[12],[1,[30,1,[\"data\"]]],[13],[1,\"\\n      \"]],[1]]]]],[1,\"\\n\\n      \"],[8,[39,0],null,[[\"@testId\",\"@name\",\"@onHideBlocked\"],[\"modalB\",\"testModalB\",[28,[37,1],[[30,0],[30,0,[\"showModalBlocked\"]]],null]]],[[\"default\"],[[[[1,\"\\n          \"],[10,2],[12],[1,[30,2,[\"data\"]]],[13],[1,\"\\n      \"]],[2]]]]],[1,\"\\n    \"]],[\"modal\",\"modal\"],false,[\"ui-modal\",\"action\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      modal.open('testModalA', 'Test Modal A Content', 'Test modal A Title');
      await (0, _testHelpers.settled)();
      assert.dom('[data-test-id="modalA"]').isVisible();
      assert.dom('[data-test-id="modalB"]').doesNotExist();
      modal.open('testModalB', 'Test Modal B Content', 'Test modal B Title');
      await (0, _testHelpers.settled)();
      assert.dom('[data-test-id="modalA"]').isVisible();
      assert.dom('[data-test-id="modalB"]').doesNotExist();
      assert.verifySteps(['blocking', 'blocked']);
    });
    (0, _qunit.test)('it will clean up after itself if destroyed without being properly closed', async function (assert) {
      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            <UiModal @title="Hello World" @testId="modal" @open={{true}}>
              <p>Content Goes Here</p>
            </UiModal>
          
      */
      {
        "id": "nzH7DtUC",
        "block": "[[[1,\"\\n      \"],[8,[39,0],null,[[\"@title\",\"@testId\",\"@open\"],[\"Hello World\",\"modal\",true]],[[\"default\"],[[[[1,\"\\n        \"],[10,2],[12],[1,\"Content Goes Here\"],[13],[1,\"\\n      \"]],[]]]]],[1,\"\\n    \"]],[],false,[\"ui-modal\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('.modal-backdrop').isVisible();
      assert.dom('[data-test-id="modal"]').isVisible();
      await (0, _testHelpers.clearRender)();
      assert.dom('.modal-backdrop').isNotVisible();
    });
    (0, _qunit.test)('it can be opened with the "open-modal" helper', async function (assert) {
      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            <button
              type="button"
              id="openModal"
              onclick={{open-modal "testModal" "Test Modal Content" "Test Modal Title"}}
            >
              Open Modal
            </button>
      
            <UiModal @name="testModal" @testId="modal" as |modal|>
              <p>{{modal.data}}</p>
            </UiModal>
          
      */
      {
        "id": "gw+l0iu9",
        "block": "[[[1,\"\\n      \"],[10,\"button\"],[14,1,\"openModal\"],[15,\"onclick\",[28,[37,0],[\"testModal\",\"Test Modal Content\",\"Test Modal Title\"],null]],[14,4,\"button\"],[12],[1,\"\\n        Open Modal\\n      \"],[13],[1,\"\\n\\n      \"],[8,[39,1],null,[[\"@name\",\"@testId\"],[\"testModal\",\"modal\"]],[[\"default\"],[[[[1,\"\\n        \"],[10,2],[12],[1,[30,1,[\"data\"]]],[13],[1,\"\\n      \"]],[1]]]]],[1,\"\\n    \"]],[\"modal\"],false,[\"open-modal\",\"ui-modal\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('.modal-backdrop').doesNotExist();
      assert.dom('[data-test-id="modal"]').doesNotExist();
      await (0, _testHelpers.click)('#openModal');
      assert.dom('.modal-backdrop').isVisible();
      assert.dom('[data-test-id="modal"]').isVisible();
      assert.dom('[data-test-id="modal"] .modal-title').hasText('Test Modal Title');
      assert.dom('[data-test-id="modal"] .modal-body').hasText('Test Modal Content');
    });
    (0, _qunit.test)('it traps focus inside the dialog', async function (assert) {
      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            <UiModal @title="Hello World" @testId="modal" @open={{true}}>
              <button type="button" id="buttonA">Button A</button>
              <button type="button" id="buttonB">Button B</button>
            </UiModal>
          
      */
      {
        "id": "ZQi/zvSi",
        "block": "[[[1,\"\\n      \"],[8,[39,0],null,[[\"@title\",\"@testId\",\"@open\"],[\"Hello World\",\"modal\",true]],[[\"default\"],[[[[1,\"\\n        \"],[10,\"button\"],[14,1,\"buttonA\"],[14,4,\"button\"],[12],[1,\"Button A\"],[13],[1,\"\\n        \"],[10,\"button\"],[14,1,\"buttonB\"],[14,4,\"button\"],[12],[1,\"Button B\"],[13],[1,\"\\n      \"]],[]]]]],[1,\"\\n    \"]],[],false,[\"ui-modal\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));

      // See https://github.com/emberjs/ember-test-helpers/issues/738
      // Some keyboard interaction are particularly difficult to fake with Javascript,
      // and tabbing through focusable elements is one of them. For this, we only
      // _really_ want to make sure that focus gets wrapped between first <-> last
      // elements in the modal. Going out on a limb here that the browser is capable
      // of handing everything in-between.

      assert.dom('.modal-header button.close').isFocused();
      await (0, _testHelpers.focus)('#buttonB');
      assert.dom('#buttonB').isFocused();
      await (0, _testHelpers.triggerKeyEvent)('[data-test-id="modal"]', 'keydown', 'Tab');
      assert.dom('.modal-header button.close').isFocused();
      await (0, _testHelpers.triggerKeyEvent)('[data-test-id="modal"]', 'keydown', 'Tab', {
        shiftKey: true
      });
      assert.dom('#buttonB').isFocused();
    });
    (0, _qunit.test)('it supports the generic "submission" workflow by accepting a promise', async function (assert) {
      this.set('handleSubmit', async function () {
        assert.step('promise');
        return (0, _emberConcurrency.timeout)(10);
      });

      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            <UiModal @title="Hello World" @testId="modal" @open={{true}} @onSubmit={{this.handleSubmit}} as |modal|>
              <p>Content Goes Here</p>
              {{modal.submitButton}}
            </UiModal>
          
      */
      {
        "id": "bDe1nwSm",
        "block": "[[[1,\"\\n      \"],[8,[39,0],null,[[\"@title\",\"@testId\",\"@open\",\"@onSubmit\"],[\"Hello World\",\"modal\",true,[30,0,[\"handleSubmit\"]]]],[[\"default\"],[[[[1,\"\\n        \"],[10,2],[12],[1,\"Content Goes Here\"],[13],[1,\"\\n        \"],[1,[30,1,[\"submitButton\"]]],[1,\"\\n      \"]],[1]]]]],[1,\"\\n    \"]],[\"modal\"],false,[\"ui-modal\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('.modal-body button.btn').isVisible();
      assert.dom('.modal-body button.btn').hasText('Submit');
      const clickPromise = (0, _testHelpers.click)('.modal-body button.btn');
      await (0, _testHelpers.waitFor)('.modal-body button.btn:disabled');
      assert.dom('.modal-body button.btn span:nth-child(1)').hasClass('fa-spinner');
      assert.dom('.modal-body button.btn span:nth-child(1)').hasClass('fa-spin');
      assert.dom('.modal-header button.close').isDisabled();
      await clickPromise;
      assert.dom('[data-test-id="modal"]').doesNotExist();
      assert.verifySteps(['promise']);
    });
    (0, _qunit.test)('it supports the generic "submission" workflow by accepting a concurrency task', async function (assert) {
      this.set('taskWrapper',
      // eslint-disable-next-line ember/no-classic-classes
      _object.default.extend({
        handleSubmit: (0, _emberConcurrency.task)(function* () {
          assert.step('task');
          yield (0, _emberConcurrency.timeout)(10);
          return true;
        })
      }).create());

      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            <UiModal
              @title="Hello World"
              @testId="modal"
              @open={{true}}
              @onSubmit={{this.taskWrapper.handleSubmit}}
            as |modal|>
              <p>Content Goes Here</p>
              {{modal.submitButton}}
            </UiModal>
          
      */
      {
        "id": "U7FGM8z/",
        "block": "[[[1,\"\\n      \"],[8,[39,0],null,[[\"@title\",\"@testId\",\"@open\",\"@onSubmit\"],[\"Hello World\",\"modal\",true,[30,0,[\"taskWrapper\",\"handleSubmit\"]]]],[[\"default\"],[[[[1,\"\\n        \"],[10,2],[12],[1,\"Content Goes Here\"],[13],[1,\"\\n        \"],[1,[30,1,[\"submitButton\"]]],[1,\"\\n      \"]],[1]]]]],[1,\"\\n    \"]],[\"modal\"],false,[\"ui-modal\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('.modal-body button.btn').isVisible();
      assert.dom('.modal-body button.btn').hasText('Submit');
      const clickPromise = (0, _testHelpers.click)('.modal-body button.btn');
      await (0, _testHelpers.waitFor)('.modal-body button.btn:disabled');
      assert.dom('.modal-body button.btn span:nth-child(1)').hasClass('fa-spinner');
      assert.dom('.modal-body button.btn span:nth-child(1)').hasClass('fa-spin');
      assert.dom('.modal-header button.close').isDisabled();
      await clickPromise;
      assert.dom('[data-test-id="modal"]').doesNotExist();
      assert.verifySteps(['task']);
    });
    (0, _qunit.test)('it runs a "submission" workflow concurrency task as unlinked so it continues running even if the modal is destroyed', async function (assert) {
      this.set('taskWrapper',
      // eslint-disable-next-line ember/no-classic-classes
      _object.default.extend({
        handleSubmit: (0, _emberConcurrency.task)(function* () {
          yield (0, _emberConcurrency.timeout)(10);
          assert.step('task');
          return true;
        })
      }).create());

      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
              <UiModal
                @title="Hello World"
                @testId="modal"
                @open={{true}}
                @onSubmit={{this.taskWrapper.handleSubmit}}
              as |modal|>
                <p>Content Goes Here</p>
                {{modal.submitButton}}
              </UiModal>
            
      */
      {
        "id": "4wpqOelb",
        "block": "[[[1,\"\\n        \"],[8,[39,0],null,[[\"@title\",\"@testId\",\"@open\",\"@onSubmit\"],[\"Hello World\",\"modal\",true,[30,0,[\"taskWrapper\",\"handleSubmit\"]]]],[[\"default\"],[[[[1,\"\\n          \"],[10,2],[12],[1,\"Content Goes Here\"],[13],[1,\"\\n          \"],[1,[30,1,[\"submitButton\"]]],[1,\"\\n        \"]],[1]]]]],[1,\"\\n      \"]],[\"modal\"],false,[\"ui-modal\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      const clickPromise = (0, _testHelpers.click)('.modal-body button.btn');
      await (0, _testHelpers.waitFor)('.modal-body button.btn:disabled');
      await (0, _testHelpers.clearRender)();
      await clickPromise;
      assert.verifySteps(['task']);
    });
    (0, _qunit.test)('it renders a ui-alert-block if provided a MessageManager instance', async function (assert) {
      const manager = new _MessageManager.default();
      this.set('manager', manager);
      manager.addSuccessMessages('Success Message A');

      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            <UiModal @title="Hello World" @testId="modal" @open={{true}} @messageManager={{this.manager}} as |modal|>
              <p>Content Goes Here</p>
            </UiModal>
          
      */
      {
        "id": "pLcSbavz",
        "block": "[[[1,\"\\n      \"],[8,[39,0],null,[[\"@title\",\"@testId\",\"@open\",\"@messageManager\"],[\"Hello World\",\"modal\",true,[30,0,[\"manager\"]]]],[[\"default\"],[[[[1,\"\\n        \"],[10,2],[12],[1,\"Content Goes Here\"],[13],[1,\"\\n      \"]],[1]]]]],[1,\"\\n    \"]],[\"modal\"],false,[\"ui-modal\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('[data-test-id="modal"] [data-test-ident="context-message-success"]').isVisible();
      assert.dom('[data-test-id="modal"] [data-test-ident="context-message-item"]').hasText('Success Message A');
    });
    (0, _qunit.test)('it clears its ui-alert-block when closed', async function (assert) {
      const manager = new _MessageManager.default();
      this.set('manager', manager);
      manager.addSuccessMessages('Success Message A');

      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            <button data-test-modal-toggle onclick={{open-modal "test-modal"}}>Open Modal</button>
            <UiModal
              @title="Hello World"
              @testId="modal"
              @name="test-modal"
              @open={{true}}
              @messageManager={{this.manager}}
            as |modal|>
              <p>Content Goes Here</p>
            </UiModal>
          
      */
      {
        "id": "o4S0zOEc",
        "block": "[[[1,\"\\n      \"],[10,\"button\"],[14,\"data-test-modal-toggle\",\"\"],[15,\"onclick\",[28,[37,0],[\"test-modal\"],null]],[12],[1,\"Open Modal\"],[13],[1,\"\\n      \"],[8,[39,1],null,[[\"@title\",\"@testId\",\"@name\",\"@open\",\"@messageManager\"],[\"Hello World\",\"modal\",\"test-modal\",true,[30,0,[\"manager\"]]]],[[\"default\"],[[[[1,\"\\n        \"],[10,2],[12],[1,\"Content Goes Here\"],[13],[1,\"\\n      \"]],[1]]]]],[1,\"\\n    \"]],[\"modal\"],false,[\"open-modal\",\"ui-modal\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('[data-test-id="modal"] [data-test-ident="context-message-item"]').hasText('Success Message A');
      await (0, _testHelpers.click)('.modal-header button.close');
      assert.dom('[data-test-id="modal"]').doesNotExist();
      await (0, _testHelpers.click)('button[data-test-modal-toggle]');
      assert.dom('[data-test-id="modal"]').isVisible();
      assert.dom('[data-test-id="modal"] [data-test-ident="context-message-item"]').doesNotExist();
    });
    (0, _qunit.test)('it adds error messages to its ui-alert-block when an exception is thrown from its onSubmit method', async function (assert) {
      const manager = new _MessageManager.default();
      this.set('manager', manager);
      this.set('handleSubmit', async function () {
        throw new Error('Thrown Error Message');
      });
      manager.addSuccessMessages('Success Message A');

      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            <UiModal
              @title="Hello World"
              @testId="modal"
              @open={{true}}
              @onSubmit={{this.handleSubmit}}
              @messageManager={{this.manager}}
            as |modal|>
              <p>Content Goes Here</p>
              {{modal.submitButton}}
            </UiModal>
          
      */
      {
        "id": "AOdd7W2m",
        "block": "[[[1,\"\\n      \"],[8,[39,0],null,[[\"@title\",\"@testId\",\"@open\",\"@onSubmit\",\"@messageManager\"],[\"Hello World\",\"modal\",true,[30,0,[\"handleSubmit\"]],[30,0,[\"manager\"]]]],[[\"default\"],[[[[1,\"\\n        \"],[10,2],[12],[1,\"Content Goes Here\"],[13],[1,\"\\n        \"],[1,[30,1,[\"submitButton\"]]],[1,\"\\n      \"]],[1]]]]],[1,\"\\n    \"]],[\"modal\"],false,[\"ui-modal\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('[data-test-id="modal"] [data-test-ident="context-message-success"]').isVisible();
      assert.dom('[data-test-id="modal"] [data-test-ident="context-message-danger"]').doesNotExist();
      await (0, _testHelpers.click)('.modal-body button.btn');
      assert.dom('[data-test-id="modal"] [data-test-ident="context-message-success"]').doesNotExist();
      assert.dom('[data-test-id="modal"] [data-test-ident="context-message-danger"]').isVisible();
      assert.dom('[data-test-id="modal"] [data-test-ident="context-message-danger"] [data-test-ident="context-message-item"]').hasText('Thrown Error Message');
    });
    (0, _qunit.test)('it creates its own MessageManager if needed to display error messages thrown from onSubmit', async function (assert) {
      this.set('handleSubmit', async function () {
        throw new Error('Thrown Error Message');
      });

      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            <UiModal
              @title="Hello World"
              @testId="modal"
              @open={{true}}
              @onSubmit={{this.handleSubmit}}
            as |modal|>
              <p>Content Goes Here</p>
              {{modal.submitButton}}
            </UiModal>
          
      */
      {
        "id": "bDe1nwSm",
        "block": "[[[1,\"\\n      \"],[8,[39,0],null,[[\"@title\",\"@testId\",\"@open\",\"@onSubmit\"],[\"Hello World\",\"modal\",true,[30,0,[\"handleSubmit\"]]]],[[\"default\"],[[[[1,\"\\n        \"],[10,2],[12],[1,\"Content Goes Here\"],[13],[1,\"\\n        \"],[1,[30,1,[\"submitButton\"]]],[1,\"\\n      \"]],[1]]]]],[1,\"\\n    \"]],[\"modal\"],false,[\"ui-modal\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('[data-test-id="modal"] [data-test-ident="context-message-danger"]').doesNotExist();
      await (0, _testHelpers.click)('.modal-body button.btn');
      assert.dom('[data-test-id="modal"] [data-test-ident="context-message-danger"]').isVisible();
      assert.dom('[data-test-id="modal"] [data-test-ident="context-message-danger"] [data-test-ident="context-message-item"]').hasText('Thrown Error Message');
    });
  });
});
define("dummy/tests/integration/components/ui-pager-test", ["@ember/template-factory", "qunit", "ember-qunit", "@ember/test-helpers", "@faker-js/faker"], function (_templateFactory, _qunit, _emberQunit, _testHelpers, _faker) {
  "use strict";

  0; //eaimeta@70e063a35619d71f0,"qunit",0,"ember-qunit",0,"ember-cli-htmlbars",0,"@ember/test-helpers",0,"@faker-js/faker"eaimeta@70e063a35619d71f
  (0, _qunit.module)('Integration | Component | ui-pager', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    /**
     * Create all the test records you'll ever need.
     */
    function generateRecordSet() {
      let count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 99;
      const records = [];
      for (let i = 0; i < count; i += 1) {
        records.push({
          id: i,
          firstName: _faker.faker.name.firstName(),
          lastName: _faker.faker.name.lastName()
        });
      }
      return records;
    }

    /**
     * Returns a pair of query selectors for a specific navbar button.
     */
    function getNavbarButtonSelector(index) {
      return {
        li: `nav li:nth-child(${index})`,
        a: `nav li:nth-child(${index}) a`
      };
    }

    /**
     * All navbar buttons have the same structure with only a couple of possible
     * variations. This tests it all. Makes 9 assertions.
     */
    function testNavbarButton(assert, index, _ref) {
      let {
        label = '',
        icon = '',
        text = '',
        isDisabled = false,
        isActive = false
      } = _ref;
      const {
        li,
        a
      } = getNavbarButtonSelector(index);
      assert.dom(li)[isDisabled ? 'hasClass' : 'doesNotHaveClass']('disabled');
      assert.dom(li)[isActive ? 'hasClass' : 'doesNotHaveClass']('active');
      assert.dom(a).hasAttribute('aria-disabled', isDisabled.toString()).hasAttribute('aria-current', isActive ? 'page' : 'false').hasAttribute('role', 'button').hasAttribute('title', label).hasAttribute('aria-label', label).hasText(text);
      if (icon) {
        assert.dom(`${a} span[aria-hidden="true"]`).hasClass(icon);
      } else {
        assert.dom(`${a} span[aria-hidden="true"]`).doesNotExist();
      }
    }

    // ******************************
    // Start of tests
    // ******************************

    (0, _qunit.test)('it generates a navigation bar', async function (assert) {
      assert.expect(460);
      this.set('records', generateRecordSet());
      this.set('showPageLinks', true);
      this.set('showPageLinkRangeLabels', false);
      this.set('pageLinkCount', 5);
      this.set('responsive', true);
      this.set('ariaLabel', 'Test navigation bar');
      this.set('disabled', false);

      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            <UiPager @records={{this.records}} @disabled={{this.disabled}} as |Pager|>
              <Pager.Navbar
                @showPageLinks={{this.showPageLinks}}
                @showPageLinkRangeLabels={{this.showPageLinkRangeLabels}}
                @pageLinkCount={{this.pageLinkCount}}
                @responsive={{this.responsive}}
                @ariaLabel={{this.ariaLabel}}
              />
            </UiPager>
          
      */
      {
        "id": "cyxJqZoY",
        "block": "[[[1,\"\\n      \"],[8,[39,0],null,[[\"@records\",\"@disabled\"],[[30,0,[\"records\"]],[30,0,[\"disabled\"]]]],[[\"default\"],[[[[1,\"\\n        \"],[8,[30,1,[\"Navbar\"]],null,[[\"@showPageLinks\",\"@showPageLinkRangeLabels\",\"@pageLinkCount\",\"@responsive\",\"@ariaLabel\"],[[30,0,[\"showPageLinks\"]],[30,0,[\"showPageLinkRangeLabels\"]],[30,0,[\"pageLinkCount\"]],[30,0,[\"responsive\"]],[30,0,[\"ariaLabel\"]]]],null],[1,\"\\n      \"]],[1]]]]],[1,\"\\n    \"]],[\"Pager\"],false,[\"ui-pager\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('nav').hasAttribute('aria-label', 'Test navigation bar');
      testNavbarButton(assert, '1', {
        isDisabled: true,
        label: 'Go to first page',
        icon: 'fa-angle-double-left'
      });
      testNavbarButton(assert, '2', {
        isDisabled: true,
        label: 'Go to previous page',
        icon: 'fa-angle-left'
      });
      testNavbarButton(assert, '3', {
        isActive: true,
        label: 'Current page, page 1',
        text: '1'
      });
      testNavbarButton(assert, '4', {
        label: 'Go to page 2',
        text: '2'
      });
      testNavbarButton(assert, '5', {
        label: 'Go to page 3',
        text: '3'
      });
      testNavbarButton(assert, '6', {
        label: 'Go to page 4',
        text: '4'
      });
      testNavbarButton(assert, '7', {
        label: 'Go to page 5',
        text: '5'
      });
      testNavbarButton(assert, '8', {
        label: 'Go to next page',
        icon: 'fa-angle-right'
      });
      testNavbarButton(assert, '9', {
        label: 'Go to last page',
        icon: 'fa-angle-double-right'
      });

      // Remember, everything is offset because there are first and previous
      // buttons at the beginning of the navbar.

      // Clicks on page 3
      await (0, _testHelpers.click)(getNavbarButtonSelector('5').a);
      testNavbarButton(assert, '1', {
        label: 'Go to first page',
        icon: 'fa-angle-double-left'
      });
      testNavbarButton(assert, '2', {
        label: 'Go to previous page',
        icon: 'fa-angle-left'
      });
      testNavbarButton(assert, '3', {
        label: 'Go to page 1',
        text: '1'
      });
      testNavbarButton(assert, '5', {
        isActive: true,
        label: 'Current page, page 3',
        text: '3'
      });

      // Clicks on previous
      await (0, _testHelpers.click)(getNavbarButtonSelector('2').a);
      testNavbarButton(assert, '5', {
        label: 'Go to page 3',
        text: '3'
      });
      testNavbarButton(assert, '4', {
        isActive: true,
        label: 'Current page, page 2',
        text: '2'
      });

      // Clicks on first
      await (0, _testHelpers.click)(getNavbarButtonSelector('1').a);
      testNavbarButton(assert, '4', {
        label: 'Go to page 2',
        text: '2'
      });
      testNavbarButton(assert, '3', {
        isActive: true,
        label: 'Current page, page 1',
        text: '1'
      });

      // Clicks on next
      await (0, _testHelpers.click)(getNavbarButtonSelector('8').a);
      testNavbarButton(assert, '3', {
        label: 'Go to page 1',
        text: '1'
      });
      testNavbarButton(assert, '4', {
        isActive: true,
        label: 'Current page, page 2',
        text: '2'
      });

      // Clicks on last
      await (0, _testHelpers.click)(getNavbarButtonSelector('9').a);
      testNavbarButton(assert, '3', {
        label: 'Go to page 6',
        text: '6'
      });
      testNavbarButton(assert, '4', {
        label: 'Go to page 7',
        text: '7'
      });
      testNavbarButton(assert, '5', {
        label: 'Go to page 8',
        text: '8'
      });
      testNavbarButton(assert, '6', {
        label: 'Go to page 9',
        text: '9'
      });
      testNavbarButton(assert, '7', {
        isActive: true,
        label: 'Current page, page 10',
        text: '10'
      });
      testNavbarButton(assert, '8', {
        isDisabled: true,
        label: 'Go to next page',
        icon: 'fa-angle-right'
      });
      testNavbarButton(assert, '9', {
        isDisabled: true,
        label: 'Go to last page',
        icon: 'fa-angle-double-right'
      });

      // Clicks on page 7
      await (0, _testHelpers.click)(getNavbarButtonSelector('4').a);
      testNavbarButton(assert, '1', {
        label: 'Go to first page',
        icon: 'fa-angle-double-left'
      });
      testNavbarButton(assert, '2', {
        label: 'Go to previous page',
        icon: 'fa-angle-left'
      });
      testNavbarButton(assert, '3', {
        label: 'Go to page 5',
        text: '5'
      });
      testNavbarButton(assert, '4', {
        label: 'Go to page 6',
        text: '6'
      });
      testNavbarButton(assert, '5', {
        isActive: true,
        label: 'Current page, page 7',
        text: '7'
      });
      testNavbarButton(assert, '6', {
        label: 'Go to page 8',
        text: '8'
      });
      testNavbarButton(assert, '7', {
        label: 'Go to page 9',
        text: '9'
      });
      testNavbarButton(assert, '8', {
        label: 'Go to next page',
        icon: 'fa-angle-right'
      });
      testNavbarButton(assert, '9', {
        label: 'Go to last page',
        icon: 'fa-angle-double-right'
      });

      // No page links
      this.set('showPageLinks', false);
      testNavbarButton(assert, '1', {
        label: 'Go to first page',
        icon: 'fa-angle-double-left'
      });
      testNavbarButton(assert, '2', {
        label: 'Go to previous page',
        icon: 'fa-angle-left'
      });
      testNavbarButton(assert, '3', {
        label: 'Go to next page',
        icon: 'fa-angle-right'
      });
      testNavbarButton(assert, '4', {
        label: 'Go to last page',
        icon: 'fa-angle-double-right'
      });

      // A much more limited number of page links
      this.set('pageLinkCount', 1);
      this.set('showPageLinks', true);
      testNavbarButton(assert, '1', {
        label: 'Go to first page',
        icon: 'fa-angle-double-left'
      });
      testNavbarButton(assert, '2', {
        label: 'Go to previous page',
        icon: 'fa-angle-left'
      });
      testNavbarButton(assert, '3', {
        isActive: true,
        label: 'Current page, page 7',
        text: '7'
      });
      testNavbarButton(assert, '4', {
        label: 'Go to next page',
        icon: 'fa-angle-right'
      });
      testNavbarButton(assert, '5', {
        label: 'Go to last page',
        icon: 'fa-angle-double-right'
      });

      // More details link text
      this.set('showPageLinkRangeLabels', true);
      testNavbarButton(assert, '3', {
        isActive: true,
        label: 'Current page, page 7',
        text: '61 - 70'
      });

      // Disable everything
      this.set('disabled', true);
      testNavbarButton(assert, '1', {
        isDisabled: true,
        label: 'Go to first page',
        icon: 'fa-angle-double-left'
      });
      testNavbarButton(assert, '2', {
        isDisabled: true,
        label: 'Go to previous page',
        icon: 'fa-angle-left'
      });
      testNavbarButton(assert, '3', {
        isDisabled: true,
        isActive: true,
        label: 'Current page, page 7',
        text: '61 - 70'
      });
      testNavbarButton(assert, '4', {
        isDisabled: true,
        label: 'Go to next page',
        icon: 'fa-angle-right'
      });
      testNavbarButton(assert, '5', {
        isDisabled: true,
        label: 'Go to last page',
        icon: 'fa-angle-double-right'
      });

      // Clicks on first, when disabled nothing should change
      await (0, _testHelpers.click)(getNavbarButtonSelector('1').a);
      testNavbarButton(assert, '3', {
        isDisabled: true,
        isActive: true,
        label: 'Current page, page 7',
        text: '61 - 70'
      });
    });
    (0, _qunit.test)('it generates descriptive text', async function (assert) {
      this.set('records', generateRecordSet());

      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            <UiPager @records={{this.records}} as |Pager|>
              <Pager.Navbar />
              <div data-test-desc>{{Pager.description}}</div>
            </UiPager>
          
      */
      {
        "id": "JusoR7FP",
        "block": "[[[1,\"\\n      \"],[8,[39,0],null,[[\"@records\"],[[30,0,[\"records\"]]]],[[\"default\"],[[[[1,\"\\n        \"],[8,[30,1,[\"Navbar\"]],null,null,null],[1,\"\\n        \"],[10,0],[14,\"data-test-desc\",\"\"],[12],[1,[30,1,[\"description\"]]],[13],[1,\"\\n      \"]],[1]]]]],[1,\"\\n    \"]],[\"Pager\"],false,[\"ui-pager\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('[data-test-desc]').hasText('1 - 10 of 99');

      // Clicks on last
      await (0, _testHelpers.click)(getNavbarButtonSelector('9').a);
      assert.dom('[data-test-desc]').hasText('91 - 99 of 99');

      // It still works with a recordset that is smaller than the page size
      this.set('records', generateRecordSet(3));
      assert.dom('[data-test-desc]').hasText('1 - 3 of 3');

      // Make sure it does not break when no recordset is provided
      this.set('records', []);
      assert.dom('[data-test-desc]').hasText('0 - 0 of 0');
      this.set('records', undefined);
      assert.dom('[data-test-desc]').hasText('0 - 0 of 0');
      this.set('records', generateRecordSet());

      // Update with a custom description builder
      this.set('createDescription', function (page, start, end, total) {
        return `Page ${page}, records ${start} through ${end} of ${total}`;
      });

      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            <UiPager @records={{this.records}} @createDescription={{this.createDescription}} as |Pager|>
              <Pager.Navbar />
              <div data-test-desc>{{Pager.description}}</div>
            </UiPager>
          
      */
      {
        "id": "4otOD1nh",
        "block": "[[[1,\"\\n      \"],[8,[39,0],null,[[\"@records\",\"@createDescription\"],[[30,0,[\"records\"]],[30,0,[\"createDescription\"]]]],[[\"default\"],[[[[1,\"\\n        \"],[8,[30,1,[\"Navbar\"]],null,null,null],[1,\"\\n        \"],[10,0],[14,\"data-test-desc\",\"\"],[12],[1,[30,1,[\"description\"]]],[13],[1,\"\\n      \"]],[1]]]]],[1,\"\\n    \"]],[\"Pager\"],false,[\"ui-pager\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('[data-test-desc]').hasText('Page 1, records 1 through 10 of 99');

      // Clicks on last
      await (0, _testHelpers.click)(getNavbarButtonSelector('9').a);
      assert.dom('[data-test-desc]').hasText('Page 10, records 91 through 99 of 99');

      // Remove the builder function, if that's your jam.
      this.set('createDescription', undefined);
      assert.dom('[data-test-desc]').hasText('');
    });
    (0, _qunit.test)('the size of its pages can be controlled', async function (assert) {
      this.set('records', generateRecordSet());

      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            <UiPager @records={{this.records}} as |Pager|>
              <Pager.SizeOptions />
              <ul>
                {{#each Pager.pageRecords as |record|}}
                  <li>{{record.id}} - {{record.firstName}} {{record.lastName}}</li>
                {{/each}}
              </ul>
            </UiPager>
          
      */
      {
        "id": "aS+C5SXx",
        "block": "[[[1,\"\\n      \"],[8,[39,0],null,[[\"@records\"],[[30,0,[\"records\"]]]],[[\"default\"],[[[[1,\"\\n        \"],[8,[30,1,[\"SizeOptions\"]],null,null,null],[1,\"\\n        \"],[10,\"ul\"],[12],[1,\"\\n\"],[42,[28,[37,2],[[28,[37,2],[[30,1,[\"pageRecords\"]]],null]],null],null,[[[1,\"            \"],[10,\"li\"],[12],[1,[30,2,[\"id\"]]],[1,\" - \"],[1,[30,2,[\"firstName\"]]],[1,\" \"],[1,[30,2,[\"lastName\"]]],[13],[1,\"\\n\"]],[2]],null],[1,\"        \"],[13],[1,\"\\n      \"]],[1]]]]],[1,\"\\n    \"]],[\"Pager\",\"record\"],false,[\"ui-pager\",\"each\",\"-track-array\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('select').hasAttribute('aria-label', 'Items to show per page');
      assert.dom('select option').exists({
        count: 3
      });
      assert.dom('select').hasValue('10');
      assert.dom('ul li').exists({
        count: 10
      });
      await (0, _testHelpers.select)('select', '50');
      assert.dom('ul li').exists({
        count: 50
      });
      await (0, _testHelpers.select)('select', '-1');
      assert.dom('ul li').exists({
        count: 99
      });

      // Customizable sizes
      this.set('pageSizes', [{
        value: '20',
        label: '20 Records'
      }, {
        value: '75',
        label: '75 Records'
      }]);
      this.set('pageSize', '75');

      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            <UiPager @records={{this.records}} @pageSize={{this.pageSize}} @pageSizes={{this.pageSizes}} as |Pager|>
              <Pager.SizeOptions />
              <ul>
                {{#each Pager.pageRecords as |record|}}
                  <li>{{record.id}} - {{record.firstName}} {{record.lastName}}</li>
                {{/each}}
              </ul>
            </UiPager>
          
      */
      {
        "id": "0tCZYEnT",
        "block": "[[[1,\"\\n      \"],[8,[39,0],null,[[\"@records\",\"@pageSize\",\"@pageSizes\"],[[30,0,[\"records\"]],[30,0,[\"pageSize\"]],[30,0,[\"pageSizes\"]]]],[[\"default\"],[[[[1,\"\\n        \"],[8,[30,1,[\"SizeOptions\"]],null,null,null],[1,\"\\n        \"],[10,\"ul\"],[12],[1,\"\\n\"],[42,[28,[37,2],[[28,[37,2],[[30,1,[\"pageRecords\"]]],null]],null],null,[[[1,\"            \"],[10,\"li\"],[12],[1,[30,2,[\"id\"]]],[1,\" - \"],[1,[30,2,[\"firstName\"]]],[1,\" \"],[1,[30,2,[\"lastName\"]]],[13],[1,\"\\n\"]],[2]],null],[1,\"        \"],[13],[1,\"\\n      \"]],[1]]]]],[1,\"\\n    \"]],[\"Pager\",\"record\"],false,[\"ui-pager\",\"each\",\"-track-array\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('select option').exists({
        count: 2
      });
      assert.dom('select').hasValue('75');
      assert.dom('ul li').exists({
        count: 75
      });
      assert.dom('select option:nth-child(1)').hasText('20 Records');
      assert.dom('select option:nth-child(2)').hasText('75 Records');

      // It takes numbers too, for convenience
      this.set('pageSize', 20);
      assert.dom('select').hasValue('20');
      assert.dom('ul li').exists({
        count: 20
      });

      // It should default back to 10
      this.set('pageSize', undefined);
      assert.dom('ul li').exists({
        count: 10
      });

      // Other configurable options
      this.set('disabled', true);
      this.set('selected', undefined);
      this.set('ariaLabel', 'Hello World');
      this.set('ariaControls', 'Foo');

      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            <UiPager @records={{this.records}} as |Pager|>
              <Pager.SizeOptions
                @disabled={{this.disabled}}
                @selected={{this.selected}}
                @ariaLabel={{this.ariaLabel}}
                @ariaControls={{this.ariaControls}}
              />
            </UiPager>
          
      */
      {
        "id": "IAWusv2R",
        "block": "[[[1,\"\\n      \"],[8,[39,0],null,[[\"@records\"],[[30,0,[\"records\"]]]],[[\"default\"],[[[[1,\"\\n        \"],[8,[30,1,[\"SizeOptions\"]],null,[[\"@disabled\",\"@selected\",\"@ariaLabel\",\"@ariaControls\"],[[30,0,[\"disabled\"]],[30,0,[\"selected\"]],[30,0,[\"ariaLabel\"]],[30,0,[\"ariaControls\"]]]],null],[1,\"\\n      \"]],[1]]]]],[1,\"\\n    \"]],[\"Pager\"],false,[\"ui-pager\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('select').hasAttribute('aria-label', 'Hello World').hasAttribute('aria-controls', 'Foo').isDisabled().hasValue('10');
    });
    (0, _qunit.test)('it can limit its page size options based on the length of the record set', async function (assert) {
      this.set('records', generateRecordSet(25));
      this.set('trimSizeOptions', false);
      this.set('pageSize', '25');
      this.set('pageSizes', [{
        value: '20',
        label: '20 Records'
      }, {
        value: '25',
        label: '25 Records'
      }, {
        value: '75',
        label: '75 Records'
      }, {
        value: '-1',
        label: 'Show All'
      }]);

      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            <UiPager
              @records={{this.records}}
              @pageSizes={{this.pageSizes}}
              @pageSize={{this.pageSize}}
              @trimSizeOptions={{this.trimSizeOptions}}
            as |Pager|>
              <Pager.SizeOptions />
            </UiPager>
          
      */
      {
        "id": "87zOKXmT",
        "block": "[[[1,\"\\n      \"],[8,[39,0],null,[[\"@records\",\"@pageSizes\",\"@pageSize\",\"@trimSizeOptions\"],[[30,0,[\"records\"]],[30,0,[\"pageSizes\"]],[30,0,[\"pageSize\"]],[30,0,[\"trimSizeOptions\"]]]],[[\"default\"],[[[[1,\"\\n        \"],[8,[30,1,[\"SizeOptions\"]],null,null,null],[1,\"\\n      \"]],[1]]]]],[1,\"\\n    \"]],[\"Pager\"],false,[\"ui-pager\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('select').hasValue('25');
      assert.dom('select option').exists({
        count: 4
      });
      this.set('trimSizeOptions', true);
      assert.dom('select option').exists({
        count: 2
      });
      assert.dom('select').hasValue('-1');
      this.set('records', generateRecordSet(26));
      assert.dom('select option').exists({
        count: 3
      });
      assert.dom('select').hasValue('25');
    });
  });
});
define("dummy/tests/integration/components/ui-panel-test", ["@ember/template-factory", "qunit", "ember-qunit", "@ember/test-helpers", "dummy/tests/helpers/wait", "@nsf-open/ember-ui-foundation/components/ui-async-block/component", "@nsf-open/ember-ui-foundation/lib/MessageManager"], function (_templateFactory, _qunit, _emberQunit, _testHelpers, _wait, _component, _MessageManager) {
  "use strict";

  0; //eaimeta@70e063a35619d71f0,"qunit",0,"ember-qunit",0,"@ember/test-helpers",0,"htmlbars-inline-precompile",0,"dummy/tests/helpers/wait",0,"@nsf-open/ember-ui-foundation/components/ui-async-block/component",0,"@nsf-open/ember-ui-foundation/lib/MessageManager"eaimeta@70e063a35619d71f
  function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
  function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
  function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
  (0, _qunit.module)('Integration | Component | ui-panel', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);
    (0, _qunit.test)('it creates a panel with heading', async function (assert) {
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        <UiPanel @heading="Hello World" @testId="panel">Foo Bar</UiPanel>
      */
      {
        "id": "ss7TEpe1",
        "block": "[[[8,[39,0],null,[[\"@heading\",\"@testId\"],[\"Hello World\",\"panel\"]],[[\"default\"],[[[[1,\"Foo Bar\"]],[]]]]]],[],false,[\"ui-panel\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
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
    (0, _qunit.test)('it can create a panel without a heading', async function (assert) {
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        <UiPanel @testId="panel">Foo Bar</UiPanel>
      */
      {
        "id": "UK+BsSy/",
        "block": "[[[8,[39,0],null,[[\"@testId\"],[\"panel\"]],[[\"default\"],[[[[1,\"Foo Bar\"]],[]]]]]],[],false,[\"ui-panel\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('[data-test-id="panel"]').isVisible();
      assert.dom('[data-test-id="panel"]').hasTagName('section');
      assert.dom('[data-test-id="panel"]').hasClass('panel');
      assert.dom('[data-test-id="panel"]').hasClass('panel-default');
      assert.dom('[data-test-id="panel"] .panel-heading').doesNotExist();
      assert.dom('[data-test-id="panel"] .panel-body').isVisible();
      assert.dom('[data-test-id="panel"] .panel-body').hasText('Foo Bar');
    });
    (0, _qunit.test)('it can create a panel in different variants', async function (assert) {
      this.set('variant', 'primary');

      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        <UiPanel @heading="Hello World" @variant={{this.variant}} @testId="panel">Foo Bar</UiPanel>
      */
      {
        "id": "vehh8U/f",
        "block": "[[[8,[39,0],null,[[\"@heading\",\"@variant\",\"@testId\"],[\"Hello World\",[30,0,[\"variant\"]],\"panel\"]],[[\"default\"],[[[[1,\"Foo Bar\"]],[]]]]]],[],false,[\"ui-panel\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('[data-test-id="panel"].panel-primary').isVisible();
      this.set('variant', 'secondary');
      assert.dom('[data-test-id="panel"].panel-secondary').isVisible();
      this.set('variant', 'success');
      assert.dom('[data-test-id="panel"].panel-success').isVisible();
    });
    (0, _qunit.test)('is can create a panel heading with different heading level (H1, H2, etc)', async function (assert) {
      this.set('headingLevel', 'h1');

      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        <UiPanel @heading="Hello World" @headingLevel={{this.headingLevel}} @testId="panel">Foo Bar</UiPanel>
      */
      {
        "id": "IFhkzeA3",
        "block": "[[[8,[39,0],null,[[\"@heading\",\"@headingLevel\",\"@testId\"],[\"Hello World\",[30,0,[\"headingLevel\"]],\"panel\"]],[[\"default\"],[[[[1,\"Foo Bar\"]],[]]]]]],[],false,[\"ui-panel\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('[data-test-id="panel"] .panel-heading .panel-title').hasTagName('h1');
      this.set('headingLevel', 'h3');
      assert.dom('[data-test-id="panel"] .panel-heading .panel-title').hasTagName('h3');
      this.set('headingLevel', 'h4');
      assert.dom('[data-test-id="panel"] .panel-heading .panel-title').hasTagName('h4');
    });
    (0, _qunit.test)('it can yield provided content back without being wrapped in a panel', async function (assert) {
      this.set('renderPanel', true);

      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        <UiPanel @heading="Hello World" @renderPanel={{this.renderPanel}}>Foo Bar</UiPanel>
      */
      {
        "id": "I9pL7Xlr",
        "block": "[[[8,[39,0],null,[[\"@heading\",\"@renderPanel\"],[\"Hello World\",[30,0,[\"renderPanel\"]]]],[[\"default\"],[[[[1,\"Foo Bar\"]],[]]]]]],[],false,[\"ui-panel\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('.panel .panel-heading').isVisible();
      assert.dom('.panel .panel-body').isVisible();
      assert.dom('.panel .panel-body').hasText('Foo Bar');
      this.set('renderPanel', false);
      assert.dom('.panel .panel-heading').doesNotExist();
      assert.dom('.panel .panel-body').doesNotExist();
      assert.dom().hasText('Foo Bar');
    });
    (0, _qunit.test)('it will provide a ui-async-block instance when given a promise', async function (assert) {
      const promise = (0, _wait.default)(500, 'Hello World');
      this.set('promise', promise);

      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        <UiPanel
              @heading="Information"
              @name="Infotainment"
              @promise={{this.promise}}
            as |content|>
                {{content}}
            </UiPanel>
      */
      {
        "id": "EelH2VuN",
        "block": "[[[8,[39,0],null,[[\"@heading\",\"@name\",\"@promise\"],[\"Information\",\"Infotainment\",[30,0,[\"promise\"]]]],[[\"default\"],[[[[1,\"\\n          \"],[1,[30,1]],[1,\"\\n      \"]],[1]]]]]],[\"content\"],false,[\"ui-panel\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('[data-test-id="load-indicator"]').isVisible();
      assert.dom('[data-test-id="load-indicator"] p:nth-child(2)').hasText('Loading Infotainment');
      await promise;
      await (0, _testHelpers.settled)();
      assert.dom('.panel-body').hasText('Hello World');
    });
    (0, _qunit.test)('it will use the heading if a name is not provided for the ui-async-block', async function (assert) {
      const promise = (0, _wait.default)(500, 'Hello World');
      this.set('promise', promise);

      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        <UiPanel
              @heading="Information"
              @promise={{this.promise}}
            as |content|>
                {{content}}
            </UiPanel>
      */
      {
        "id": "9n8XlawC",
        "block": "[[[8,[39,0],null,[[\"@heading\",\"@promise\"],[\"Information\",[30,0,[\"promise\"]]]],[[\"default\"],[[[[1,\"\\n          \"],[1,[30,1]],[1,\"\\n      \"]],[1]]]]]],[\"content\"],false,[\"ui-panel\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('[data-test-id="load-indicator"]').isVisible();
      assert.dom('[data-test-id="load-indicator"] p:nth-child(2)').hasText('Loading Information');
      await promise;
      await (0, _testHelpers.settled)();
      assert.dom('.panel-body').hasText('Hello World');
    });
    (0, _qunit.test)('it can be provided a ui-async-block class to customize everything possible', async function (assert) {
      class TestAsyncBlock extends _component.default {
        constructor() {
          super(...arguments);
          _defineProperty(this, "pendingMessage", 'Loading Foo and a bit of Bar');
        }
      }
      this.owner.register('component:test-async-block', TestAsyncBlock);
      const promise = (0, _wait.default)(500, 'Hello World');
      this.set('promise', promise);
      this.set('uiAsyncBlock', 'test-async-block');

      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        <UiPanel
              @heading="Information"
              @promise={{this.promise}}
              @uiAsyncBlock={{this.uiAsyncBlock}}
            as |content|>
                {{content}}
            </UiPanel>
      */
      {
        "id": "Sy1K++ku",
        "block": "[[[8,[39,0],null,[[\"@heading\",\"@promise\",\"@uiAsyncBlock\"],[\"Information\",[30,0,[\"promise\"]],[30,0,[\"uiAsyncBlock\"]]]],[[\"default\"],[[[[1,\"\\n          \"],[1,[30,1]],[1,\"\\n      \"]],[1]]]]]],[\"content\"],false,[\"ui-panel\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('[data-test-id="load-indicator"]').isVisible();
      assert.dom('[data-test-id="load-indicator"] p:nth-child(2)').hasText('Loading Foo and a bit of Bar');
      await promise;
      await (0, _testHelpers.settled)();
      assert.dom('.panel-body').hasText('Hello World');
    });
    (0, _qunit.test)('it renders a ui-alert-block if provided a MessageManager instance', async function (assert) {
      const manager = new _MessageManager.default();
      this.set('manager', manager);
      manager.addSuccessMessages('Success Message A');

      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            <UiPanel @heading="Hello World" @testId="panel" @messageManager={{this.manager}} as |modal|>
              <p>Content Goes Here</p>
            </UiPanel>
          
      */
      {
        "id": "mlrVocrV",
        "block": "[[[1,\"\\n      \"],[8,[39,0],null,[[\"@heading\",\"@testId\",\"@messageManager\"],[\"Hello World\",\"panel\",[30,0,[\"manager\"]]]],[[\"default\"],[[[[1,\"\\n        \"],[10,2],[12],[1,\"Content Goes Here\"],[13],[1,\"\\n      \"]],[1]]]]],[1,\"\\n    \"]],[\"modal\"],false,[\"ui-panel\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('[data-test-id="panel"] [data-test-ident="context-message-success"]').isVisible();
      assert.dom('[data-test-id="panel"] [data-test-ident="context-message-item"]').hasText('Success Message A');
    });
    (0, _qunit.test)('it can be made collapsible', async function (assert) {
      this.set('collapsed', false);

      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        <UiPanel @collapsed={{this.collapsed}}>
              <p>Hello World</p>
            </UiPanel>
      */
      {
        "id": "IJBrFMDr",
        "block": "[[[8,[39,0],null,[[\"@collapsed\"],[[30,0,[\"collapsed\"]]]],[[\"default\"],[[[[1,\"\\n        \"],[10,2],[12],[1,\"Hello World\"],[13],[1,\"\\n      \"]],[]]]]]],[],false,[\"ui-panel\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      const btnSelector = '.panel-heading button';
      assert.dom(btnSelector).isVisible();
      assert.dom(btnSelector).hasText('Collapse');
      assert.dom(btnSelector).hasAttribute('aria-label', 'collapse section');
      assert.dom(btnSelector).hasAttribute('aria-expanded', 'true');
      assert.dom(btnSelector).hasAttribute('aria-controls', (0, _testHelpers.find)('.panel-body')?.parentElement?.id ?? '');
      assert.dom('.panel-body').isVisible();
      await (0, _testHelpers.click)(btnSelector);
      assert.dom(btnSelector).hasText('Expand');
      assert.dom(btnSelector).hasAttribute('aria-label', 'expand section');
      assert.dom(btnSelector).hasAttribute('aria-expanded', 'false');
      assert.dom('.panel-body').isNotVisible();

      // eslint-disable-next-line ember/no-get
      assert.true(this.get('collapsed'), 'The "collapsed" property is true');
      this.set('collapsed', false);
      await (0, _testHelpers.settled)();
      assert.dom(btnSelector).hasText('Collapse');
      assert.dom('.panel-body').isVisible();
    });
    (0, _qunit.test)('it can be initially rendered in the collapsed state', async function (assert) {
      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        <UiPanel @startCollapsed={{true}}>
              <p>Hello World</p>
            </UiPanel>
      */
      {
        "id": "px8wrixa",
        "block": "[[[8,[39,0],null,[[\"@startCollapsed\"],[true]],[[\"default\"],[[[[1,\"\\n        \"],[10,2],[12],[1,\"Hello World\"],[13],[1,\"\\n      \"]],[]]]]]],[],false,[\"ui-panel\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      const btnSelector = '.panel-heading button';
      assert.dom(btnSelector).isVisible();
      assert.dom('.panel-body').isNotVisible();
      await (0, _testHelpers.click)(btnSelector);
      assert.dom('.panel-body').isVisible();
    });
    (0, _qunit.test)('its onShow and onHidden callbacks are run when its collapsed state changes', async function (assert) {
      this.set('onShow', function () {
        assert.step('onShow');
      });
      this.set('onHidden', function () {
        assert.step('onHidden');
      });

      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        <UiPanel @startCollapsed={{false}} @onHidden={{action this.onHidden}} @onShow={{action this.onShow}}>
              <p>Hello World</p>
            </UiPanel>
      */
      {
        "id": "s6Ol3GV/",
        "block": "[[[8,[39,0],null,[[\"@startCollapsed\",\"@onHidden\",\"@onShow\"],[false,[28,[37,1],[[30,0],[30,0,[\"onHidden\"]]],null],[28,[37,1],[[30,0],[30,0,[\"onShow\"]]],null]]],[[\"default\"],[[[[1,\"\\n        \"],[10,2],[12],[1,\"Hello World\"],[13],[1,\"\\n      \"]],[]]]]]],[],false,[\"ui-panel\",\"action\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      const btnSelector = '.panel-heading button';
      assert.dom('.panel-body').isVisible();
      await (0, _testHelpers.click)(btnSelector);
      assert.dom('.panel-body').isNotVisible();
      await (0, _testHelpers.click)(btnSelector);
      assert.dom('.panel-body').isVisible();
      assert.verifySteps(['onHidden', 'onShow']);
    });
    (0, _qunit.test)('a promise returned from the onShow callback will be given to the ui-async-block', async function (assert) {
      let promise;
      this.set('onShow', function () {
        promise = (0, _wait.default)(500, 'Hello World');
        return promise;
      });

      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        <UiPanel @heading="Information" @startCollapsed={{true}} @onShow={{action this.onShow}} as |content|>
                {{content}}
            </UiPanel>
      */
      {
        "id": "JRzOqrTA",
        "block": "[[[8,[39,0],null,[[\"@heading\",\"@startCollapsed\",\"@onShow\"],[\"Information\",true,[28,[37,1],[[30,0],[30,0,[\"onShow\"]]],null]]],[[\"default\"],[[[[1,\"\\n          \"],[1,[30,1]],[1,\"\\n      \"]],[1]]]]]],[\"content\"],false,[\"ui-panel\",\"action\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      await (0, _testHelpers.click)('.panel-heading button');
      assert.dom('[data-test-id="load-indicator"]').isVisible();
      assert.dom('[data-test-id="load-indicator"] p:nth-child(2)').hasText('Loading Information');
      await promise;
      await (0, _testHelpers.settled)();
      assert.dom('.panel-body').hasText('Hello World');
    });
    (0, _qunit.test)('the headerButtons array can be used to create button elements in the header', async function (assert) {
      function handleClick(event) {
        const btn = event.target;
        assert.step(`${btn.textContent?.trim()} clicked`);
      }
      this.set('headerButtons', [{
        text: 'Button A',
        variant: 'info',
        onClick: handleClick
      }, {
        text: 'Button B',
        class: 'test-classname',
        disabled: true,
        icon: 'superpowers'
      }]);

      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        <UiPanel @heading="Panel Heading" @headerButtons={{this.headerButtons}}>
              Hello World
            </UiPanel>
      */
      {
        "id": "k4+avtD3",
        "block": "[[[8,[39,0],null,[[\"@heading\",\"@headerButtons\"],[\"Panel Heading\",[30,0,[\"headerButtons\"]]]],[[\"default\"],[[[[1,\"\\n        Hello World\\n      \"]],[]]]]]],[],false,[\"ui-panel\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      const btnA = '.panel-heading button:nth-child(1)';
      const btnB = '.panel-heading button:nth-child(2)';
      assert.dom(btnA).hasText('Button A');
      assert.dom(btnA).hasClass('btn-info');
      assert.dom(btnA).isNotDisabled();
      await (0, _testHelpers.click)(btnA);
      assert.dom(btnB).hasText('Button B');
      assert.dom(btnB).hasClass('test-classname');
      assert.dom(btnB).isDisabled();
      assert.dom(`${btnB} .fa-superpowers`).exists();
      assert.verifySteps(['Button A clicked']);
    });
    (0, _qunit.test)('the headerButtons array can be used to create button elements in the header next to a collapse toggle', async function (assert) {
      this.set('headerButtons', [{
        text: 'Button A',
        variant: 'info'
      }, {
        text: 'Button B',
        variant: 'info'
      }]);

      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        <UiPanel @heading="Panel Heading" @headerButtons={{this.headerButtons}} @startCollapsed={{true}}>
              Hello World
            </UiPanel>
      */
      {
        "id": "uH0taASY",
        "block": "[[[8,[39,0],null,[[\"@heading\",\"@headerButtons\",\"@startCollapsed\"],[\"Panel Heading\",[30,0,[\"headerButtons\"]],true]],[[\"default\"],[[[[1,\"\\n        Hello World\\n      \"]],[]]]]]],[],false,[\"ui-panel\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      const btnA = '.panel-heading button:nth-child(1)';
      const btnB = '.panel-heading button:nth-child(2)';
      const btnC = '.panel-heading button:nth-child(3)';
      assert.dom(btnA).hasText('Button A');
      assert.dom(btnB).hasText('Button B');
      assert.dom(btnC).hasText('Expand');
    });
  });
});
define("dummy/tests/integration/components/ui-popover-test", ["@ember/template-factory", "qunit", "ember-qunit", "@ember/test-helpers"], function (_templateFactory, _qunit, _emberQunit, _testHelpers) {
  "use strict";

  0; //eaimeta@70e063a35619d71f0,"qunit",0,"ember-qunit",0,"@ember/test-helpers",0,"ember-cli-htmlbars"eaimeta@70e063a35619d71f
  (0, _qunit.module)('Integration | Component | ui-popover', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);
    (0, _qunit.test)('it attaches event listeners to its parent element', async function (assert) {
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            <button id="toggle">
              Foo <UiPopover>Hello World</UiPopover>
            </button>
          
      */
      {
        "id": "72wdRlGw",
        "block": "[[[1,\"\\n      \"],[10,\"button\"],[14,1,\"toggle\"],[12],[1,\"\\n        Foo \"],[8,[39,0],null,null,[[\"default\"],[[[[1,\"Hello World\"]],[]]]]],[1,\"\\n      \"],[13],[1,\"\\n    \"]],[],false,[\"ui-popover\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      const overlay = (0, _testHelpers.find)('.popover');
      assert.dom('#toggle').hasAttribute('aria-controls', overlay.id).hasAttribute('aria-expanded', 'false');
      assert.dom('.popover').isNotVisible();
      await (0, _testHelpers.click)('#toggle');
      assert.dom('#toggle').hasAttribute('aria-expanded', 'true');
      assert.dom('.popover .popover-content').isVisible().hasText('Hello World');
      await (0, _testHelpers.click)('#toggle');
      assert.dom('.popover').isNotVisible();
    });
    (0, _qunit.test)('it is not closed by outside interactions', async function (assert) {
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            <button id="toggle">
              Foo <UiPopover>Hello World</UiPopover>
            </button>
      
            <button id="other-button">Click Me</button>
          
      */
      {
        "id": "sqb22vwC",
        "block": "[[[1,\"\\n      \"],[10,\"button\"],[14,1,\"toggle\"],[12],[1,\"\\n        Foo \"],[8,[39,0],null,null,[[\"default\"],[[[[1,\"Hello World\"]],[]]]]],[1,\"\\n      \"],[13],[1,\"\\n\\n      \"],[10,\"button\"],[14,1,\"other-button\"],[12],[1,\"Click Me\"],[13],[1,\"\\n    \"]],[],false,[\"ui-popover\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('.popover').isNotVisible();
      await (0, _testHelpers.click)('#toggle');
      assert.dom('.popover').isVisible();
      await (0, _testHelpers.click)('#other-button');
      assert.dom('.popover').isVisible();
    });
    (0, _qunit.test)('it accepts a heading', async function (assert) {
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            <button>
              Foo <UiPopover @title="Popover Title">Hello World</UiPopover>
            </button>
          
      */
      {
        "id": "6M5bADnf",
        "block": "[[[1,\"\\n      \"],[10,\"button\"],[12],[1,\"\\n        Foo \"],[8,[39,0],null,[[\"@title\"],[\"Popover Title\"]],[[\"default\"],[[[[1,\"Hello World\"]],[]]]]],[1,\"\\n      \"],[13],[1,\"\\n    \"]],[],false,[\"ui-popover\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('.popover').hasTagName('section');
      assert.dom('.popover .popover-title').hasTagName('header').hasText('Popover Title');
    });
    (0, _qunit.test)('it manages focus as though it were inline with its trigger', async function (assert) {
      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            <a href="#">Other focus target A</a>
      
            <UiButton @variant="primary" id="trigger">
              Log In
              <UiPopover @title="Please Login to Your Account to Continue" @renderInPlace={{this.renderInPlace}}>
                <label for="username">Username</label>
                <input type="text" id="username" />
      
                <label for="password">Password</label>
                <input type="password" id="password" />
      
                <button type="button" id="submitLogin">Login</button>
              </UiPopover>
            </UiButton>
      
            <a href="#" id="alternateFocusB">Other focus target B</a>
          
      */
      {
        "id": "jBz1hpkd",
        "block": "[[[1,\"\\n      \"],[10,3],[14,6,\"#\"],[12],[1,\"Other focus target A\"],[13],[1,\"\\n\\n      \"],[8,[39,0],[[24,1,\"trigger\"]],[[\"@variant\"],[\"primary\"]],[[\"default\"],[[[[1,\"\\n        Log In\\n        \"],[8,[39,1],null,[[\"@title\",\"@renderInPlace\"],[\"Please Login to Your Account to Continue\",[30,0,[\"renderInPlace\"]]]],[[\"default\"],[[[[1,\"\\n          \"],[10,\"label\"],[14,\"for\",\"username\"],[12],[1,\"Username\"],[13],[1,\"\\n          \"],[10,\"input\"],[14,1,\"username\"],[14,4,\"text\"],[12],[13],[1,\"\\n\\n          \"],[10,\"label\"],[14,\"for\",\"password\"],[12],[1,\"Password\"],[13],[1,\"\\n          \"],[10,\"input\"],[14,1,\"password\"],[14,4,\"password\"],[12],[13],[1,\"\\n\\n          \"],[10,\"button\"],[14,1,\"submitLogin\"],[14,4,\"button\"],[12],[1,\"Login\"],[13],[1,\"\\n        \"]],[]]]]],[1,\"\\n      \"]],[]]]]],[1,\"\\n\\n      \"],[10,3],[14,6,\"#\"],[14,1,\"alternateFocusB\"],[12],[1,\"Other focus target B\"],[13],[1,\"\\n    \"]],[],false,[\"ui-button\",\"ui-popover\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));

      // See https://github.com/emberjs/ember-test-helpers/issues/738
      // Some keyboard interaction are particularly difficult to fake with Javascript,
      // and tabbing through focusable elements is one of them. For this, we only
      // _really_ want to make sure that focus gets wrapped between first <-> last
      // elements in the modal. Going out on a limb here that the browser is capable
      // of handing everything in-between.

      assert.dom('.popover').isNotVisible();
      await (0, _testHelpers.click)('#trigger');
      assert.dom('.popover').isVisible();
      assert.dom('#trigger').isFocused();
      await (0, _testHelpers.triggerKeyEvent)('#trigger', 'keydown', 'Tab');
      assert.dom('.popover button[aria-label="Close"]').isFocused();
      await (0, _testHelpers.focus)('.popover #submitLogin');
      await (0, _testHelpers.triggerKeyEvent)('.popover', 'keydown', 'Tab');
      assert.dom('#alternateFocusB').isFocused();
      await (0, _testHelpers.triggerKeyEvent)('#alternateFocusB', 'keydown', 'Tab', {
        shiftKey: true
      });
      assert.dom('.popover #submitLogin').isFocused();
      await (0, _testHelpers.focus)('.popover button[aria-label="Close"]');
      await (0, _testHelpers.triggerKeyEvent)('.popover', 'keydown', 'Tab', {
        shiftKey: true
      });
      assert.dom('#trigger').isFocused();
    });
    (0, _qunit.test)('it can be closed with its own close button', async function (assert) {
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            <button id="toggle">
              Foo <UiPopover>Hello World</UiPopover>
            </button>
          
      */
      {
        "id": "72wdRlGw",
        "block": "[[[1,\"\\n      \"],[10,\"button\"],[14,1,\"toggle\"],[12],[1,\"\\n        Foo \"],[8,[39,0],null,null,[[\"default\"],[[[[1,\"Hello World\"]],[]]]]],[1,\"\\n      \"],[13],[1,\"\\n    \"]],[],false,[\"ui-popover\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('.popover').isNotVisible();
      await (0, _testHelpers.click)('#toggle');
      assert.dom('.popover').isVisible();
      await (0, _testHelpers.click)('.popover button[aria-label="Close"]');
      assert.dom('.popover').isNotVisible();
      assert.dom('#toggle').isFocused();
    });
  });
});
define("dummy/tests/integration/components/ui-popper-test", ["@ember/template-factory", "qunit", "ember-qunit", "@ember/test-helpers", "dummy/tests/helpers/lookup-component"], function (_templateFactory, _qunit, _emberQunit, _testHelpers, _lookupComponent) {
  "use strict";

  0; //eaimeta@70e063a35619d71f0,"qunit",0,"ember-qunit",0,"@ember/test-helpers",0,"htmlbars-inline-precompile",0,"dummy/tests/helpers/lookup-component"eaimeta@70e063a35619d71f
  (0, _qunit.module)('Integration | Component | ui-popper', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);
    hooks.afterEach(async function () {
      // Some tests scroll around so this ensures things always get put back.
      // @ts-expect-error The root testing element will always have a parent
      await (0, _testHelpers.scrollTo)((0, _testHelpers.getRootElement)().parentElement, 0, 0);
    });
    (0, _qunit.test)('it generates a PopperJS instance', async function (assert) {
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            <div id="original-container">
              <UiPopper @popperTarget="#target-btn" @id="test-popper">
                Hello World
              </UiPopper>
            </div>
      
            <button id="target-btn">A Button</button>
          
      */
      {
        "id": "iYqf4IF8",
        "block": "[[[1,\"\\n      \"],[10,0],[14,1,\"original-container\"],[12],[1,\"\\n        \"],[8,[39,0],null,[[\"@popperTarget\",\"@id\"],[\"#target-btn\",\"test-popper\"]],[[\"default\"],[[[[1,\"\\n          Hello World\\n        \"]],[]]]]],[1,\"\\n      \"],[13],[1,\"\\n\\n      \"],[10,\"button\"],[14,1,\"target-btn\"],[12],[1,\"A Button\"],[13],[1,\"\\n    \"]],[],false,[\"ui-popper\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('#test-popper').isVisible();
      assert.dom('#test-popper').hasText('Hello World');
      assert.dom('#test-popper').hasAttribute('data-popper-placement', 'bottom');
      assert.notEqual((0, _testHelpers.find)('#test-popper')?.parentNode, (0, _testHelpers.find)('#original-container'), 'The popper has been moved out of its original parent node');
    });
    (0, _qunit.test)('it can be rendered where it was defined', async function (assert) {
      // language=Handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            <div id="original-container">
              <UiPopper @popperTarget="#target-btn" @id="test-popper" @renderInPlace={{true}}>
                Hello World
              </UiPopper>
            </div>
      
            <button id="target-btn">A Button</button>
          
      */
      {
        "id": "uMqxiTl9",
        "block": "[[[1,\"\\n      \"],[10,0],[14,1,\"original-container\"],[12],[1,\"\\n        \"],[8,[39,0],null,[[\"@popperTarget\",\"@id\",\"@renderInPlace\"],[\"#target-btn\",\"test-popper\",true]],[[\"default\"],[[[[1,\"\\n          Hello World\\n        \"]],[]]]]],[1,\"\\n      \"],[13],[1,\"\\n\\n      \"],[10,\"button\"],[14,1,\"target-btn\"],[12],[1,\"A Button\"],[13],[1,\"\\n    \"]],[],false,[\"ui-popper\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.strictEqual((0, _testHelpers.find)('#test-popper')?.parentNode, (0, _testHelpers.find)('#original-container'), "The popper's current parent is its original parent node");
    });
    (0, _qunit.test)('it will create an id for the positioned content if not provided', async function (assert) {
      // language=Handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            <UiPopper @popperTarget="#target-btn" @class="test-popper">Hello World</UiPopper>
            <button id="target-btn">A Button</button>
          
      */
      {
        "id": "sxbxpt16",
        "block": "[[[1,\"\\n      \"],[8,[39,0],null,[[\"@popperTarget\",\"@class\"],[\"#target-btn\",\"test-popper\"]],[[\"default\"],[[[[1,\"Hello World\"]],[]]]]],[1,\"\\n      \"],[10,\"button\"],[14,1,\"target-btn\"],[12],[1,\"A Button\"],[13],[1,\"\\n    \"]],[],false,[\"ui-popper\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('.test-popper').hasAttribute('id', /.+-popper/);
    });
    (0, _qunit.test)('it has several target-finding strategies', async function (assert) {
      this.set('popperTarget', '#target-btn');

      // language=Handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            <div id="original-container">
              <UiPopper @popperTarget={{this.popperTarget}} @class="test-popper">Hello World</UiPopper>
            </div>
      
            <button id="target-btn">A Button</button>
            <button id="other-target">Another Button</button>
          
      */
      {
        "id": "Wc5ZSSa8",
        "block": "[[[1,\"\\n      \"],[10,0],[14,1,\"original-container\"],[12],[1,\"\\n        \"],[8,[39,0],null,[[\"@popperTarget\",\"@class\"],[[30,0,[\"popperTarget\"]],\"test-popper\"]],[[\"default\"],[[[[1,\"Hello World\"]],[]]]]],[1,\"\\n      \"],[13],[1,\"\\n\\n      \"],[10,\"button\"],[14,1,\"target-btn\"],[12],[1,\"A Button\"],[13],[1,\"\\n      \"],[10,\"button\"],[14,1,\"other-target\"],[12],[1,\"Another Button\"],[13],[1,\"\\n    \"]],[],false,[\"ui-popper\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      const popperId = (0, _testHelpers.find)('.test-popper')?.getAttribute('id')?.replace('-popper', '');
      const instance = (0, _lookupComponent.default)(this, popperId);
      assert.strictEqual(instance.realPopperTarget, (0, _testHelpers.find)('#target-btn'));
      this.set('popperTarget', (0, _testHelpers.find)('#other-target'));
      await (0, _testHelpers.settled)();
      assert.strictEqual(instance.realPopperTarget, (0, _testHelpers.find)('#other-target'));
      this.set('popperTarget', undefined);
      await (0, _testHelpers.settled)();
      assert.strictEqual(instance.realPopperTarget, (0, _testHelpers.find)('#original-container'));
    });
    (0, _qunit.test)('it can be dynamically configured', async function (assert) {
      this.set('handlePopperUpdate', undefined);
      this.set('placement', 'bottom');
      this.set('renderInPlace', false);
      this.set('enabled', true);

      // language=Handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            <div id="original-container">
              <UiPopper
                      @popperTarget="#target-btn"
                      @id="test-popper"
                      @renderInPlace={{this.renderInPlace}}
                      @placement={{this.placement}}
                      @enabled={{this.enabled}}
                      @onUpdate={{this.handlePopperUpdate}}
              >
                Hello World
              </UiPopper>
            </div>
      
            <button id="target-btn" style="margin-top: 50px; margin-left: 50px;">A Button</button>
          
      */
      {
        "id": "pP9BSK6+",
        "block": "[[[1,\"\\n      \"],[10,0],[14,1,\"original-container\"],[12],[1,\"\\n        \"],[8,[39,0],null,[[\"@popperTarget\",\"@id\",\"@renderInPlace\",\"@placement\",\"@enabled\",\"@onUpdate\"],[\"#target-btn\",\"test-popper\",[30,0,[\"renderInPlace\"]],[30,0,[\"placement\"]],[30,0,[\"enabled\"]],[30,0,[\"handlePopperUpdate\"]]]],[[\"default\"],[[[[1,\"\\n          Hello World\\n        \"]],[]]]]],[1,\"\\n      \"],[13],[1,\"\\n\\n      \"],[10,\"button\"],[14,1,\"target-btn\"],[14,5,\"margin-top: 50px; margin-left: 50px;\"],[12],[1,\"A Button\"],[13],[1,\"\\n    \"]],[],false,[\"ui-popper\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('#test-popper').isVisible();
      assert.dom('#test-popper').hasAttribute('data-popper-placement', 'bottom');
      this.set('placement', 'right');
      await (0, _testHelpers.settled)();
      assert.dom('#test-popper').hasAttribute('data-popper-placement', 'right');
      assert.notEqual((0, _testHelpers.find)('#test-popper')?.parentNode, (0, _testHelpers.find)('#original-container'), 'The popper has been moved out of its original parent node');
      this.set('renderInPlace', true);
      await (0, _testHelpers.settled)();
      assert.strictEqual((0, _testHelpers.find)('#test-popper')?.parentNode, (0, _testHelpers.find)('#original-container'), "The popper's current parent is its original parent node");
      this.set('enabled', false);
      await (0, _testHelpers.settled)();
      assert.dom('#test-popper').exists();
      assert.dom('#test-popper').isNotVisible();
      assert.dom('#test-popper').doesNotHaveAttribute('data-popper-placement');
      assert.dom('#test-popper').hasAttribute('data-popper-disabled');
      assert.dom('#test-popper').hasStyle({
        display: 'none'
      });
      let onUpdateCount = 0;
      this.set('enabled', true);
      this.set('placement', 'top');
      this.set('renderInPlace', false);
      this.set('handlePopperUpdate', () => {
        if (onUpdateCount < 2) {
          assert.step('onUpdate');
        }

        // This could wind up getting called a lot depending on a ton of factors
        // that PopperJS deems relevant. Don't care about all of the calls, just
        // the couple expected ones.
        onUpdateCount += 1;
      });
      await (0, _testHelpers.settled)();
      assert.dom('#test-popper').isVisible();
      assert.dom('#test-popper').doesNotHaveAttribute('data-popper-disabled');
      assert.dom('#test-popper').hasAttribute('data-popper-placement', 'top');

      // @ts-expect-error The root testing element will always have a parent
      await (0, _testHelpers.scrollTo)((0, _testHelpers.getRootElement)().parentElement, 0, 30);
      await (0, _testHelpers.settled)();

      // Two calls are expected - the first will happen as a result of the popper
      // being enabled and its layout getting calculated. The second will be due
      // to the scroll event that just occurred.
      assert.verifySteps(['onUpdate', 'onUpdate']);
    });
  });
});
define("dummy/tests/integration/components/ui-progress-bar-test", ["@ember/template-factory", "qunit", "ember-qunit", "@ember/test-helpers", "@nsf-open/ember-ui-foundation/lib/ProgressManager"], function (_templateFactory, _qunit, _emberQunit, _testHelpers, _ProgressManager) {
  "use strict";

  0; //eaimeta@70e063a35619d71f0,"qunit",0,"ember-qunit",0,"@ember/test-helpers",0,"ember-cli-htmlbars",0,"@nsf-open/ember-ui-foundation/lib/ProgressManager"eaimeta@70e063a35619d71f
  (0, _qunit.module)('Integration | Component | ui-progress-bar', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);
    (0, _qunit.test)('it displays a navigable chevron bar', async function (assert) {
      const manager = new _ProgressManager.default([{
        label: 'Step A',
        indeterminate: true
      }, {
        label: 'Step B'
      }, {
        label: 'Step C',
        complete: true
      }]);
      this.set('manager', manager);

      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        <UiProgressBar @manager={{this.manager}} />
      */
      {
        "id": "QZ5my2c9",
        "block": "[[[8,[39,0],null,[[\"@manager\"],[[30,0,[\"manager\"]]]],null]],[],false,[\"ui-progress-bar\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      const chevron1 = 'ol.progress-chevrons li:nth-child(1)';
      const chevron2 = 'ol.progress-chevrons li:nth-child(2)';
      const chevron3 = 'ol.progress-chevrons li:nth-child(3)';
      function shouldHaveClass(selector, classNames) {
        classNames.forEach(function (name) {
          assert.dom(selector).hasClass(name);
        });
      }
      function shouldNotHaveClass(selector, classNames) {
        classNames.forEach(function (name) {
          assert.dom(selector).doesNotHaveClass(name);
        });
      }
      shouldHaveClass(chevron1, ['chevron', 'active', 'indeterminate']);
      shouldNotHaveClass(chevron1, ['complete', 'incomplete', 'inactive', 'prev-active', 'past-active', 'next-active', 'future-active']);
      shouldHaveClass(chevron2, ['chevron', 'inactive', 'incomplete', 'prev-active', 'past-active']);
      shouldNotHaveClass(chevron2, ['complete', 'indeterminate', 'active', 'next-active', 'future-active']);
      shouldHaveClass(chevron3, ['chevron', 'inactive', 'complete', 'past-active']);
      shouldNotHaveClass(chevron3, ['incomplete', 'indeterminate', 'active', 'prev-active', 'next-active', 'future-active']);
      assert.dom(`${chevron1} a`).doesNotExist();
      assert.dom(`${chevron2} a`).exists();
      assert.dom(`${chevron3} a`).doesNotExist();
      await (0, _testHelpers.click)(`${chevron2} a`);
      shouldHaveClass(chevron1, ['chevron', 'inactive', 'indeterminate', 'next-active', 'future-active']);
      shouldNotHaveClass(chevron1, ['complete', 'incomplete', 'active', 'prev-active', 'past-active']);
      shouldHaveClass(chevron2, ['chevron', 'active', 'incomplete']);
      shouldNotHaveClass(chevron2, ['complete', 'inactive', 'prev-active', 'past-active', 'next-active', 'future-active']);
      shouldHaveClass(chevron3, ['chevron', 'inactive', 'complete', 'prev-active', 'past-active']);
      shouldNotHaveClass(chevron3, ['incomplete', 'indeterminate', 'active', 'next-active', 'future-active']);
      assert.dom(`${chevron1} a`).exists();
      assert.dom(`${chevron2} a`).doesNotExist();
      assert.dom(`${chevron3} a`).doesNotExist();
      manager.getStepAt(1)?.markComplete();
      await (0, _testHelpers.settled)();
      assert.dom(chevron2).hasClass('complete');
      assert.dom(chevron2).doesNotHaveClass('incomplete');
      assert.dom(`${chevron1} a`).exists();
      assert.dom(`${chevron2} a`).doesNotExist();
      assert.dom(`${chevron3} a`).exists();
      await (0, _testHelpers.click)(`${chevron3} a`);
      shouldHaveClass(chevron1, ['chevron', 'inactive', 'indeterminate', 'future-active']);
      shouldNotHaveClass(chevron1, ['complete', 'incomplete', 'active', 'prev-active', 'past-active', 'next-active']);
      shouldHaveClass(chevron2, ['chevron', 'inactive', 'complete', 'next-active', 'future-active']);
      shouldNotHaveClass(chevron2, ['incomplete', 'active', 'prev-active', 'past-active']);
      shouldHaveClass(chevron3, ['chevron', 'active', 'complete']);
      shouldNotHaveClass(chevron3, ['incomplete', 'indeterminate', 'inactive', 'prev-active', 'past-active', 'next-active', 'future-active']);
    });
    (0, _qunit.test)('it optionally prefixes chevrons with numbers', async function (assert) {
      const manager = new _ProgressManager.default([{
        label: 'Step A'
      }, {
        label: 'Step B'
      }]);
      this.set('manager', manager);
      this.set('number', false);

      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        <UiProgressBar @manager={{this.manager}} @number={{this.number}} />
      */
      {
        "id": "l16Wk7x8",
        "block": "[[[8,[39,0],null,[[\"@manager\",\"@number\"],[[30,0,[\"manager\"]],[30,0,[\"number\"]]]],null]],[],false,[\"ui-progress-bar\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
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
    (0, _qunit.test)('it optionally spans the whole width of its parent container', async function (assert) {
      const manager = new _ProgressManager.default([{
        label: 'Step A'
      }, {
        label: 'Step B'
      }]);
      this.set('manager', manager);
      this.set('compact', true);

      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        <UiProgressBar @manager={{this.manager}} @compact={{this.compact}} />
      */
      {
        "id": "8eRcD4q3",
        "block": "[[[8,[39,0],null,[[\"@manager\",\"@compact\"],[[30,0,[\"manager\"]],[30,0,[\"compact\"]]]],null]],[],false,[\"ui-progress-bar\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('ol.progress-chevrons').hasClass('progress-chevrons-compact');
      this.set('compact', false);
      assert.dom('ol.progress-chevrons').doesNotHaveClass('progress-chevrons-compact');
    });
    (0, _qunit.test)('it optionally displays checkmarks at the end of completed steps', async function (assert) {
      const manager = new _ProgressManager.default([{
        label: 'Step A',
        indeterminate: true
      }, {
        label: 'Step B',
        complete: true
      }, {
        label: 'Step C'
      }]);
      this.set('manager', manager);
      this.set('checkmark', false);

      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        <UiProgressBar @manager={{this.manager}} @checkmark={{this.checkmark}} />
      */
      {
        "id": "cPu2Xiii",
        "block": "[[[8,[39,0],null,[[\"@manager\",\"@checkmark\"],[[30,0,[\"manager\"]],[30,0,[\"checkmark\"]]]],null]],[],false,[\"ui-progress-bar\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
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
      await (0, _testHelpers.settled)();
      assert.dom(`${chevron3} span:nth-child(3)`).hasClass('fa-check');
    });
  });
});
define("dummy/tests/integration/components/ui-sorter-test", ["@ember/template-factory", "qunit", "ember-qunit", "@ember/test-helpers"], function (_templateFactory, _qunit, _emberQunit, _testHelpers) {
  "use strict";

  0; //eaimeta@70e063a35619d71f0,"qunit",0,"ember-qunit",0,"@ember/test-helpers",0,"htmlbars-inline-precompile"eaimeta@70e063a35619d71f
  (0, _qunit.module)('Integration | Component | ui-sorter', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);
    const recordSet = [{
      firstName: 'Herbert',
      lastName: 'Labadie'
    }, {
      firstName: 'Caleb',
      lastName: 'Welch'
    }, {
      firstName: 'Lila',
      lastName: 'Yundt'
    }, {
      firstName: 'Brittany',
      lastName: 'Kuhic'
    }, {
      firstName: 'Terence',
      lastName: 'Brakus'
    }, {
      firstName: 'Iris',
      lastName: 'Feil'
    }, {
      firstName: 'Homer',
      lastName: 'Dietrich'
    }, {
      firstName: 'Stacy',
      lastName: 'Dietrich'
    }, {
      firstName: 'Karla',
      lastName: 'Dietrich'
    }, {
      firstName: 'Clifton',
      lastName: 'Koelpin'
    }, {
      firstName: 'Olive',
      lastName: 'Abernathy'
    }, {
      firstName: 'Debra',
      lastName: 'Feil'
    }, {
      firstName: 'Melody',
      lastName: 'Kreiger'
    }, {
      firstName: 'Belinda',
      lastName: 'Emard'
    }, {
      firstName: 'Lyle',
      lastName: 'Halvorson'
    }];
    async function renderComponent() {
      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            <UiSorter @records={{this.recordSet}} as |Sorter|>
              <p class="text-right">{{Sorter.description}}</p>
      
              <table class="table table-striped table-condensed">
                <thead>
                  <tr>
                    <Sorter.Criterion
                      @sortOn="firstName"
                      @name={{this.firstNameDisplayName}}
                      @direction={{this.firstNameSortDirection}}
                      @subSortOn={{this.firstNameSubSortOn}}
                      @subSortDirection={{this.firstNameSubSortDirection}}
                    as |Criterion|>
                      <th onclick={{Criterion.cycleDirection}} aria-sort="{{Criterion.direction}}">
                          {{if Criterion.index (concat Criterion.index '. ')}}
                          First Name
                          <UiIcon @name={{Criterion.iconClass}} />
                      </th>
                    </Sorter.Criterion>
      
                    <Sorter.Criterion
                      @sortOn="lastName"
                      @name={{this.lastNameDisplayName}}
                      @direction={{this.lastNameSortDirection}}
                      @subSortOn={{this.lastNameSubSortOn}}
                      @subSortDirection={{this.lastNameSubSortDirection}}
                    as |Criterion|>
                      <th onclick={{Criterion.cycleDirection}} aria-sort="{{Criterion.direction}}">
                        {{if Criterion.index (concat Criterion.index '. ')}}
                        Last Name
                        <UiIcon @name={{Criterion.iconClass}} />
                      </th>
                    </Sorter.Criterion>
                  </tr>
                </thead>
      
                  <tbody>
                  {{#each Sorter.sortedRecords as |record|}}
                      <tr>
                          <td>{{record.firstName}}</td>
                          <td>{{record.lastName}}</td>
                      </tr>
                  {{/each}}
                  </tbody>
              </table>
            </UiSorter>
          
      */
      {
        "id": "y8KN2v0l",
        "block": "[[[1,\"\\n      \"],[8,[39,0],null,[[\"@records\"],[[30,0,[\"recordSet\"]]]],[[\"default\"],[[[[1,\"\\n        \"],[10,2],[14,0,\"text-right\"],[12],[1,[30,1,[\"description\"]]],[13],[1,\"\\n\\n        \"],[10,\"table\"],[14,0,\"table table-striped table-condensed\"],[12],[1,\"\\n          \"],[10,\"thead\"],[12],[1,\"\\n            \"],[10,\"tr\"],[12],[1,\"\\n              \"],[8,[30,1,[\"Criterion\"]],null,[[\"@sortOn\",\"@name\",\"@direction\",\"@subSortOn\",\"@subSortDirection\"],[\"firstName\",[30,0,[\"firstNameDisplayName\"]],[30,0,[\"firstNameSortDirection\"]],[30,0,[\"firstNameSubSortOn\"]],[30,0,[\"firstNameSubSortDirection\"]]]],[[\"default\"],[[[[1,\"\\n                \"],[10,\"th\"],[15,\"onclick\",[30,2,[\"cycleDirection\"]]],[15,\"aria-sort\",[29,[[30,2,[\"direction\"]]]]],[12],[1,\"\\n                    \"],[1,[52,[30,2,[\"index\"]],[28,[37,2],[[30,2,[\"index\"]],\". \"],null]]],[1,\"\\n                    First Name\\n                    \"],[8,[39,3],null,[[\"@name\"],[[30,2,[\"iconClass\"]]]],null],[1,\"\\n                \"],[13],[1,\"\\n              \"]],[2]]]]],[1,\"\\n\\n              \"],[8,[30,1,[\"Criterion\"]],null,[[\"@sortOn\",\"@name\",\"@direction\",\"@subSortOn\",\"@subSortDirection\"],[\"lastName\",[30,0,[\"lastNameDisplayName\"]],[30,0,[\"lastNameSortDirection\"]],[30,0,[\"lastNameSubSortOn\"]],[30,0,[\"lastNameSubSortDirection\"]]]],[[\"default\"],[[[[1,\"\\n                \"],[10,\"th\"],[15,\"onclick\",[30,3,[\"cycleDirection\"]]],[15,\"aria-sort\",[29,[[30,3,[\"direction\"]]]]],[12],[1,\"\\n                  \"],[1,[52,[30,3,[\"index\"]],[28,[37,2],[[30,3,[\"index\"]],\". \"],null]]],[1,\"\\n                  Last Name\\n                  \"],[8,[39,3],null,[[\"@name\"],[[30,3,[\"iconClass\"]]]],null],[1,\"\\n                \"],[13],[1,\"\\n              \"]],[3]]]]],[1,\"\\n            \"],[13],[1,\"\\n          \"],[13],[1,\"\\n\\n            \"],[10,\"tbody\"],[12],[1,\"\\n\"],[42,[28,[37,5],[[28,[37,5],[[30,1,[\"sortedRecords\"]]],null]],null],null,[[[1,\"                \"],[10,\"tr\"],[12],[1,\"\\n                    \"],[10,\"td\"],[12],[1,[30,4,[\"firstName\"]]],[13],[1,\"\\n                    \"],[10,\"td\"],[12],[1,[30,4,[\"lastName\"]]],[13],[1,\"\\n                \"],[13],[1,\"\\n\"]],[4]],null],[1,\"            \"],[13],[1,\"\\n        \"],[13],[1,\"\\n      \"]],[1]]]]],[1,\"\\n    \"]],[\"Sorter\",\"Criterion\",\"Criterion\",\"record\"],false,[\"ui-sorter\",\"if\",\"concat\",\"ui-icon\",\"each\",\"-track-array\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
    }
    function tableCell(row, col) {
      return `table tbody tr:nth-child(${row}) td:nth-child(${col})`;
    }
    function tableHeader(col) {
      return `table thead tr th:nth-child(${col})`;
    }
    (0, _qunit.test)('it sorts an array', async function (assert) {
      this.set('recordSet', recordSet);
      this.set('firstNameSortDirection', 'none');
      this.set('lastNameSortDirection', 'none');
      await renderComponent();

      // With no sorting in place, the table should show everything in
      // exactly the order provided
      assert.dom('p').hasText('No sorting has been applied');
      assert.dom(tableHeader(1)).hasText('First Name').hasAria('sort', 'none');
      assert.dom(`${tableHeader(1)} .fa`).hasClass('fa-sort');
      assert.dom(tableHeader(2)).hasText('Last Name').hasAria('sort', 'none');
      assert.dom(`${tableHeader(2)} .fa`).hasClass('fa-sort');
      assert.dom('table tbody tr').exists({
        count: 15
      });
      assert.dom(tableCell(1, 1)).hasText('Herbert');
      assert.dom(tableCell(15, 2)).hasText('Halvorson');

      // Ascending first name
      await (0, _testHelpers.click)(tableHeader(1));
      assert.dom('p').hasText('Sorted on First Name ascending');
      assert.dom(tableHeader(1)).hasText('1. First Name').hasAria('sort', 'ascending');
      assert.dom(`${tableHeader(1)} .fa`).hasClass('fa-sort-asc');
      assert.dom('table tbody tr').exists({
        count: 15
      });
      assert.dom(tableCell(1, 1)).hasText('Belinda');
      assert.dom(tableCell(15, 2)).hasText('Brakus');

      // Descending first name
      await (0, _testHelpers.click)(tableHeader(1));
      assert.dom('p').hasText('Sorted on First Name descending');
      assert.dom(tableHeader(1)).hasText('1. First Name').hasAria('sort', 'descending');
      assert.dom(`${tableHeader(1)} .fa`).hasClass('fa-sort-desc');
      assert.dom('table tbody tr').exists({
        count: 15
      });
      assert.dom(tableCell(1, 1)).hasText('Terence');
      assert.dom(tableCell(15, 2)).hasText('Emard');

      // Back to default
      await (0, _testHelpers.click)(tableHeader(1));
      assert.dom('p').hasText('No sorting has been applied');
      assert.dom(tableHeader(1)).hasText('First Name').hasAria('sort', 'none');
      assert.dom(`${tableHeader(1)} .fa`).hasClass('fa-sort');
      assert.dom('table tbody tr').exists({
        count: 15
      });
      assert.dom(tableCell(1, 1)).hasText('Herbert');
      assert.dom(tableCell(15, 2)).hasText('Halvorson');

      // Time to try two active sorters
      await (0, _testHelpers.click)(tableHeader(2));
      assert.dom('p').hasText('Sorted on Last Name ascending');
      await (0, _testHelpers.click)(tableHeader(2));
      assert.dom(tableCell(11, 1)).hasText('Homer');
      assert.dom(tableCell(11, 2)).hasText('Dietrich');
      assert.dom(tableCell(12, 1)).hasText('Stacy');
      assert.dom(tableCell(12, 2)).hasText('Dietrich');
      assert.dom(tableCell(13, 1)).hasText('Karla');
      assert.dom(tableCell(13, 2)).hasText('Dietrich');
      await (0, _testHelpers.click)(tableHeader(1));
      assert.dom('p').hasText('Sorted on Last Name descending, First Name ascending');
      assert.dom(tableHeader(1)).hasText('2. First Name');
      assert.dom(tableHeader(2)).hasText('1. Last Name');
      assert.dom(tableCell(11, 1)).hasText('Homer');
      assert.dom(tableCell(11, 2)).hasText('Dietrich');
      assert.dom(tableCell(12, 1)).hasText('Karla');
      assert.dom(tableCell(12, 2)).hasText('Dietrich');
      assert.dom(tableCell(13, 1)).hasText('Stacy');
      assert.dom(tableCell(13, 2)).hasText('Dietrich');
      await (0, _testHelpers.click)(tableHeader(2));
      assert.dom('p').hasText('Sorted on First Name ascending');
      assert.dom(tableHeader(1)).hasText('1. First Name');
    });
    (0, _qunit.test)('sorts can be configured when the component is initialized', async function (assert) {
      this.set('recordSet', recordSet);
      this.set('firstNameSortDirection', 'none');
      this.set('lastNameSortDirection', 'descending');
      await renderComponent();
      assert.dom('p').hasText('Sorted on Last Name descending');
      assert.dom(tableHeader(2)).hasText('1. Last Name').hasAria('sort', 'descending');
      assert.dom('table tbody tr').exists({
        count: 15
      });
      assert.dom(tableCell(1, 1)).hasText('Lila');
      assert.dom(tableCell(15, 2)).hasText('Abernathy');
    });
    (0, _qunit.test)('sub-sorting can be configured', async function (assert) {
      this.set('recordSet', recordSet);
      this.set('firstNameSortDirection', 'none');
      this.set('lastNameSortDirection', 'none');
      this.set('lastNameSubSortOn', 'firstName');
      await renderComponent();
      assert.dom('p').hasText('No sorting has been applied');
      assert.dom('table tbody tr').exists({
        count: 15
      });
      assert.dom(tableCell(1, 1)).hasText('Herbert');
      assert.dom(tableCell(15, 2)).hasText('Halvorson');

      // Ascending first name
      await (0, _testHelpers.click)(tableHeader(2));
      assert.dom(tableCell(3, 1)).hasText('Homer');
      assert.dom(tableCell(3, 2)).hasText('Dietrich');
      assert.dom(tableCell(4, 1)).hasText('Karla');
      assert.dom(tableCell(4, 2)).hasText('Dietrich');
      assert.dom(tableCell(5, 1)).hasText('Stacy');
      assert.dom(tableCell(5, 2)).hasText('Dietrich');
      await (0, _testHelpers.click)(tableHeader(2));
      assert.dom(tableCell(11, 1)).hasText('Stacy');
      assert.dom(tableCell(11, 2)).hasText('Dietrich');
      assert.dom(tableCell(12, 1)).hasText('Karla');
      assert.dom(tableCell(12, 2)).hasText('Dietrich');
      assert.dom(tableCell(13, 1)).hasText('Homer');
      assert.dom(tableCell(13, 2)).hasText('Dietrich');
    });
    (0, _qunit.test)('sub-sorting can be pinned in a specific direction', async function (assert) {
      this.set('recordSet', recordSet);
      this.set('firstNameSortDirection', 'none');
      this.set('lastNameSortDirection', 'none');
      this.set('lastNameSubSortOn', 'firstName');
      this.set('lastNameSubSortDirection', 'ascending');
      await renderComponent();
      assert.dom('p').hasText('No sorting has been applied');
      assert.dom('table tbody tr').exists({
        count: 15
      });
      assert.dom(tableCell(1, 1)).hasText('Herbert');
      assert.dom(tableCell(15, 2)).hasText('Halvorson');

      // Ascending first name
      await (0, _testHelpers.click)(tableHeader(2));
      assert.dom(tableCell(3, 1)).hasText('Homer');
      assert.dom(tableCell(3, 2)).hasText('Dietrich');
      assert.dom(tableCell(4, 1)).hasText('Karla');
      assert.dom(tableCell(4, 2)).hasText('Dietrich');
      assert.dom(tableCell(5, 1)).hasText('Stacy');
      assert.dom(tableCell(5, 2)).hasText('Dietrich');
      await (0, _testHelpers.click)(tableHeader(2));
      assert.dom(tableCell(11, 1)).hasText('Homer');
      assert.dom(tableCell(11, 2)).hasText('Dietrich');
      assert.dom(tableCell(12, 1)).hasText('Karla');
      assert.dom(tableCell(12, 2)).hasText('Dietrich');
      assert.dom(tableCell(13, 1)).hasText('Stacy');
      assert.dom(tableCell(13, 2)).hasText('Dietrich');
    });
  });
});
define("dummy/tests/integration/components/ui-stepflow-test", ["@ember/template-factory", "qunit", "ember-qunit", "@ember/test-helpers", "dummy/tests/helpers/define-component", "dummy/tests/helpers/lookup-component"], function (_templateFactory, _qunit, _emberQunit, _testHelpers, _defineComponent, _lookupComponent) {
  "use strict";

  0; //eaimeta@70e063a35619d71f0,"qunit",0,"ember-qunit",0,"@ember/test-helpers",0,"ember-cli-htmlbars",0,"dummy/tests/helpers/define-component",0,"dummy/tests/helpers/lookup-component"eaimeta@70e063a35619d71f
  (0, _qunit.module)('Integration | Component | ui-stepflow', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);
    hooks.beforeEach(function () {
      this.owner.register('component:test-component-a', (0, _defineComponent.default)('step-a', (0, _templateFactory.createTemplateFactory)(
      /*
        The First Step
      */
      {
        "id": "eLuvroT7",
        "block": "[[[1,\"The First Step\"]],[],false,[]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      })));
      this.owner.register('component:test-component-b', (0, _defineComponent.default)('step-b', (0, _templateFactory.createTemplateFactory)(
      /*
        The Penultimate Step
      */
      {
        "id": "kvzlmhXd",
        "block": "[[[1,\"The Penultimate Step\"]],[],false,[]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      })));
      this.owner.register('component:test-component-c', (0, _defineComponent.default)('step-c', (0, _templateFactory.createTemplateFactory)(
      /*
        The Final Step
      */
      {
        "id": "MR8DvtjX",
        "block": "[[[1,\"The Final Step\"]],[],false,[]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      })));
    });
    (0, _qunit.test)('it exposes additional properties to components that it renders', async function (assert) {
      const progressData = {
        content: 'Hello World'
      };
      this.set('data', progressData);
      this.set('steps', [{
        label: 'Step A',
        component: 'test-component-a'
      }]);

      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        <UiStepflow @id="stepflow" @steps={{this.steps}} @data={{this.data}} />
      */
      {
        "id": "Z3aYlHq8",
        "block": "[[[8,[39,0],null,[[\"@id\",\"@steps\",\"@data\"],[\"stepflow\",[30,0,[\"steps\"]],[30,0,[\"data\"]]]],null]],[],false,[\"ui-stepflow\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      const flow = (0, _lookupComponent.default)(this, 'stepflow');
      const stepA = (0, _lookupComponent.default)(this, 'step-a');
      assert.strictEqual(stepA.progressManager, flow.manager);
      assert.strictEqual(stepA.progressItem, flow.manager.getStepAt(0));
      assert.strictEqual(stepA.progressData, progressData);
    });
    (0, _qunit.test)('it displays a navigable set of components', async function (assert) {
      this.set('steps', [{
        label: 'Step A',
        component: 'test-component-a',
        indeterminate: true
      }, {
        label: 'Step B',
        component: 'test-component-b',
        indeterminate: true
      }, {
        label: 'Step C',
        title: 'Final Step',
        component: 'test-component-c',
        indeterminate: true
      }]);

      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        <UiStepflow @steps={{this.steps}} />
      */
      {
        "id": "K07szCSz",
        "block": "[[[8,[39,0],null,[[\"@steps\"],[[30,0,[\"steps\"]]]],null]],[],false,[\"ui-stepflow\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('ol.progress-chevrons li').exists({
        count: 3
      });
      assert.dom('ol.progress-chevrons li:first-child').hasClass('active');
      assert.dom('.panel header').hasText('Step A');
      assert.dom('.panel-body').hasText('The First Step');
      assert.dom('[data-test-id="next-btn"]').isEnabled();
      assert.dom('[data-test-id="next-btn"]').hasText('Next');
      await (0, _testHelpers.click)('[data-test-id="next-btn"]');
      assert.dom('ol.progress-chevrons li:nth-child(2)').hasClass('active');
      assert.dom('.panel header').hasText('Step B');
      assert.dom('.panel-body').hasText('The Penultimate Step');
      assert.dom('[data-test-id="previous-btn"]').isEnabled();
      assert.dom('[data-test-id="previous-btn"]').hasText('Previous');
      await (0, _testHelpers.click)('[data-test-id="next-btn"]');
      assert.dom('ol.progress-chevrons li:nth-child(3)').hasClass('active');
      assert.dom('.panel header').hasText('Final Step');
      assert.dom('.panel-body').hasText('The Final Step');
      assert.dom('[data-test-id="next-btn"]').doesNotExist();
      assert.dom('[data-test-id="complete-btn"]').isEnabled();
      assert.dom('[data-test-id="complete-btn"]').hasText('Submit');
    });
    (0, _qunit.test)('it displays a navigable button bar', async function (assert) {
      this.set('steps', [{
        label: 'Step A',
        component: 'test-component-a',
        indeterminate: true
      }, {
        label: 'Step B',
        component: 'test-component-b'
      }, {
        label: 'Step C',
        component: 'test-component-c'
      }]);
      this.set('handleComplete', () => assert.step('Complete'));

      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        <UiStepflow
                    @steps={{this.steps}}
                    @testId="stepflow"
                    @onCompleteStepFlow={{action this.handleComplete}}
            />
      */
      {
        "id": "jieRbcyo",
        "block": "[[[8,[39,0],null,[[\"@steps\",\"@testId\",\"@onCompleteStepFlow\"],[[30,0,[\"steps\"]],\"stepflow\",[28,[37,1],[[30,0],[30,0,[\"handleComplete\"]]],null]]],null]],[],false,[\"ui-stepflow\",\"action\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      const prevBtn = '[data-test-id="stepflow-navigation"] [data-test-id="previous-btn"]';
      const nextBtn = '[data-test-id="stepflow-navigation"] [data-test-id="next-btn"]';
      const saveBtn = '[data-test-id="stepflow-navigation"] [data-test-id="complete-btn"]';
      assert.dom(nextBtn).isVisible();
      assert.dom(nextBtn).isEnabled();
      assert.dom(prevBtn).doesNotExist();
      assert.dom(saveBtn).doesNotExist();
      await (0, _testHelpers.click)(nextBtn);
      assert.dom(nextBtn).isVisible();
      assert.dom(nextBtn).isDisabled();
      assert.dom(prevBtn).isVisible();
      assert.dom(prevBtn).isEnabled();
      assert.dom(saveBtn).doesNotExist();
      const stepB = (0, _lookupComponent.default)(this, 'step-b');
      stepB.progressItem.markComplete();
      await (0, _testHelpers.settled)();
      assert.dom(nextBtn).isEnabled();
      stepB.progressItem.markIncomplete();
      await (0, _testHelpers.settled)();
      assert.dom(nextBtn).isDisabled();
      stepB.progressItem.markComplete();
      await (0, _testHelpers.settled)();
      await (0, _testHelpers.click)(nextBtn);
      assert.dom(saveBtn).isVisible();
      assert.dom(saveBtn).isDisabled();
      assert.dom(prevBtn).isVisible();
      assert.dom(prevBtn).isEnabled();
      assert.dom(nextBtn).doesNotExist();
      await (0, _testHelpers.click)(prevBtn);
      assert.dom(nextBtn).isVisible();
      assert.dom(nextBtn).isEnabled();
      assert.dom(prevBtn).isVisible();
      assert.dom(prevBtn).isEnabled();
      assert.dom(saveBtn).doesNotExist();
      await (0, _testHelpers.click)(prevBtn);
      assert.dom(nextBtn).isVisible();
      assert.dom(nextBtn).isEnabled();
      assert.dom(prevBtn).doesNotExist();
      assert.dom(saveBtn).doesNotExist();
      await (0, _testHelpers.click)(nextBtn);
      await (0, _testHelpers.click)(nextBtn);
      const stepC = (0, _lookupComponent.default)(this, 'step-c');
      stepC.progressItem.markComplete();
      await (0, _testHelpers.settled)();
      assert.dom(saveBtn).isEnabled();
      await (0, _testHelpers.click)(saveBtn);
      assert.verifySteps(['Complete']);
    });
  });
});
define("dummy/tests/integration/components/ui-tabs-test", ["@ember/template-factory", "qunit", "ember-qunit", "@ember/test-helpers"], function (_templateFactory, _qunit, _emberQunit, _testHelpers) {
  "use strict";

  0; //eaimeta@70e063a35619d71f0,"qunit",0,"ember-qunit",0,"@ember/test-helpers",0,"htmlbars-inline-precompile"eaimeta@70e063a35619d71f
  (0, _qunit.module)('Integration | Component | ui-tabs', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);
    (0, _qunit.test)('it renders multiple tabs', async function (assert) {
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            <UiTabs data-test-tabs as |tabs|>
              <tabs.Option>Tab A</tabs.Option>
              <tabs.Option @text="Tab B" />
            </UiTabs>
          
      */
      {
        "id": "c93uNubR",
        "block": "[[[1,\"\\n      \"],[8,[39,0],[[24,\"data-test-tabs\",\"\"]],null,[[\"default\"],[[[[1,\"\\n        \"],[8,[30,1,[\"Option\"]],null,null,[[\"default\"],[[[[1,\"Tab A\"]],[]]]]],[1,\"\\n        \"],[8,[30,1,[\"Option\"]],null,[[\"@text\"],[\"Tab B\"]],null],[1,\"\\n      \"]],[1]]]]],[1,\"\\n    \"]],[\"tabs\"],false,[\"ui-tabs\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      function testTab(element, text) {
        assert.dom(element).isVisible();
        assert.dom(element).hasAttribute('data-test-id', 'tabs-option');
        assert.dom(element).hasAttribute('role', 'presentation');
        assert.dom('a', element).hasClass('btn-tab');
        assert.dom('a', element).hasAttribute('href', '#');
        assert.dom('a', element).hasAttribute('role', 'tab');
        assert.dom('a', element).hasText(text);
      }
      const el = (0, _testHelpers.find)('[data-test-tabs]') ?? undefined;
      assert.dom(el).hasClass('nav');
      assert.dom(el).hasClass('nav-tabs');
      assert.dom(el).hasAttribute('role', 'tablist');
      testTab(el?.querySelector('li:nth-child(1)') ?? undefined, 'Tab A');
      testTab(el?.querySelector('li:nth-child(2)') ?? undefined, 'Tab B');
    });
    (0, _qunit.test)('it transitions active state between tabs', async function (assert) {
      // Using only clicks
      this.set('handleTabChange', function (newTabValue) {
        assert.step(newTabValue);
      });

      // language=Handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            <UiTabs data-test-tabs @onChange={{action this.handleTabChange}} as |tabs|>
              <tabs.Option @value="A">Tab A</tabs.Option>
              <tabs.Option @value="B" @text="Tab B" />
            </UiTabs>
          
      */
      {
        "id": "JakI/uwq",
        "block": "[[[1,\"\\n      \"],[8,[39,0],[[24,\"data-test-tabs\",\"\"]],[[\"@onChange\"],[[28,[37,1],[[30,0],[30,0,[\"handleTabChange\"]]],null]]],[[\"default\"],[[[[1,\"\\n        \"],[8,[30,1,[\"Option\"]],null,[[\"@value\"],[\"A\"]],[[\"default\"],[[[[1,\"Tab A\"]],[]]]]],[1,\"\\n        \"],[8,[30,1,[\"Option\"]],null,[[\"@value\",\"@text\"],[\"B\",\"Tab B\"]],null],[1,\"\\n      \"]],[1]]]]],[1,\"\\n    \"]],[\"tabs\"],false,[\"ui-tabs\",\"action\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('li:nth-child(1) a').doesNotHaveClass('active');
      assert.dom('li:nth-child(2) a').doesNotHaveClass('active');

      // Change selected value to "B" by clicking on it
      await (0, _testHelpers.click)('li:nth-child(2) a');
      assert.dom('li:nth-child(1) a').doesNotHaveClass('active');
      assert.dom('li:nth-child(2) a').hasClass('active');

      // Change selected value to "A" by clicking on it
      await (0, _testHelpers.click)('li:nth-child(1) a');
      assert.dom('li:nth-child(1) a').hasClass('active');
      assert.dom('li:nth-child(2) a').doesNotHaveClass('active');
      assert.verifySteps(['B', 'A']);

      // Using both clicks and set()
      this.set('selected', 'A');

      // language=Handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            <UiTabs data-test-tabs @selected={{this.selected}} @onChange={{action this.handleTabChange}} as |tabs|>
              <tabs.Option @value="A">Tab A</tabs.Option>
              <tabs.Option @value="B" @text="Tab B" />
            </UiTabs>
          
      */
      {
        "id": "jwWNo7az",
        "block": "[[[1,\"\\n      \"],[8,[39,0],[[24,\"data-test-tabs\",\"\"]],[[\"@selected\",\"@onChange\"],[[30,0,[\"selected\"]],[28,[37,1],[[30,0],[30,0,[\"handleTabChange\"]]],null]]],[[\"default\"],[[[[1,\"\\n        \"],[8,[30,1,[\"Option\"]],null,[[\"@value\"],[\"A\"]],[[\"default\"],[[[[1,\"Tab A\"]],[]]]]],[1,\"\\n        \"],[8,[30,1,[\"Option\"]],null,[[\"@value\",\"@text\"],[\"B\",\"Tab B\"]],null],[1,\"\\n      \"]],[1]]]]],[1,\"\\n    \"]],[\"tabs\"],false,[\"ui-tabs\",\"action\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('li:nth-child(1) a').hasClass('active');
      assert.dom('li:nth-child(2) a').doesNotHaveClass('active');

      // Change selected value to "B" by clicking on it
      await (0, _testHelpers.click)('li:nth-child(2) a');

      // Ensure that multiple clicks on the same tab don't result in multiple onChange calls
      await (0, _testHelpers.click)('li:nth-child(2) a');
      assert.dom('li:nth-child(1) a').doesNotHaveClass('active');
      assert.dom('li:nth-child(2) a').hasClass('active');

      // Change selected value back to "A"
      this.set('selected', 'A');
      assert.dom('li:nth-child(1) a').hasClass('active');
      assert.dom('li:nth-child(2) a').doesNotHaveClass('active');

      // Ensure that multiple sets of the same value don't result in multiple onChange calls
      this.set('selected', 'A');
      assert.verifySteps(['B', 'A']);
    });
    (0, _qunit.test)('the active tab can be changed via keyboard', async function (assert) {
      // language=Handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            <UiTabs data-test-tabs @selected="A" as |tabs|>
              <tabs.Option @value="A">Tab A</tabs.Option>
              <tabs.Option @value="B">Tab B</tabs.Option>
              <tabs.Option @value="C">Tab C</tabs.Option>
            </UiTabs>
          
      */
      {
        "id": "XiAZTY4Q",
        "block": "[[[1,\"\\n      \"],[8,[39,0],[[24,\"data-test-tabs\",\"\"]],[[\"@selected\"],[\"A\"]],[[\"default\"],[[[[1,\"\\n        \"],[8,[30,1,[\"Option\"]],null,[[\"@value\"],[\"A\"]],[[\"default\"],[[[[1,\"Tab A\"]],[]]]]],[1,\"\\n        \"],[8,[30,1,[\"Option\"]],null,[[\"@value\"],[\"B\"]],[[\"default\"],[[[[1,\"Tab B\"]],[]]]]],[1,\"\\n        \"],[8,[30,1,[\"Option\"]],null,[[\"@value\"],[\"C\"]],[[\"default\"],[[[[1,\"Tab C\"]],[]]]]],[1,\"\\n      \"]],[1]]]]],[1,\"\\n    \"]],[\"tabs\"],false,[\"ui-tabs\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('li:nth-child(1) a').hasClass('active');
      await (0, _testHelpers.focus)('li:nth-child(1) a');
      await (0, _testHelpers.triggerKeyEvent)('[data-test-tabs]', 'keyup', 'ArrowRight');
      assert.dom('li:nth-child(2) a').isFocused();
      await (0, _testHelpers.triggerKeyEvent)('[data-test-tabs]', 'keyup', 'ArrowRight');
      assert.dom('li:nth-child(3) a').isFocused();
      await (0, _testHelpers.click)('li:nth-child(3) a');
      assert.dom('li:nth-child(3) a').hasClass('active');
    });
  });
});
define("dummy/tests/integration/components/ui-tooltip-attachment-test", ["@ember/template-factory", "qunit", "ember-qunit", "@ember/test-helpers"], function (_templateFactory, _qunit, _emberQunit, _testHelpers) {
  "use strict";

  0; //eaimeta@70e063a35619d71f0,"qunit",0,"ember-qunit",0,"@ember/test-helpers",0,"ember-cli-htmlbars"eaimeta@70e063a35619d71f
  (0, _qunit.module)('Integration | Component | ui-tooltip-attachment', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);
    (0, _qunit.test)('it attaches event listeners to its parent element', async function (assert) {
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            <button>
              Foo <UiTooltipAttachment @testId="tip">Hello World</UiTooltipAttachment>
            </button>
          
      */
      {
        "id": "svdB9Fgv",
        "block": "[[[1,\"\\n      \"],[10,\"button\"],[12],[1,\"\\n        Foo \"],[8,[39,0],null,[[\"@testId\"],[\"tip\"]],[[\"default\"],[[[[1,\"Hello World\"]],[]]]]],[1,\"\\n      \"],[13],[1,\"\\n    \"]],[],false,[\"ui-tooltip-attachment\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      const overlay = (0, _testHelpers.find)('.tooltip[data-test-id="tip"]');
      assert.dom('button').hasAttribute('aria-labelledby', overlay.id);
      assert.dom('.tooltip[data-test-id="tip"]').isNotVisible();
      await (0, _testHelpers.focus)('button');
      assert.dom('.tooltip[data-test-id="tip"]').isVisible();
      assert.dom('.tooltip[data-test-id="tip"]').hasText('Hello World');
      await (0, _testHelpers.blur)('button');
      assert.dom('.tooltip[data-test-id="tip"]').isNotVisible();
    });
  });
});
define("dummy/tests/integration/components/ui-tooltip-test", ["@ember/template-factory", "qunit", "ember-qunit", "@ember/test-helpers"], function (_templateFactory, _qunit, _emberQunit, _testHelpers) {
  "use strict";

  0; //eaimeta@70e063a35619d71f0,"qunit",0,"ember-qunit",0,"@ember/test-helpers",0,"ember-cli-htmlbars"eaimeta@70e063a35619d71f
  (0, _qunit.module)('Integration | Component | ui-tooltip', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);
    (0, _qunit.test)('it is shown on mouseenter, and hidden on mouseleave', async function (assert) {
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            <div style="margin-top: 50px; text-align: center;">
              <UiTooltip @testId="tip">Hello World</UiTooltip>
            </div>
          
      */
      {
        "id": "sNX/CM+l",
        "block": "[[[1,\"\\n      \"],[10,0],[14,5,\"margin-top: 50px; text-align: center;\"],[12],[1,\"\\n        \"],[8,[39,0],null,[[\"@testId\"],[\"tip\"]],[[\"default\"],[[[[1,\"Hello World\"]],[]]]]],[1,\"\\n      \"],[13],[1,\"\\n    \"]],[],false,[\"ui-tooltip\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      const trigger = (0, _testHelpers.find)('[data-test-id="tip"]:not(.tooltip)');
      const overlay = (0, _testHelpers.find)('.tooltip[data-test-id="tip"]');
      assert.dom(trigger).isVisible();
      assert.dom(trigger).hasClass('fa-question-circle');
      assert.dom(trigger).hasAttribute('aria-labelledby', overlay.id);
      assert.dom(overlay).isNotVisible();
      await (0, _testHelpers.triggerEvent)(trigger, 'mouseenter');
      assert.dom(overlay).isVisible();
      assert.dom(overlay).hasText('Hello World');
      await (0, _testHelpers.triggerEvent)(trigger, 'mouseleave');
      assert.dom(overlay).isNotVisible();
    });
    (0, _qunit.test)('it accepts onShow, onShown, onHide, and onHidden actions', async function (assert) {
      this.set('actionCallback', function (name) {
        assert.step(name);
      });

      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            <UiTooltip
              @testId="tip"
              @onShow={{action this.actionCallback "onShow"}}
              @onShown={{action this.actionCallback "onShown"}}
              @onHide={{action this.actionCallback "onHide"}}
              @onHidden={{action this.actionCallback "onHidden"}}
            >
              Hello World
            </UiTooltip>
          
      */
      {
        "id": "UTVb6asx",
        "block": "[[[1,\"\\n      \"],[8,[39,0],null,[[\"@testId\",\"@onShow\",\"@onShown\",\"@onHide\",\"@onHidden\"],[\"tip\",[28,[37,1],[[30,0],[30,0,[\"actionCallback\"]],\"onShow\"],null],[28,[37,1],[[30,0],[30,0,[\"actionCallback\"]],\"onShown\"],null],[28,[37,1],[[30,0],[30,0,[\"actionCallback\"]],\"onHide\"],null],[28,[37,1],[[30,0],[30,0,[\"actionCallback\"]],\"onHidden\"],null]]],[[\"default\"],[[[[1,\"\\n        Hello World\\n      \"]],[]]]]],[1,\"\\n    \"]],[],false,[\"ui-tooltip\",\"action\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      await (0, _testHelpers.triggerEvent)('span[data-test-id="tip"]', 'mouseenter');
      await (0, _testHelpers.triggerEvent)('span[data-test-id="tip"]', 'mouseleave');
      assert.verifySteps(['onShow', 'onShown', 'onHide', 'onHidden']);
    });
    (0, _qunit.test)('it allows its maximum width to be customized', async function (assert) {
      this.set('maxWidth', undefined);

      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            <UiTooltip @testId="tip" @maxWidth={{this.maxWidth}}>
              Hello World
            </UiTooltip>
          
      */
      {
        "id": "+1U0p+QF",
        "block": "[[[1,\"\\n      \"],[8,[39,0],null,[[\"@testId\",\"@maxWidth\"],[\"tip\",[30,0,[\"maxWidth\"]]]],[[\"default\"],[[[[1,\"\\n        Hello World\\n      \"]],[]]]]],[1,\"\\n    \"]],[],false,[\"ui-tooltip\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('.tooltip[data-test-id="tip"] .tooltip-inner').doesNotHaveAttribute('style');
      this.set('maxWidth', 100);
      assert.dom('.tooltip[data-test-id="tip"] .tooltip-inner').hasAttribute('style', 'max-width: 100px;');
      this.set('maxWidth', '150');
      assert.dom('.tooltip[data-test-id="tip"] .tooltip-inner').hasAttribute('style', 'max-width: 150px;');
      this.set('maxWidth', '200px');
      assert.dom('.tooltip[data-test-id="tip"] .tooltip-inner').hasAttribute('style', 'max-width: 200px;');
    });
  });
});
define("dummy/tests/integration/helpers/in-array-test", ["@ember/template-factory", "qunit", "ember-qunit", "@ember/test-helpers", "@ember/array"], function (_templateFactory, _qunit, _emberQunit, _testHelpers, _array) {
  "use strict";

  0; //eaimeta@70e063a35619d71f0,"qunit",0,"ember-qunit",0,"@ember/test-helpers",0,"ember-cli-htmlbars",0,"@ember/array"eaimeta@70e063a35619d71f
  (0, _qunit.module)('Integration | Helpers | in-array', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);
    (0, _qunit.test)('it determines whether a value is within an array', async function (assert) {
      this.set('targetArray', undefined);
      this.set('searchValue', undefined);

      // language=handlebars
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            {{#if (in-array this.targetArray this.searchValue)}}
                <p>In Array</p>
            {{else}}
                <p>Not In Array</p>
            {{/if}}
          
      */
      {
        "id": "n318W4z1",
        "block": "[[[1,\"\\n\"],[41,[28,[37,1],[[30,0,[\"targetArray\"]],[30,0,[\"searchValue\"]]],null],[[[1,\"          \"],[10,2],[12],[1,\"In Array\"],[13],[1,\"\\n\"]],[]],[[[1,\"          \"],[10,2],[12],[1,\"Not In Array\"],[13],[1,\"\\n\"]],[]]],[1,\"    \"]],[],false,[\"if\",\"in-array\"]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.dom('p').hasText('Not In Array');
      const targetArray = (0, _array.A)([1, 2, 3]);
      this.set('targetArray', targetArray);
      assert.dom('p').hasText('Not In Array');
      this.set('searchValue', 3);
      assert.dom('p').hasText('In Array');
      this.set('searchValue', 4);
      assert.dom('p').hasText('Not In Array');
      targetArray.pushObject(4);
      await (0, _testHelpers.settled)();
      assert.dom('p').hasText('In Array');
      targetArray.removeObject(2);
      await (0, _testHelpers.settled)();
      assert.dom('p').hasText('In Array');
      targetArray.removeObject(4);
      await (0, _testHelpers.settled)();
      assert.dom('p').hasText('Not In Array');
    });
  });
});
define("dummy/tests/integration/helpers/perform-unlinked-test", ["qunit", "ember-qunit", "@ember/test-helpers", "@nsf-open/ember-ui-foundation/helpers/perform-unlinked", "ember-concurrency", "ember-concurrency-ts"], function (_qunit, _emberQunit, _testHelpers, _performUnlinked, _emberConcurrency, _emberConcurrencyTs) {
  "use strict";

  0; //eaimeta@70e063a35619d71f0,"qunit",0,"ember-qunit",0,"@ember/test-helpers",0,"@nsf-open/ember-ui-foundation/helpers/perform-unlinked",0,"ember-concurrency",0,"ember-concurrency-ts"eaimeta@70e063a35619d71f
  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }
  (0, _qunit.module)('Integration | Helpers | perform-unlinked', function (hooks) {
    var _class;
    (0, _emberQunit.setupTest)(hooks);
    let TaskSandbox = (_class = class TaskSandbox {
      *parentTask(assert) {
        yield (0, _performUnlinked.performUnlinkedHelper)([(0, _emberConcurrencyTs.taskFor)(this.childTask), assert])();
        yield (0, _emberConcurrencyTs.taskFor)(this.childTask).perform(assert);
      }
      *childTask(assert) {
        yield (0, _emberConcurrency.timeout)(20);
        assert.step('task');
      }
    }, (_applyDecoratedDescriptor(_class.prototype, "parentTask", [_emberConcurrency.task], Object.getOwnPropertyDescriptor(_class.prototype, "parentTask"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "childTask", [_emberConcurrency.task], Object.getOwnPropertyDescriptor(_class.prototype, "childTask"), _class.prototype)), _class);
    (0, _qunit.test)('it creates a closure that runs a concurrency task that not linked to its parent', async function (assert) {
      assert.expect(2);
      const sandbox = new TaskSandbox();

      // Start parentTask but don't await its completion.
      const task = (0, _emberConcurrencyTs.taskFor)(sandbox.parentTask).perform(assert);

      // Wait until we are well into the execution of childTask, but before step() is asserted.
      await (0, _emberConcurrency.timeout)(10);

      // Cancel parentTask. The running childTask instance should continue on.
      await task.cancel();

      // Wait for everything to finish.
      await (0, _testHelpers.settled)();
      assert.verifySteps(['task']);
    });
    (0, _qunit.test)('it only accepts concurrency tasks', function (assert) {
      assert.throws(function () {
        // @ts-expect-error - purposefully passing in the wrong type of argument for testing
        (0, _performUnlinked.performUnlinkedHelper)(['foo'])();
      });
    });
  });
});
define("dummy/tests/test-helper", ["dummy/app", "dummy/config/environment", "qunit", "@ember/test-helpers", "qunit-dom", "ember-qunit"], function (_app, _environment, QUnit, _testHelpers, _qunitDom, _emberQunit) {
  "use strict";

  0; //eaimeta@70e063a35619d71f0,"dummy/app",0,"dummy/config/environment",0,"qunit",0,"@ember/test-helpers",0,"qunit-dom",0,"ember-qunit"eaimeta@70e063a35619d71f
  (0, _testHelpers.setApplication)(_app.default.create(_environment.default.APP));
  (0, _qunitDom.setup)(QUnit.assert);
  (0, _emberQunit.start)();
});
define("dummy/tests/unit/aria-attributes-test", ["qunit", "@nsf-open/ember-ui-foundation/utils/aria"], function (_qunit, _aria) {
  "use strict";

  0; //eaimeta@70e063a35619d71f0,"qunit",0,"@nsf-open/ember-ui-foundation/utils/aria"eaimeta@70e063a35619d71f
  (0, _qunit.module)('Unit | Util | ARIA Attributes', function () {
    (0, _qunit.test)('it can add, retrieve the value of, and remove attributes from an HTMLElement', function (assert) {
      const element = document.createElement('div');
      assert.deepEqual((0, _aria.getAriaAttributeValues)(element, 'aria-describedby'), []);
      (0, _aria.addAriaAttribute)(element, 'aria-describedby', 'id-1');
      assert.deepEqual((0, _aria.getAriaAttributeValues)(element, 'aria-describedby'), ['id-1']);
      (0, _aria.addAriaAttribute)(element, 'describedby', 'id-2');
      assert.deepEqual((0, _aria.getAriaAttributeValues)(element, 'describedby'), ['id-1', 'id-2']);
      (0, _aria.removeAriaAttribute)(element, 'aria-describedby', 'id-1');
      assert.deepEqual((0, _aria.getAriaAttributeValues)(element, 'describedby'), ['id-2']);
      (0, _aria.removeAriaAttribute)(element, 'describedby', 'id-2');
      assert.deepEqual((0, _aria.getAriaAttributeValues)(element, 'describedby'), []);
    });
  });
});
define("dummy/tests/unit/computed-macros-test", ["qunit", "@ember/object", "@nsf-open/ember-ui-foundation/utils"], function (_qunit, _object, _utils) {
  "use strict";

  var _dec, _class, _descriptor;
  0; //eaimeta@70e063a35619d71f0,"qunit",0,"@ember/object",0,"@nsf-open/ember-ui-foundation/utils"eaimeta@70e063a35619d71f
  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }
  function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
  function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
  function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }
  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }
  let TestClass = (_dec = (0, _utils.listenTo)('sourceValue', 'A Default Value'), (_class = class TestClass {
    constructor() {
      _initializerDefineProperty(this, "listenerValue", _descriptor, this);
      _defineProperty(this, "sourceValue", 'Hello World');
    }
  }, (_descriptor = _applyDecoratedDescriptor(_class.prototype, "listenerValue", [_dec], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  })), _class));
  (0, _qunit.module)('Unit | Util | computed-macros', function () {
    (0, _qunit.test)('@listenTo macro', function (assert) {
      const testClass = new TestClass();
      assert.strictEqual(testClass.sourceValue, 'Hello World', 'source value is correct');
      assert.strictEqual(testClass.listenerValue, 'Hello World', 'listener value is correct');
      (0, _object.set)(testClass, 'sourceValue', undefined);
      assert.strictEqual(testClass.listenerValue, 'A Default Value', 'listener value expresses its default when source is undefined');
      (0, _object.set)(testClass, 'sourceValue', 'FooBar');
      assert.strictEqual(testClass.sourceValue, 'FooBar', 'source value is correct');
      assert.strictEqual(testClass.listenerValue, 'FooBar', 'listener value is correct after source change');
      (0, _object.set)(testClass, 'listenerValue', 'Baz');
      assert.strictEqual(testClass.sourceValue, 'FooBar', 'source value is correct after listener change');
      assert.strictEqual(testClass.listenerValue, 'Baz', 'listener value is correct after deviating from source');
      (0, _object.set)(testClass, 'sourceValue', '1001');
      assert.strictEqual(testClass.sourceValue, '1001', 'source value is correct');
      assert.strictEqual(testClass.listenerValue, '1001', 'listener value snaps back to source when source is updated');
    });
  });
});
define("dummy/tests/unit/extract-error-messages-test", ["qunit", "@nsf-open/ember-ui-foundation/utils", "@ember/template"], function (_qunit, _utils, _template) {
  "use strict";

  0; //eaimeta@70e063a35619d71f0,"qunit",0,"@nsf-open/ember-ui-foundation/utils",0,"@ember/template"eaimeta@70e063a35619d71f
  (0, _qunit.module)('Unit | Util | extract-error-messages', function () {
    (0, _qunit.test)('it reduces a variety of input arguments to a string array', function (assert) {
      assert.strictEqual((0, _utils.extractErrorMessages)(undefined), undefined, 'undefined returns undefined');
      assert.strictEqual((0, _utils.extractErrorMessages)(null), undefined, 'null returns undefined');
      assert.strictEqual((0, _utils.extractErrorMessages)([]), undefined, 'empty array returns undefined');
      assert.deepEqual((0, _utils.extractErrorMessages)('Hello World'), ['Hello World'], 'string returns string array');
      assert.deepEqual((0, _utils.extractErrorMessages)(['Hello', 'World']), ['Hello', 'World'], 'string array returns string array');
      assert.deepEqual((0, _utils.extractErrorMessages)(new Error('Hello World')), ['Hello World'], 'Error instance returns string array');
      assert.deepEqual((0, _utils.extractErrorMessages)({
        errors: {
          foo: 'bar'
        }
      }), undefined, 'object with errors prop that is not an array or string returns undefined');
      assert.deepEqual((0, _utils.extractErrorMessages)({
        errors: []
      }), undefined, 'object with empty errors array returns undefined');
      assert.deepEqual((0, _utils.extractErrorMessages)({
        errors: ['Hello', 'World']
      }), ['Hello', 'World'], 'object with errors array returns string array');
      assert.deepEqual((0, _utils.extractErrorMessages)({
        error: 'Hello World'
      }), ['Hello World'], 'object with error string returns string array');
      const safeTestString = (0, _template.htmlSafe)('Hello World');
      assert.true((0, _template.isHTMLSafe)((0, _utils.extractErrorMessages)(safeTestString)?.[0]), 'htmlSafe string returns htmlSafe string array');
      assert.true((0, _template.isHTMLSafe)((0, _utils.extractErrorMessages)([safeTestString])?.[0]), 'htmlSafe string array returns htmlSafe string array');
      assert.true((0, _template.isHTMLSafe)((0, _utils.extractErrorMessages)({
        errors: [safeTestString]
      })?.[0]), 'object with errors htmlSafe string array returns htmlSafe string array');
      assert.true((0, _template.isHTMLSafe)((0, _utils.extractErrorMessages)({
        error: safeTestString
      })?.[0]), 'object with error htmlSafe string returns htmlSafe string array');
    });
  });
});
define("dummy/tests/unit/font-awesome-test", ["qunit", "@nsf-open/ember-ui-foundation/utils"], function (_qunit, _utils) {
  "use strict";

  0; //eaimeta@70e063a35619d71f0,"qunit",0,"@nsf-open/ember-ui-foundation/utils"eaimeta@70e063a35619d71f
  (0, _qunit.module)('Unit | Util | font-awesome', function () {
    (0, _qunit.test)('it applies the "fa-" prefix to one or more strings as required', function (assert) {
      assert.strictEqual((0, _utils.buildFaClassNameString)('fa-foo'), 'fa fa-foo');
      assert.strictEqual((0, _utils.buildFaClassNameString)('foo'), 'fa fa-foo');
      assert.strictEqual((0, _utils.buildFaClassNameString)('fa-foo bar'), 'fa fa-foo fa-bar');
      assert.strictEqual((0, _utils.buildFaClassNameString)('fa-foo fa-bar'), 'fa fa-foo fa-bar');
      assert.strictEqual((0, _utils.buildFaClassNameString)('fa-foo', 'bar'), 'fa fa-foo fa-bar');
      assert.strictEqual((0, _utils.buildFaClassNameString)('fa-foo', 'fa-bar'), 'fa fa-foo fa-bar');
      assert.strictEqual((0, _utils.buildFaClassNameString)(['foo', 'bar']), 'fa fa-foo fa-bar');
      assert.strictEqual((0, _utils.buildFaClassNameString)(['fa-foo', 'bar']), 'fa fa-foo fa-bar');
      assert.strictEqual((0, _utils.buildFaClassNameString)(['fa-foo', 'fa-bar']), 'fa fa-foo fa-bar');
      assert.strictEqual((0, _utils.buildFaClassNameString)(['foo', '', 'bar']), 'fa fa-foo fa-bar');

      // @ts-expect-error - testing for invalid arguments
      assert.strictEqual((0, _utils.buildFaClassNameString)(['foo', undefined, 'bar']), 'fa fa-foo fa-bar');
    });
  });
});
define("dummy/tests/unit/key-navigator-test", ["@ember/template-factory", "qunit", "ember-qunit", "@ember/test-helpers", "@nsf-open/ember-ui-foundation/utils", "@nsf-open/ember-ui-foundation/constants", "@nsf-open/ember-ui-foundation/utils/key-navigator"], function (_templateFactory, _qunit, _emberQunit, _testHelpers, _utils, _constants, _keyNavigator) {
  "use strict";

  0; //eaimeta@70e063a35619d71f0,"qunit",0,"ember-qunit",0,"@ember/test-helpers",0,"ember-cli-htmlbars",0,"@nsf-open/ember-ui-foundation/utils",0,"@nsf-open/ember-ui-foundation/constants",0,"@nsf-open/ember-ui-foundation/utils/key-navigator"eaimeta@70e063a35619d71f
  (0, _qunit.module)('Unit | Util | key-navigator', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);
    (0, _qunit.test)('it will determine the previous/next element in a sequence', async function (assert) {
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            <ul id="list">
              <li><button id="btn-a">Item A</button></li>
              <li><button id="btn-b">Item B</button></li>
              <li><button id="btn-c">Item C</button></li>
              <li><button id="btn-d">Item D</button></li>
            </ul>
          
      */
      {
        "id": "mg7cnge9",
        "block": "[[[1,\"\\n      \"],[10,\"ul\"],[14,1,\"list\"],[12],[1,\"\\n        \"],[10,\"li\"],[12],[10,\"button\"],[14,1,\"btn-a\"],[12],[1,\"Item A\"],[13],[13],[1,\"\\n        \"],[10,\"li\"],[12],[10,\"button\"],[14,1,\"btn-b\"],[12],[1,\"Item B\"],[13],[13],[1,\"\\n        \"],[10,\"li\"],[12],[10,\"button\"],[14,1,\"btn-c\"],[12],[1,\"Item C\"],[13],[13],[1,\"\\n        \"],[10,\"li\"],[12],[10,\"button\"],[14,1,\"btn-d\"],[12],[1,\"Item D\"],[13],[13],[1,\"\\n      \"],[13],[1,\"\\n    \"]],[],false,[]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.strictEqual(undefined, (0, _utils.keyNavigator)(undefined, '#list button', _constants.KeyCodes.Escape), 'unrecognized keycodes are ignored');
      assert.strictEqual(undefined, (0, _utils.keyNavigator)(undefined, '#foo-bar .baz', _constants.KeyCodes.ArrowDown), 'with no selections possible, undefined is returned');
      assert.strictEqual((0, _testHelpers.find)('#btn-a'), (0, _utils.keyNavigator)(undefined, (0, _testHelpers.findAll)('#list button'), _constants.KeyCodes.ArrowDown), 'It accepts an array of HTMLElements');
      assert.strictEqual((0, _testHelpers.find)('#btn-a'), (0, _utils.keyNavigator)(undefined, '#list button', _constants.KeyCodes.ArrowDown), '#btn-a chosen with ArrowDown');
      assert.strictEqual((0, _testHelpers.find)('#btn-a'), (0, _utils.keyNavigator)(undefined, '#list button', _constants.KeyCodes.ArrowRight), '#btn-a chosen with ArrowRight');
      assert.strictEqual((0, _testHelpers.find)('#btn-d'), (0, _utils.keyNavigator)(undefined, '#list button', _constants.KeyCodes.ArrowUp), '#btn-d chosen with ArrowUp');
      assert.strictEqual((0, _testHelpers.find)('#btn-d'), (0, _utils.keyNavigator)(undefined, '#list button', _constants.KeyCodes.ArrowLeft), '#btn-d chosen with ArrowLeft');
      assert.strictEqual((0, _testHelpers.find)('#btn-c'), (0, _utils.keyNavigator)((0, _testHelpers.find)('#btn-b'), '#list button', _constants.KeyCodes.ArrowDown), '#btn-c chosen with ArrowDown (#btn-b was previous)');
      assert.strictEqual((0, _testHelpers.find)('#btn-c'), (0, _utils.keyNavigator)((0, _testHelpers.find)('#btn-b'), '#list button', _constants.KeyCodes.ArrowRight), '#btn-c chosen with ArrowRight (#btn-b was previous)');
      assert.strictEqual((0, _testHelpers.find)('#btn-b'), (0, _utils.keyNavigator)((0, _testHelpers.find)('#btn-c'), '#list button', _constants.KeyCodes.ArrowUp), '#btn-b chosen with ArrowUp (#btn-c was previous)');
      assert.strictEqual((0, _testHelpers.find)('#btn-b'), (0, _utils.keyNavigator)((0, _testHelpers.find)('#btn-c'), '#list button', _constants.KeyCodes.ArrowLeft), '#btn-b chosen with ArrowLeft (#btn-c was previous)');
      assert.strictEqual((0, _testHelpers.find)('#btn-a'), (0, _utils.keyNavigator)((0, _testHelpers.find)('#btn-c'), '#list button', _constants.KeyCodes.Home), '#btn-c chosen with Home');
      assert.strictEqual((0, _testHelpers.find)('#btn-d'), (0, _utils.keyNavigator)((0, _testHelpers.find)('#btn-b'), '#list button', _constants.KeyCodes.End), '#btn-d chosen with End');
      assert.strictEqual((0, _testHelpers.find)('#btn-d'), (0, _utils.keyNavigator)((0, _testHelpers.find)('#btn-a'), '#list button', _constants.KeyCodes.ArrowUp), '#btn-d chosen with ArrowUp (#btn-a was previous, wrapAround enabled)');
      assert.strictEqual((0, _testHelpers.find)('#btn-a'), (0, _utils.keyNavigator)((0, _testHelpers.find)('#btn-d'), '#list button', _constants.KeyCodes.ArrowDown), '#btn-a chosen with ArrowDown (#btn-d was previous, wrapAround enabled)');
      assert.strictEqual((0, _testHelpers.find)('#btn-a'), (0, _utils.keyNavigator)((0, _testHelpers.find)('#btn-a'), '#list button', _constants.KeyCodes.ArrowUp, {
        wrapAround: false
      }), '#btn-d chosen with ArrowUp (#btn-a was previous, wrapAround disabled)');
      assert.strictEqual((0, _testHelpers.find)('#btn-d'), (0, _utils.keyNavigator)((0, _testHelpers.find)('#btn-d'), '#list button', _constants.KeyCodes.ArrowDown, {
        wrapAround: false
      }), '#btn-a chosen with ArrowDown (#btn-d was previous, wrapAround disabled)');
    });
    (0, _qunit.test)('it can determine the "current" element from a variety of possible inputs', async function (assert) {
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            <ul id="list">
              <li><button id="btn-a">Item A</button></li>
              <li><button id="btn-b">Item B</button></li>
              <li><button id="btn-c">Item C</button></li>
              <li><button id="btn-d">Item D</button></li>
            </ul>
          
      */
      {
        "id": "mg7cnge9",
        "block": "[[[1,\"\\n      \"],[10,\"ul\"],[14,1,\"list\"],[12],[1,\"\\n        \"],[10,\"li\"],[12],[10,\"button\"],[14,1,\"btn-a\"],[12],[1,\"Item A\"],[13],[13],[1,\"\\n        \"],[10,\"li\"],[12],[10,\"button\"],[14,1,\"btn-b\"],[12],[1,\"Item B\"],[13],[13],[1,\"\\n        \"],[10,\"li\"],[12],[10,\"button\"],[14,1,\"btn-c\"],[12],[1,\"Item C\"],[13],[13],[1,\"\\n        \"],[10,\"li\"],[12],[10,\"button\"],[14,1,\"btn-d\"],[12],[1,\"Item D\"],[13],[13],[1,\"\\n      \"],[13],[1,\"\\n    \"]],[],false,[]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      assert.strictEqual(undefined, (0, _keyNavigator.getCurrentElement)(undefined, []), 'undefined returns undefined');
      assert.strictEqual(undefined, (0, _keyNavigator.getCurrentElement)(null, []), 'null returns undefined');

      // @ts-expect-error - passing incorrect type on purpose
      assert.strictEqual(undefined, (0, _keyNavigator.getCurrentElement)(10, []), 'unrecognized type returns undefined');
      assert.strictEqual((0, _testHelpers.find)('#btn-b'), (0, _keyNavigator.getCurrentElement)('#btn-b', []), 'string selector returns HTMLElement');
      assert.strictEqual(undefined, (0, _keyNavigator.getCurrentElement)('#btn-e', []), 'string selector returns undefined');
      assert.strictEqual((0, _testHelpers.find)('#btn-c'), (0, _keyNavigator.getCurrentElement)((0, _testHelpers.find)('#btn-c'), []), 'HTMLElement returns HTMLElement');
      assert.strictEqual((0, _testHelpers.find)('#btn-d'), (0, _keyNavigator.getCurrentElement)(elements => elements.pop(), (0, _testHelpers.findAll)('#list button')), 'function returns HTMLElement');
    });
    (0, _qunit.test)('its default filter correctly removes objects it thinks should not be selectable', function (assert) {
      assert.false(
      // @ts-expect-error - passing incorrect type on purpose
      (0, _keyNavigator.shouldInclude)(null), 'things that are not HTMLElement instances are not included');
      const elementA = document.createElement('div');
      elementA.ariaDisabled = 'true';
      assert.false((0, _keyNavigator.shouldInclude)(elementA), 'elements with ariaDisabled="true" are not included');
      const elementB = document.createElement('div');
      elementB.ariaHidden = 'true';
      assert.false((0, _keyNavigator.shouldInclude)(elementB), 'elements with ariaHidden="true" are not included');
      const elementC = document.createElement('div');
      elementC.hidden = true;
      assert.false((0, _keyNavigator.shouldInclude)(elementC), 'elements with hidden=true are not included');
      const elementD = document.createElement('div');
      elementD.classList.add('disabled');
      assert.false((0, _keyNavigator.shouldInclude)(elementD), 'elements with a class name "disabled" are not included');
      const elementE = document.createElement('div');
      elementE.ariaDisabled = 'false';
      elementE.ariaHidden = 'false';
      elementE.hidden = false;
      elementE.classList.add('foo');
      assert.true((0, _keyNavigator.shouldInclude)(elementE), 'other elements are included');
      const elementF = document.createElement('div');
      assert.true((0, _keyNavigator.shouldInclude)(elementF), 'other elements are included');
    });
  });
});
define("dummy/tests/unit/kinda-looks-plural-test", ["qunit", "@nsf-open/ember-ui-foundation/utils"], function (_qunit, _utils) {
  "use strict";

  0; //eaimeta@70e063a35619d71f0,"qunit",0,"@nsf-open/ember-ui-foundation/utils"eaimeta@70e063a35619d71f
  (0, _qunit.module)('Unit | Util | kindaLooksPlural', function () {
    (0, _qunit.test)('it identifies things that might need to be pluralized in the english language', function (assert) {
      assert.true((0, _utils.kindaLooksPlural)(0), 'The number zero is plural');
      assert.false((0, _utils.kindaLooksPlural)(1), 'The number one is singular');
      assert.true((0, _utils.kindaLooksPlural)(2), 'The number two is plural');
      assert.true((0, _utils.kindaLooksPlural)('0'), 'The string zero is plural');
      assert.false((0, _utils.kindaLooksPlural)('1'), 'The string one is singular');
      assert.true((0, _utils.kindaLooksPlural)('2'), 'The string two is plural');
      assert.false((0, _utils.kindaLooksPlural)('dog'), 'The string "dog" is singular');
      assert.true((0, _utils.kindaLooksPlural)('dogs'), 'The string "dogs" is already plural');
      assert.false((0, _utils.kindaLooksPlural)('compass'), 'The string "compass" is singular');
      assert.false((0, _utils.kindaLooksPlural)(null), 'The null value is not plural (this is the fallthrough case for anything that is not a string or number)');
    });
  });
});
define("dummy/tests/unit/message-manager-test", ["qunit", "ember-qunit", "@nsf-open/ember-ui-foundation/lib/MessageManager", "@nsf-open/ember-ui-foundation/constants"], function (_qunit, _emberQunit, _MessageManager, _constants) {
  "use strict";

  var _dec, _dec2, _class, _descriptor, _descriptor2;
  0; //eaimeta@70e063a35619d71f0,"qunit",0,"ember-qunit",0,"@nsf-open/ember-ui-foundation/lib/MessageManager",0,"@nsf-open/ember-ui-foundation/constants"eaimeta@70e063a35619d71f
  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }
  function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
  function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
  function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }
  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }
  let TestClass = (_dec = (0, _MessageManager.messageManager)(), _dec2 = (0, _MessageManager.messageManager)({
    enableScrollTo: true
  }), (_class = class TestClass {
    constructor() {
      _initializerDefineProperty(this, "decoratorBuiltManager", _descriptor, this);
      _initializerDefineProperty(this, "configuredDecoratorBuiltManager", _descriptor2, this);
    }
  }, (_descriptor = _applyDecoratedDescriptor(_class.prototype, "decoratorBuiltManager", [_dec], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, "configuredDecoratorBuiltManager", [_dec2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  })), _class));
  (0, _qunit.module)('Unit | Lib | MessageManager', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);
    (0, _qunit.test)('@messageManager decorator', function (assert) {
      const testInstance = new TestClass();
      assert.true(testInstance.decoratorBuiltManager instanceof _MessageManager.default);
      assert.false(testInstance.decoratorBuiltManager.enableScrollTo);
      assert.true(testInstance.configuredDecoratorBuiltManager instanceof _MessageManager.default);
      assert.true(testInstance.configuredDecoratorBuiltManager.enableScrollTo);
    });
    (0, _qunit.test)('a single message can be added', async function (assert) {
      const manager = new _MessageManager.default();
      let messageId = manager.addMessage(_constants.AlertLevel.INFO, '');
      assert.false(messageId, '');
      messageId = manager.addMessage(_constants.AlertLevel.INFO, 'Message A');
      assert.strictEqual(typeof messageId, 'string');
      const group = manager.getGroup(_constants.AlertLevel.INFO);
      const messageText = group ? [...group.messagesText.values()] : [];
      assert.strictEqual(group?.name, _constants.AlertLevel.INFO);
      assert.strictEqual(group?.messages.length, 1);
      assert.deepEqual(messageText, ['Message A']);
      assert.deepEqual(group?.messages?.[0], {
        id: messageId,
        message: 'Message A',
        escapeHTML: true,
        details: null,
        detailsOpen: false
      });
      assert.true(manager.hasMessage('Message A', _constants.AlertLevel.INFO));
      assert.true(manager.hasMessage('Message A'));
    });
    (0, _qunit.test)('adding a single message supports configurable options', function (assert) {
      const manager = new _MessageManager.default();
      manager.enableDetails = true;
      const messageId = manager.addMessage(_constants.AlertLevel.INFO, 'Message A', {
        escape: false,
        details: 'More Content'
      });
      assert.deepEqual(manager.getGroup(_constants.AlertLevel.INFO)?.messages?.[0], {
        id: messageId,
        message: 'Message A',
        escapeHTML: false,
        details: 'More Content',
        detailsOpen: false
      });
    });
    (0, _qunit.test)('multiple messages can be added in sequence', function (assert) {
      const manager = new _MessageManager.default();
      manager.addMessage(_constants.AlertLevel.INFO, 'Message A');
      manager.addMessage(_constants.AlertLevel.INFO, 'Message B');
      const group = manager.getGroup(_constants.AlertLevel.INFO);
      assert.strictEqual(group?.messages[0].message, 'Message A');
      assert.strictEqual(group?.messages[1].message, 'Message B');
      assert.true(manager.hasMessage('Message A'));
      assert.true(manager.hasMessage('Message B'));
      manager.addMessage(_constants.AlertLevel.INFO, 'Message C', {
        clearPrior: true
      });
      assert.strictEqual(group?.messages[0].message, 'Message C');
      assert.strictEqual(group?.messages.length, 1);
      assert.false(manager.hasMessage('Message A'));
      assert.false(manager.hasMessage('Message B'));
      assert.true(manager.hasMessage('Message C'));
    });
    (0, _qunit.test)('multiple messages can be added in parallel', function (assert) {
      const manager = new _MessageManager.default();
      let messageIds = manager.addMessagesMany(_constants.AlertLevel.INFO, []);
      assert.deepEqual(messageIds.map(id => typeof id), []);
      messageIds = manager.addMessagesMany(_constants.AlertLevel.INFO, ['Message A', 'Message B']);
      assert.deepEqual(messageIds.map(id => typeof id), ['string', 'string']);
      const group = manager.getGroup(_constants.AlertLevel.INFO);
      assert.strictEqual(group?.messages[0].message, 'Message A');
      assert.strictEqual(group?.messages[1].message, 'Message B');
      assert.true(manager.hasMessage('Message A'));
      assert.true(manager.hasMessage('Message B'));
    });
    (0, _qunit.test)('adding multiple messages in parallel supports configurable options', function (assert) {
      const manager = new _MessageManager.default();
      manager.enableDetails = true;
      const messageIds = manager.addMessagesMany(_constants.AlertLevel.INFO, ['Message A', 'Message B'], {
        escape: false
      });
      const group = manager.getGroup(_constants.AlertLevel.INFO);
      assert.deepEqual(group?.messages?.[0], {
        id: messageIds[0],
        message: 'Message A',
        escapeHTML: false,
        details: null,
        detailsOpen: false
      });
      assert.deepEqual(group?.messages?.[1], {
        id: messageIds[1],
        message: 'Message B',
        escapeHTML: false,
        details: null,
        detailsOpen: false
      });
      manager.addMessagesMany(_constants.AlertLevel.INFO, ['Message C', 'Message D'], {
        clearPrior: true
      });
      assert.false(manager.hasMessage('Message A'));
      assert.false(manager.hasMessage('Message B'));
      assert.strictEqual(group?.messages[0].message, 'Message C');
      assert.strictEqual(group?.messages[1].message, 'Message D');
    });
    (0, _qunit.test)('a message can be removed via its id', function (assert) {
      const manager = new _MessageManager.default();
      const messageId = manager.addMessage(_constants.AlertLevel.INFO, 'Message A');
      assert.true(manager.hasMessage('Message A'));
      assert.false(manager.removeMessage(''));
      assert.false(manager.removeMessage('nope'));
      assert.true(manager.removeMessage(messageId));
      assert.false(manager.hasMessage('Message A'));
    });
    (0, _qunit.test)('a message can be updated via its id', function (assert) {
      const manager = new _MessageManager.default();
      manager.enableDetails = true;
      const messageId = manager.addMessage(_constants.AlertLevel.INFO, 'Message A');
      const group = manager.getGroup(_constants.AlertLevel.INFO);
      assert.true(manager.hasMessage('Message A'), 'The manager has the message');
      assert.strictEqual(group?.messages[0].details, null);
      assert.false(manager.updateMessage('', 'Message B'), 'An id is required');
      assert.false(manager.updateMessage('nope', 'Message B'), 'A valid id is required');
      assert.true(manager.updateMessage(messageId, 'Message B', 'More Content'));
      assert.strictEqual(group?.messages[0].details, 'More Content');
      assert.false(manager.hasMessage('Message A'));
      assert.true(manager.hasMessage('Message B'));
    });
    (0, _qunit.test)('whole message groups can be cleared of content', function (assert) {
      const manager = new _MessageManager.default();
      manager.addMessage(_constants.AlertLevel.INFO, 'Info Message A');
      manager.addMessage(_constants.AlertLevel.ERROR, 'Error Message A');
      manager.addMessage(_constants.AlertLevel.WARNING, 'Warning Message A');
      manager.addMessage(_constants.AlertLevel.SUCCESS, 'Success Message A');
      manager.addMessage(_constants.AlertLevel.MUTED, 'Muted Message A');
      const infoGroup = manager.getGroup(_constants.AlertLevel.INFO);
      const errorGroup = manager.getGroup(_constants.AlertLevel.ERROR);
      const warningGroup = manager.getGroup(_constants.AlertLevel.WARNING);
      const successGroup = manager.getGroup(_constants.AlertLevel.SUCCESS);
      const mutedGroup = manager.getGroup(_constants.AlertLevel.MUTED);
      assert.strictEqual(infoGroup?.messages.length, 1);
      assert.strictEqual(errorGroup?.messages.length, 1);
      assert.strictEqual(warningGroup?.messages.length, 1);
      assert.strictEqual(successGroup?.messages.length, 1);
      assert.strictEqual(mutedGroup?.messages.length, 1);
      manager.clear(_constants.AlertLevel.INFO);
      assert.true(!!manager.getGroup(_constants.AlertLevel.INFO));
      assert.true(manager.isEmpty(_constants.AlertLevel.INFO));
      assert.false(manager.isEmpty(_constants.AlertLevel.ERROR));
      assert.false(manager.isEmpty(_constants.AlertLevel.WARNING));
      assert.false(manager.isEmpty(_constants.AlertLevel.SUCCESS));
      assert.false(manager.isEmpty(_constants.AlertLevel.MUTED));
      manager.clear([_constants.AlertLevel.ERROR, _constants.AlertLevel.WARNING]);
      assert.true(!!manager.getGroup(_constants.AlertLevel.ERROR));
      assert.true(!!manager.getGroup(_constants.AlertLevel.WARNING));
      assert.true(manager.isEmpty(_constants.AlertLevel.ERROR));
      assert.true(manager.isEmpty(_constants.AlertLevel.WARNING));
      assert.false(manager.isEmpty(_constants.AlertLevel.SUCCESS));
      assert.false(manager.isEmpty(_constants.AlertLevel.MUTED));
      manager.clear();
      assert.true(!!manager.getGroup(_constants.AlertLevel.SUCCESS));
      assert.true(!!manager.getGroup(_constants.AlertLevel.MUTED));
      assert.true(manager.isEmpty(_constants.AlertLevel.SUCCESS));
      assert.true(manager.isEmpty(_constants.AlertLevel.MUTED));
    });
    (0, _qunit.test)('groups can be completely removed', function (assert) {
      const manager = new _MessageManager.default();
      manager.addMessage(_constants.AlertLevel.INFO, 'Info Message A');
      manager.addMessage(_constants.AlertLevel.ERROR, 'Error Message A');
      assert.true(!!manager.getGroup(_constants.AlertLevel.INFO));
      assert.true(!!manager.getGroup(_constants.AlertLevel.ERROR));
      manager.removeGroup(_constants.AlertLevel.INFO);
      assert.false(!!manager.getGroup(_constants.AlertLevel.INFO));
      assert.true(!!manager.getGroup(_constants.AlertLevel.ERROR));
    });
    (0, _qunit.test)('groups can be queried for whether they are empty or not', function (assert) {
      const manager = new _MessageManager.default();
      assert.true(manager.isEmpty());
      manager.addMessage(_constants.AlertLevel.INFO, 'Message A');
      assert.false(manager.isEmpty());
      assert.false(manager.isEmpty(_constants.AlertLevel.INFO));
      assert.true(manager.isEmpty(_constants.AlertLevel.MUTED));
    });
    (0, _qunit.test)('the addMessages method can be used to create one or more messages', function (assert) {
      const manager = new class TestMessageManager extends _MessageManager.default {
        addMessage(groupName, message) {
          let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
          assert.step('addMessage');
          assert.step(groupName);
          assert.step(message);
          return super.addMessage(groupName, message, options);
        }
        addMessagesMany(groupName, messages) {
          let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
          assert.step('addMessagesMany');
          assert.step(groupName);
          assert.step(messages.toString());
          return super.addMessagesMany(groupName, messages, options);
        }
      }();
      manager.addMessages(_constants.AlertLevel.INFO, 'Message A');
      manager.addMessages(_constants.AlertLevel.ERROR, ['Message B', 'Message C']);
      assert.verifySteps(['addMessage', _constants.AlertLevel.INFO, 'Message A', 'addMessagesMany', _constants.AlertLevel.ERROR, 'Message B,Message C', 'addMessage', _constants.AlertLevel.ERROR, 'Message B', 'addMessage', _constants.AlertLevel.ERROR, 'Message C']);
    });
    (0, _qunit.test)('the addSuccessMessages helper method adds messages to the success group', function (assert) {
      const manager = new _MessageManager.default();
      manager.addSuccessMessages('Message A');
      manager.addSuccessMessages(['Message B', 'Message C']);
      const group = manager.getGroup(_constants.AlertLevel.SUCCESS);
      const messages = group ? [...group.messagesText.values()] : [];
      assert.deepEqual(messages, ['Message A', 'Message B', 'Message C']);
    });
    (0, _qunit.test)('the addErrorMessages helper method adds messages to the error group', function (assert) {
      const manager = new _MessageManager.default();
      manager.addErrorMessages('Message A');
      manager.addErrorMessages(['Message B', 'Message C']);
      const group = manager.getGroup(_constants.AlertLevel.ERROR);
      const messages = group ? [...group.messagesText.values()] : [];
      assert.deepEqual(messages, ['Message A', 'Message B', 'Message C']);
    });
    (0, _qunit.test)('the addWarningMessages helper method adds messages to the warning group', function (assert) {
      const manager = new _MessageManager.default();
      manager.addWarningMessages('Message A');
      manager.addWarningMessages(['Message B', 'Message C']);
      const group = manager.getGroup(_constants.AlertLevel.WARNING);
      const messages = group ? [...group.messagesText.values()] : [];
      assert.deepEqual(messages, ['Message A', 'Message B', 'Message C']);
    });
    (0, _qunit.test)('the addInfoMessages helper method adds messages to the informational group', function (assert) {
      const manager = new _MessageManager.default();
      manager.addInfoMessages('Message A');
      manager.addInfoMessages(['Message B', 'Message C']);
      const group = manager.getGroup(_constants.AlertLevel.INFO);
      const messages = group ? [...group.messagesText.values()] : [];
      assert.deepEqual(messages, ['Message A', 'Message B', 'Message C']);
    });
    (0, _qunit.test)('the addMessagesByGroup helper method adds messages via an object whose keys are group names', function (assert) {
      const manager = new _MessageManager.default();
      manager.addMessagesByGroup({
        success: 'Message A',
        warning: ['Message B', 'Message C']
      });
      const successGroup = manager.getGroup(_constants.AlertLevel.SUCCESS);
      const warningGroup = manager.getGroup(_constants.AlertLevel.WARNING);
      let successMessages = successGroup ? [...successGroup.messagesText.values()] : [];
      let warningMessages = warningGroup ? [...warningGroup.messagesText.values()] : [];
      assert.deepEqual(successMessages, ['Message A']);
      assert.deepEqual(warningMessages, ['Message B', 'Message C']);
      manager.addMessagesByGroup({
        errors: 'Message D'
      }, {
        clearPrior: true
      });
      const errorGroup = manager.getGroup(_constants.AlertLevel.ERROR);
      const errorMessages = errorGroup ? [...errorGroup.messagesText.values()] : [];
      successMessages = successGroup ? [...successGroup.messagesText.values()] : [];
      warningMessages = warningGroup ? [...warningGroup.messagesText.values()] : [];
      assert.deepEqual(successMessages, []);
      assert.deepEqual(warningMessages, []);
      assert.deepEqual(errorMessages, ['Message D']);
    });
    (0, _qunit.test)('the message helper method will add, update, or remove a message based on provided arguments', function (assert) {
      const manager = new _MessageManager.default();
      const messageId = manager.message({
        message: 'Message A',
        groupName: _constants.AlertLevel.INFO
      });
      assert.strictEqual(typeof messageId, 'string');
      assert.true(manager.hasMessage('Message A', _constants.AlertLevel.INFO));
      manager.message({
        messageId,
        message: 'Message B'
      });
      assert.false(manager.hasMessage('Message A', _constants.AlertLevel.INFO));
      assert.true(manager.hasMessage('Message B', _constants.AlertLevel.INFO));
      manager.message({
        messageId
      });
      assert.false(manager.hasMessage('Message B', _constants.AlertLevel.INFO));
    });
  });
});
define("dummy/tests/unit/optional-service-test", ["qunit", "ember-qunit", "@ember/service", "@nsf-open/ember-ui-foundation/utils"], function (_qunit, _emberQunit, _service, _utils) {
  "use strict";

  0; //eaimeta@70e063a35619d71f0,"qunit",0,"ember-qunit",0,"@ember/service",0,"@nsf-open/ember-ui-foundation/utils"eaimeta@70e063a35619d71f
  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }
  function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
  function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
  function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }
  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }
  (0, _qunit.module)('Unit | Util | optionalService', function (hooks) {
    var _dec, _class, _descriptor, _descriptor2;
    (0, _emberQunit.setupTest)(hooks);
    let TestService = (_dec = (0, _utils.optionalService)(), (_class = class TestService extends _service.default {
      constructor() {
        super(...arguments);
        _initializerDefineProperty(this, "router", _descriptor, this);
        _initializerDefineProperty(this, "doesNotExist", _descriptor2, this);
      }
    }, (_descriptor = _applyDecoratedDescriptor(_class.prototype, "router", [_service.inject], {
      configurable: true,
      enumerable: true,
      writable: true,
      initializer: null
    }), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, "doesNotExist", [_dec], {
      configurable: true,
      enumerable: true,
      writable: true,
      initializer: null
    })), _class));
    hooks.beforeEach(function () {
      this.owner.register('service:test-service', TestService);
    });
    (0, _qunit.test)('it does not throw an exception when the service does not exist', function (assert) {
      const testService = this.owner.lookup('service:test-service');
      const routerService = this.owner.lookup('service:router');
      assert.strictEqual(testService.router, routerService, 'The router service does exist as expected');
      assert.strictEqual(testService.doesNotExist, undefined, 'The "doesNotExist" service does not exist, and no exception was raised');
    });
  });
});
define("dummy/tests/unit/outside-click-handler-test", ["@ember/template-factory", "qunit", "ember-qunit", "@ember/test-helpers", "@nsf-open/ember-ui-foundation/utils/outside-click"], function (_templateFactory, _qunit, _emberQunit, _testHelpers, _outsideClick) {
  "use strict";

  0; //eaimeta@70e063a35619d71f0,"qunit",0,"ember-qunit",0,"@ember/test-helpers",0,"ember-cli-htmlbars",0,"@nsf-open/ember-ui-foundation/utils/outside-click"eaimeta@70e063a35619d71f
  (0, _qunit.module)('Unit | Util | outside-click-handler', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);
    (0, _qunit.test)('it creates a listener that only fires when click happen outside of a given element', async function (assert) {
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            <div id="outer">
              <div id="target">
                <div id="inner"></div>
              </div>
            </div>
          
      */
      {
        "id": "n3lrCPF4",
        "block": "[[[1,\"\\n      \"],[10,0],[14,1,\"outer\"],[12],[1,\"\\n        \"],[10,0],[14,1,\"target\"],[12],[1,\"\\n          \"],[10,0],[14,1,\"inner\"],[12],[13],[1,\"\\n        \"],[13],[1,\"\\n      \"],[13],[1,\"\\n    \"]],[],false,[]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      const listener = (0, _outsideClick.createOutsideClickListener)(null, (0, _testHelpers.find)('#target'), function (event) {
        const eventTarget = event.target;
        assert.step(eventTarget.id);
      });
      await (0, _testHelpers.click)('#outer');
      await (0, _testHelpers.click)('#target');
      await (0, _testHelpers.click)('#inner');
      await (0, _testHelpers.click)('#target');
      await (0, _testHelpers.click)('#outer');
      (0, _outsideClick.removeOutsideClickListener)(listener);
      await (0, _testHelpers.click)('#outer');
      await (0, _testHelpers.click)('#target');
      await (0, _testHelpers.click)('#inner');
      assert.verifySteps(['outer', 'outer']);
    });
    (0, _qunit.test)('it accepts multiple elements that must all be outside of the click hierarchy', async function (assert) {
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            <div id="outer">
              <div id="target1">
                <div id="inner1"></div>
              </div>
              <div id="target2">
                <div id="inner2"></div>
              </div>
            </div>
          
      */
      {
        "id": "5ZAPP+5u",
        "block": "[[[1,\"\\n      \"],[10,0],[14,1,\"outer\"],[12],[1,\"\\n        \"],[10,0],[14,1,\"target1\"],[12],[1,\"\\n          \"],[10,0],[14,1,\"inner1\"],[12],[13],[1,\"\\n        \"],[13],[1,\"\\n        \"],[10,0],[14,1,\"target2\"],[12],[1,\"\\n          \"],[10,0],[14,1,\"inner2\"],[12],[13],[1,\"\\n        \"],[13],[1,\"\\n      \"],[13],[1,\"\\n    \"]],[],false,[]]",
        "moduleName": "(unknown template module)",
        "isStrictMode": false
      }));
      const target1 = (0, _testHelpers.find)('#target1');
      const target2 = (0, _testHelpers.find)('#target2');
      const listener = (0, _outsideClick.createOutsideClickListener)(null, [target1, target2], function (event) {
        const eventTarget = event.target;
        assert.step(eventTarget.id);
      });
      await (0, _testHelpers.click)('#outer');
      await (0, _testHelpers.click)('#target1');
      await (0, _testHelpers.click)('#inner1');
      await (0, _testHelpers.click)('#target1');
      await (0, _testHelpers.click)('#target2');
      await (0, _testHelpers.click)('#inner2');
      await (0, _testHelpers.click)('#target2');
      await (0, _testHelpers.click)('#outer');
      (0, _outsideClick.removeOutsideClickListener)(listener);
      await (0, _testHelpers.click)('#outer');
      await (0, _testHelpers.click)('#target1');
      await (0, _testHelpers.click)('#target2');
      await (0, _testHelpers.click)('#inner1');
      await (0, _testHelpers.click)('#inner2');
      assert.verifySteps(['outer', 'outer']);
    });
  });
});
define("dummy/tests/unit/progress-manager-test", ["qunit", "@nsf-open/ember-ui-foundation/lib/ProgressManager", "@nsf-open/ember-ui-foundation/lib/ProgressItem"], function (_qunit, _ProgressManager, _ProgressItem) {
  "use strict";

  var _dec, _class, _descriptor;
  0; //eaimeta@70e063a35619d71f0,"qunit",0,"@nsf-open/ember-ui-foundation/lib/ProgressManager",0,"@nsf-open/ember-ui-foundation/lib/ProgressItem"eaimeta@70e063a35619d71f
  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }
  function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
  function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
  function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }
  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }
  let TestClass = (_dec = (0, _ProgressManager.progressManager)([{
    label: 'Step A',
    component: 'test-component-a'
  }]), (_class = class TestClass {
    constructor() {
      _initializerDefineProperty(this, "decoratorBuiltManager", _descriptor, this);
    }
  }, (_descriptor = _applyDecoratedDescriptor(_class.prototype, "decoratorBuiltManager", [_dec], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  })), _class));
  (0, _qunit.module)('Unit | Lib | ProgressManager', function () {
    (0, _qunit.test)('@stepFlowManager decorator', function (assert) {
      assert.true(new TestClass().decoratorBuiltManager instanceof _ProgressManager.default);
    });
    (0, _qunit.test)('the manager creates StepFlowItem instances from basic definitions', function (assert) {
      const manager = new _ProgressManager.default([{
        label: 'Step A',
        component: 'test-component-a'
      }, {
        label: 'Step B',
        component: 'test-component-b',
        title: 'Step 2'
      }, {
        label: 'Step C',
        component: 'test-component-c',
        title: 'Step 3',
        indeterminate: true
      }, {
        label: 'Step D',
        component: 'test-component-d',
        title: 'Step 4',
        complete: true
      }]);
      const stepA = manager.getStepAt(0);
      const stepB = manager.getStepAt(1);
      const stepC = manager.getStepAt(2);
      const stepD = manager.getStepAt(3);
      assert.strictEqual(manager.totalStepCount, 4);
      assert.strictEqual(stepA?.label, 'Step A');
      assert.strictEqual(stepA?.component, 'test-component-a');
      assert.strictEqual(stepB?.label, 'Step B');
      assert.strictEqual(stepB?.component, 'test-component-b');
      assert.strictEqual(stepB?.title, 'Step 2');
      assert.strictEqual(stepC?.label, 'Step C');
      assert.strictEqual(stepC?.component, 'test-component-c');
      assert.strictEqual(stepC?.title, 'Step 3');
      assert.true(stepC?.indeterminate);
      assert.strictEqual(stepD?.label, 'Step D');
      assert.strictEqual(stepD?.component, 'test-component-d');
      assert.strictEqual(stepD?.title, 'Step 4');
      assert.true(stepD?.complete);
    });
    (0, _qunit.test)('additional steps can be added to the manager', function (assert) {
      const manager = new _ProgressManager.default([{
        label: 'Step A',
        component: 'test-component-a'
      }]);
      assert.strictEqual(manager.totalStepCount, 1);
      const stepA = manager.getStepAt(0);
      assert.strictEqual(stepA?.label, 'Step A');
      assert.strictEqual(stepA?.component, 'test-component-a');
      manager.addStep({
        label: 'Step B',
        component: 'test-component-b',
        title: 'Step 2'
      });
      manager.addStep(new _ProgressItem.default({
        label: 'Step C',
        component: 'test-component-c'
      }, manager));
      assert.throws(() => {
        // @ts-expect-error - Intentionally passing in the wrong type of thing
        manager.addStep('Hello World');
      });
      const stepB = manager.getStepAt(1);
      assert.strictEqual(stepB?.label, 'Step B');
      assert.strictEqual(stepB?.component, 'test-component-b');
      const stepC = manager.getStepAt(2);
      assert.strictEqual(stepC?.label, 'Step C');
      assert.strictEqual(stepC?.component, 'test-component-c');
    });
    (0, _qunit.test)('steps can be navigated between', function (assert) {
      const manager = new _ProgressManager.default([{
        label: 'Step A',
        component: 'test-component-a',
        indeterminate: true
      }, {
        label: 'Step B',
        component: 'test-component-b',
        indeterminate: true
      }, {
        label: 'Step C',
        component: 'test-component-c',
        indeterminate: true
      }, {
        label: 'Step D',
        component: 'test-component-d'
      }]);
      assert.strictEqual(manager.totalStepCount, 4);
      assert.strictEqual(manager.completedStepCount, 3);
      assert.strictEqual(manager.currentStepIndex, 0);
      assert.false(manager.isComplete);
      assert.false(manager.hasPreviousStep);
      assert.true(manager.hasNextStep);
      assert.strictEqual(manager.previousStep, undefined);
      assert.strictEqual(manager.currentStep, manager.getStepAt(0));
      assert.strictEqual(manager.nextStep, manager.getStepAt(1));
      assert.false(manager.goToStep(-1));
      assert.false(manager.goToStep(5));
      manager.goToNextStep();
      assert.strictEqual(manager.currentStepIndex, 1);
      assert.true(manager.hasPreviousStep);
      assert.true(manager.hasNextStep);
      assert.strictEqual(manager.previousStep, manager.getStepAt(0));
      assert.strictEqual(manager.nextStep, manager.getStepAt(2));
      manager.goToStep(3);
      assert.true(manager.hasPreviousStep);
      assert.false(manager.hasNextStep);
      assert.strictEqual(manager.previousStep, manager.getStepAt(2));
      assert.strictEqual(manager.nextStep, undefined);
    });
    (0, _qunit.test)('the completed state of a ProgressItem can be toggled via updateCompleteState()', function (assert) {
      const manager = new _ProgressManager.default([{
        label: 'Step A',
        component: 'test-component-a'
      }]);
      const stepA = manager.getStepAt(0);
      assert.false(stepA?.isComplete);
      stepA?.updateCompleteState(true);
      assert.true(stepA?.isComplete);
      stepA?.updateCompleteState({
        isFormValid: false
      });
      assert.false(stepA?.isComplete);
    });
  });
});
define("dummy/tests/unit/query-parser-test", ["@nsf-open/ember-ui-foundation/lib/QueryParser", "qunit"], function (_QueryParser, _qunit) {
  "use strict";

  0; //eaimeta@70e063a35619d71f0,"@nsf-open/ember-ui-foundation/lib/QueryParser",0,"qunit"eaimeta@70e063a35619d71f
  function getTokenRule(name) {
    return _QueryParser.TokenRules.find(rule => rule.name === name);
  }
  function testOperation(assert, name, expect) {
    const rule = _QueryParser.TokenRules.find(rule => rule.name === name);
    for (let i = 0; i < expect.length; i += 1) {
      const [testFn, left, right] = expect[i];
      assert[testFn](rule.operation?.(left, right), `${rule.name}(${left}, ${right}); // ${testFn}`);
    }
  }
  (0, _qunit.module)('Unit | Lib | QueryParser', function () {
    // const recordA = {
    //   name: 'John Doe',
    //   isAdmin: false,
    //   age: 42,
    //   expiration: null,
    //   permissions: ['read', 'write'],
    //   nickname: 'Goose',
    // };
    //
    // const recordB = {
    //   name: 'Jane Dae',
    //   isAdmin: true,
    //   age: 34,
    //   permissions: ['log'],
    //   nickname: 'Maverick',
    // };
    //
    // const recordC = {
    //   name: 'Tom John',
    //   isAdmin: true,
    //   age: '34',
    //   expiration: '01/01/1970',
    //   nickname: 'Tom John',
    // };
    //
    // const recordSet = [recordA, recordB, recordC];

    // test('it creates a filter function based on a crafted string query', function (assert) {
    //   assert.expect(21);
    //
    //   const parser = new QueryParser();
    //
    //   function testQuery(query: string, expect: unknown[]) {
    //     assert.deepEqual(
    //       recordSet.filter(parser.evaluate(query)),
    //       expect,
    //       `The query - ${query} - returned ${expect.length} record(s)`
    //     );
    //   }
    //
    //   assert.throws(() => parser.evaluate(''), 'It throws on an empty string');
    //   assert.throws(() => parser.evaluate('name EQU'), 'It throws on an incomplete query');
    //   assert.throws(
    //     () => parser.evaluate('(name EQUALS "Bob"'),
    //     'It throws on an unclosed parenthesis'
    //   );
    //
    //   testQuery('foo EQUALS "bar"', []);
    //   testQuery('foo EQUALS bar', [recordA, recordB, recordC]);
    //   testQuery('name EQUALS nickname', [recordC]);
    //   testQuery('name EQUALS "John Doe"', [recordA]);
    //   testQuery('name STARTS WITH "Jane"', [recordB]);
    //   testQuery('name ENDS WITH "ohn"', [recordC]);
    //   testQuery('name INCLUDES " D"', [recordA, recordB]);
    //   testQuery('permissions INCLUDES "write"', [recordA]);
    //   testQuery('isAdmin EQUALS true', [recordB, recordC]);
    //   testQuery('isAdmin EQUALS false', [recordA]);
    //   testQuery('expiration EQUALS null', [recordA]);
    //   testQuery('expiration EQUALS undefined', [recordB]);
    //   testQuery('age EQUALS 34', [recordB]);
    //   testQuery('age EQUALS 34 OR age EQUALS 42', [recordA, recordB]);
    //   testQuery('isAdmin EQUALS true AND name STARTS WITH "Tom"', [recordC]);
    //   testQuery('(isAdmin EQUALS true)', [recordB, recordC]);
    //   testQuery('(isAdmin EQUALS true) AND (name STARTS WITH "Tom")', [recordC]);
    //   testQuery('(isAdmin EQUALS true AND name STARTS WITH "Tom") OR nickname EQUALS "Maverick"', [
    //     recordB,
    //     recordC,
    //   ]);
    // });

    (0, _qunit.test)('AND operator', function (assert) {
      assert.expect(4);
      testOperation(assert, _QueryParser.TokenKeys.LogicalAnd, [['true', true, true], ['false', false, true], ['false', true, false], ['false', false, false]]);
    });
    (0, _qunit.test)('OR operator', function (assert) {
      assert.expect(4);
      testOperation(assert, _QueryParser.TokenKeys.LogicalOr, [['true', true, true], ['true', false, true], ['true', true, false], ['false', false, false]]);
    });
    (0, _qunit.test)('EQUALS comparison', function (assert) {
      assert.expect(7);
      testOperation(assert, _QueryParser.TokenKeys.EqualsComparison, [['true', 1, 1], ['true', 'a', 'a'], ['true', true, true], ['true', false, false], ['false', 1, 2], ['false', 'a', 'b'], ['false', true, false]]);
    });
    (0, _qunit.test)('DOES NOT EQUAL comparison', function (assert) {
      assert.expect(7);
      testOperation(assert, _QueryParser.TokenKeys.NotEqualToComparison, [['false', 1, 1], ['false', 'a', 'a'], ['false', true, true], ['false', false, false], ['true', 1, 2], ['true', 'a', 'b'], ['true', true, false]]);
    });
    (0, _qunit.test)('STARTS WITH comparison', function (assert) {
      const rule = getTokenRule(_QueryParser.TokenKeys.StartsWithComparison);
      assert.true(rule.operation?.('Hello World', 'Hello'));
      assert.false(rule.operation?.('Hello World', 'World'));
      assert.false(rule.operation?.('Hello World', 1));
      assert.false(rule.operation?.(1, 'Hello'));
      assert.false(rule.operation?.(1, 1));
    });
    (0, _qunit.test)('DOES NOT START WITH comparison', function (assert) {
      const rule = getTokenRule(_QueryParser.TokenKeys.DoesNotStartWithComparison);
      assert.true(rule.operation?.('Hello World', 'World'));
      assert.false(rule.operation?.('Hello World', 'Hello'));
      assert.false(rule.operation?.('Hello World', 1));
      assert.false(rule.operation?.(1, 'Hello'));
      assert.false(rule.operation?.(1, 1));
    });
    (0, _qunit.test)('ENDS WITH comparison', function (assert) {
      const rule = getTokenRule(_QueryParser.TokenKeys.EndsWithComparison);
      assert.true(rule.operation?.('Hello World', 'World'));
      assert.false(rule.operation?.('Hello World', 'Hello'));
      assert.false(rule.operation?.('Hello World', 1));
      assert.false(rule.operation?.(1, 'Hello'));
      assert.false(rule.operation?.(1, 1));
    });
    (0, _qunit.test)('DOES NOT END WITH comparison', function (assert) {
      const rule = getTokenRule(_QueryParser.TokenKeys.DoesNotEndWithComparison);
      assert.true(rule.operation?.('Hello World', 'Hello'));
      assert.false(rule.operation?.('Hello World', 'World'));
      assert.false(rule.operation?.('Hello World', 1));
      assert.false(rule.operation?.(1, 'Hello'));
      assert.false(rule.operation?.(1, 1));
    });
    (0, _qunit.test)('INCLUDES comparison', function (assert) {
      const rule = getTokenRule(_QueryParser.TokenKeys.IncludesComparison);
      assert.true(rule.operation?.('Hello World', 'llo W'));
      assert.true(rule.operation?.(['Hello', 'World'], 'World'));
      assert.false(rule.operation?.('Hello World', 'Foo'));
      assert.false(rule.operation?.(['Hello', 'World'], 'Bar'));
      assert.false(rule.operation?.('Hello World', 1));
      assert.false(rule.operation?.(1, 'Hello'));
      assert.false(rule.operation?.(1, 1));
    });
    (0, _qunit.test)('DOES NOT INCLUDE comparison', function (assert) {
      const rule = getTokenRule(_QueryParser.TokenKeys.DoesNotIncludeComparison);
      assert.true(rule.operation?.('Hello World', 'Foo'));
      assert.true(rule.operation?.(['Hello', 'World'], 'Bar'));
      assert.false(rule.operation?.('Hello World', 'llo W'));
      assert.false(rule.operation?.(['Hello', 'World'], 'World'));
      assert.false(rule.operation?.('Hello World', 1));
      assert.false(rule.operation?.(1, 'Hello'));
      assert.false(rule.operation?.(1, 1));
    });
    (0, _qunit.test)('IS LESS THAN comparison', function (assert) {
      const rule = getTokenRule(_QueryParser.TokenKeys.IsLessThanComparison);
      assert.true(rule.operation?.(1, 2));
      assert.false(rule.operation?.(2, 1));
      assert.false(rule.operation?.('foo', 2));
      assert.false(rule.operation?.(1, 'bar'));
      assert.false(rule.operation?.('foo', 'bar'));
    });
    (0, _qunit.test)('IS GREATER THAN comparison', function (assert) {
      const rule = getTokenRule(_QueryParser.TokenKeys.IsGreaterThanComparison);
      assert.true(rule.operation?.(2, 1));
      assert.false(rule.operation?.(1, 2));
      assert.false(rule.operation?.('foo', 2));
      assert.false(rule.operation?.(1, 'bar'));
      assert.false(rule.operation?.('foo', 'bar'));
    });
    (0, _qunit.test)('tokenize()', function (assert) {
      const parser = new _QueryParser.default();
      function testTokenizer(query, expected) {
        const tokens = parser.tokenize(query);
        assert.deepEqual(tokens.map(item => item.name), expected, expected.join(' -> '));
        return tokens;
      }
      testTokenizer('name EQUALS "Bob"', [_QueryParser.TokenKeys.ColumnIdentifier, _QueryParser.TokenKeys.EqualsComparison, _QueryParser.TokenKeys.StringLiteral]);
      testTokenizer('(name EQUALS "Bob")', [_QueryParser.TokenKeys.LeftParen, _QueryParser.TokenKeys.ColumnIdentifier, _QueryParser.TokenKeys.EqualsComparison, _QueryParser.TokenKeys.StringLiteral, _QueryParser.TokenKeys.RightParen]);
      testTokenizer('age DOES NOT EQUAL 42', [_QueryParser.TokenKeys.ColumnIdentifier, _QueryParser.TokenKeys.NotEqualToComparison, _QueryParser.TokenKeys.NumberLiteral]);
      testTokenizer('age DOES NOT EQUAL 42', [_QueryParser.TokenKeys.ColumnIdentifier, _QueryParser.TokenKeys.NotEqualToComparison, _QueryParser.TokenKeys.NumberLiteral]);
    });
  });
});
define('dummy/config/environment', [], function() {
  var prefix = 'dummy';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(decodeURIComponent(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

require('dummy/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;
//# sourceMappingURL=tests.map
