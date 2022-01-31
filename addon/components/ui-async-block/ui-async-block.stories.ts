import { hbs } from 'ember-cli-htmlbars';

export default {
  title: 'Elements/ui-async-block',
  component: 'components/ui-async-block/component',

  parameters: {
    docs: {
      iframeHeight: 120,
    },
  },

  args: {
    name: 'Witty Catchphrases',
  },
};

function makePromise(doResolve = true, content = ['Hello World']) {
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      doResolve ? resolve(content) : reject(content);
    }, 5000);
  });
}

const Template = (context: unknown) => ({
  context,
  // language=hbs
  template: hbs`
    <UiAsyncBlock
      @name={{this.name}}
      @promise={{this.promise}}
      @noResults={{this.noResults}}
    as |results|>
      {{results}}
    </UiAsyncBlock>
  `,
});

export const Success = (context: unknown) => {
  return Template(
    Object.assign({}, context, {
      promise: makePromise(true),
    })
  );
};

export const Failure = (context: unknown) => {
  return Template(
    Object.assign({}, context, {
      promise: makePromise(false),
    })
  );
};

export const NoResults = (context: unknown) => {
  return Template(
    Object.assign({}, context, {
      promise: makePromise(true, []),
    })
  );
};

NoResults.args = {
  noResults: true,
};

NoResults.parameters = {
  docs: {
    iframeHeight: 50,
  },
};
