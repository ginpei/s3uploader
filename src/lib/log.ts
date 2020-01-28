/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */

import { red } from 'colors';

export function log(message: string, ...args: any[]) {
  console.log(message, ...args);
}

export function logError(error?: Error, ...args: any[]) {
  console.error(red(error?.message || 'Unknown error'));
  console.error(error, ...args);
}
