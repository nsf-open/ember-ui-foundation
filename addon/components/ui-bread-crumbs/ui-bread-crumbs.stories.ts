import { hbs } from 'ember-cli-htmlbars';

export default {
  title: 'Elements/ui-bread-crumbs',
  component: 'components/ui-bread-crumbs/component',
};

const Template = (context: unknown) => ({
  context: Object.assign(
    {
      handleLinkClick(event: Event) {
        event.preventDefault();
      },
    },
    context
  ),

  // language=handlebars
  template: hbs`
    <ol class="breadcrumb">
        <li><a href="/" onclick={{action this.handleLinkClick}}>Home</a></li>
        <li><a href="/" onclick={{action this.handleLinkClick}}>Artists</a></li>
        <li><a href="/" onclick={{action this.handleLinkClick}}>Queen</a></li>
        <li><a href="/" onclick={{action this.handleLinkClick}}>Albums</a></li>
        <li class="active">A Night At The Opera</li>
    </ol>
  `,
});

export const Default = Template.bind({});
Default.storyName = 'ui-bread-crumbs';
