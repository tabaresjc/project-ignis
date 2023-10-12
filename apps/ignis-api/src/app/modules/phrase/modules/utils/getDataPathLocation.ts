import path from 'path';
import config from '../../../../config';

/**
 * Append the fileName to the default data path folder
 */
export function getDataPathLocation(fileName: string) {
  return path.join(config.dataPath, fileName);
}
