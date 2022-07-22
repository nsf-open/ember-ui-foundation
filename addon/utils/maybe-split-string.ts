/**
 * Returns an array created from a string list of comma separated value, or null if anything
 * other than a string is given.
 */
export default function maybeSplitString(value: unknown): string[] | null {
  return typeof value === 'string' ? value.split(',').map((item) => item.trim()) : null;
}
