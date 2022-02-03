import Helper from '@ember/component/helper';

/**
 * This helper adds 1 to any number. That's it.
 *
 * ```handlebars
 * {{#each this.someArrayOfItems as |item index|}}
 *    <p>{{get-ones-index index}}. {{item.someContentThing}}</p>
 * {{/each}}
 *
 * {{!--
 *  <p>1. Tie Shoes</p>
 *  <p>2. Brush Teeth</p>
 *  ...
 * --}}
 * ```
 *
 * What's that? You say a &lt;ol&gt; makes way more semantic sense?
 * Yup, I agree.
 */
export default class GetOnesIndex extends Helper {
  /**
   * @protected
   */
  compute([index]: [number]) {
    return index + 1;
  }
}
