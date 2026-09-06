import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const rootDir = path.resolve(path.dirname(__filename), '..');

/**
 * Single canonical accessor for the project version.
 * Strictly reads from the repository root `VERSION` file.
 * Hardcoding versions elsewhere in code is strictly prohibited.
 */
export function getVersion() {
  const versionFile = path.join(rootDir, 'VERSION');
  if (!fs.existsSync(versionFile)) {
    throw new Error(`VERSION file not found at ${versionFile}`);
  }
  const version = fs.readFileSync(versionFile, 'utf8').trim();
  if (!/^\d+\.\d+\.\d+(-[a-zA-Z0-9.]+)?$/.test(version)) {
    throw new Error(`Invalid semantic version format in VERSION file: "${version}"`);
  }
  return version;
}

export default getVersion;
