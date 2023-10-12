import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a version 5 (namespace-based) UUID
 */
export function generateUUID(): string {
  return uuidv4();
}
