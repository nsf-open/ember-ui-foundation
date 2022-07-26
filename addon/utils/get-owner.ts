import { getOwner } from '@ember/application';

interface IOwner {
  resolveRegistration: <T>(name: string) => T;
  lookup: <T>(name: string) => T;
}

/**
 * A typed version of @ember/application `getOwner` for internal use.
 */
export default function getTypedOwner(target: unknown): IOwner | null {
  return getOwner(target) as IOwner | null;
}
