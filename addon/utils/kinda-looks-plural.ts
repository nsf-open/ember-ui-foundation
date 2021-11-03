/**
 * A really simple and pretty sloppy way to sort of, kind of, maybe determine whether plurality
 * applies to something. For how dumb it is it works a surprising amount of the time.
 *
 * The main purpose of this function is to help put grammatically correct sentences together. It
 * helps answers questions like _should "is" or "are" come after this word?_.
 *
 * If you really need to determine things with certainty, or you need to actually perform the
 * pluralization/singularization of a word (this function doesn't change any value - just provides
 * a boolean) then you'll need to look into a more robust inflector library.
 */
export default function kindaLooksPlural(value: number | string | null | undefined): boolean {
  if (typeof value === 'number') {
    return value !== 1;
  } else if (typeof value === 'string') {
    if (value.match(/^\d+$/)) {
      return parseInt(value, 10) !== 1;
    }
    return value.length > 0 && value[value.length - 1] === 's' && value[value.length - 2] !== 's';
  }

  return false;
}
