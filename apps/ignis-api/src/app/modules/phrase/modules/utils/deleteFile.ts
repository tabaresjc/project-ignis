import { Logger } from '@nestjs/common';
import * as fs from 'node:fs/promises';

/**
 * Delete the provided file
 * Any error will be logged as warning
 */
export async function deleteFile(filePath) {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    Logger.warn(`Failed to delete file: ${filePath}.`, error);
  }
}
