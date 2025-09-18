import { version } from '../../package.json';

/**
 * Get the package.json version for telemetry and other utilities
 * @returns The version string from package.json
 */
export function getPackageJsonVersion(): string {
  return version;
}
