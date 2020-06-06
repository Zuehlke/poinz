import {exportDocu, discardDocu} from './commandAndEventDocuGenerator';

/**
 * just a hook to trigger docu export.
 */
export default async function poinzBackendGlobalUnitTestTeardown(globalConfig) {
  if (globalConfig.collectCoverage) {
    await exportDocu();
  } else {
    await discardDocu();
  }
}
