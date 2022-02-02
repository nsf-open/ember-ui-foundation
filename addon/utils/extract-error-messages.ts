import { isHTMLSafe } from '@ember/template';

function isObjectLike(obj: unknown): obj is Record<string, unknown> {
  return typeof obj === 'object' && obj !== null;
}

function isStringOrSafeString(obj: unknown): obj is string {
  return typeof obj === 'string' || isHTMLSafe(obj);
}

/**
 * Attempts to find string content in an ErrorLike sort of object.
 */
export default function extractErrorMessages(err: unknown): string[] | undefined {
  if (err === undefined || err === null) {
    return undefined;
  }

  if (isStringOrSafeString(err)) {
    return [err as string];
  }

  if (Array.isArray(err) && err.length > 0 && isStringOrSafeString(err[0])) {
    return err as string[];
  }

  if (err instanceof Error) {
    return [err.message];
  }

  if (isObjectLike(err)) {
    if (Array.isArray(err.errors)) {
      return err.errors.length > 0 && isStringOrSafeString(err.errors[0]) ? err.errors : undefined;
    }

    if (isStringOrSafeString(err.error)) {
      return [err.error] as string[];
    }
  }

  return undefined;
}
