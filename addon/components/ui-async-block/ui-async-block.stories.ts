import { hbs } from 'ember-cli-htmlbars';

export default {
  title: 'Elements/Async Block',
  component: 'UiAsyncBlock',

  parameters: {
    componentSubtitle: 'Promise State Management UI',
  },
};

function makePromise(doResolve = true, content = ['Hello World']) {
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      doResolve ? resolve(content) : reject(content);
    }, 5000);
  });
}

function resolvingPromise() {
  return makePromise();
}

function rejectingPromise() {
  return makePromise(false);
}

function emptyPromise() {
  return makePromise(true, []);
}

export const Success = function () {
  return {
    template: hbs`
      {{#ui-async-block "Witty Catchphrases" promise=this.promise as |results|}}
        <ul>
          {{#each results as |result|}}
            <li>{{result}}</li>
          {{/each}}
        </ul>
      {{/ui-async-block}}
    `,

    context: {
      promise: resolvingPromise(),
    },
  };
};

export const Failure = function () {
  return {
    template: hbs`
      {{#ui-async-block "Witty Catchphrases" promise=this.promise as |results|}}
        {{results}}
      {{/ui-async-block}}
    `,

    context: {
      promise: rejectingPromise(),
    },
  };
};

export const NoResults = function () {
  return {
    template: hbs`
      {{#ui-async-block "Witty Catchphrases" promise=this.promise noResults=true as |results|}}
        {{results}}
      {{/ui-async-block}}
    `,

    context: {
      promise: emptyPromise(),
    },
  };
};
