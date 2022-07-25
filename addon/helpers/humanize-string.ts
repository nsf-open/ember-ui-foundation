import Helper from '@ember/component/helper';
import { humanize } from '@nsf-open/ember-general-utils';

/**
 * This helper takes a string and runs it through the @nsf-open/ember-general-utils
 * `humanize` function.
 *
 * ```handlebars
 * {{humanize-string "firstName"}}
 * {{! >> "First name" }}
 *
 * {{humanize-string "firstName" titleCase=true}}
 * {{! >> "First Name" }}
 * ```
 */
export default class HumanizeString extends Helper {
  /** @protected */
  compute([value]: [string], { titleCase = false } = {}) {
    return humanize(value, titleCase);
  }
}
