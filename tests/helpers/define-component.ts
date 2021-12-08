import type { TemplateFactory } from 'ember-cli-htmlbars';
import Component from '@ember/component';

export default function defineComponent(id: string, layout: TemplateFactory) {
  // eslint-disable-next-line ember/no-classic-classes
  return Component.extend({ layout, elementId: id });
}
