/**
 * This encapsulates access to application configuration.
 * Instead of accessing __POINZ_CONFIG__ in various components/places, use this module instead.
 *
 * In a unit-test environment (our files are loaded and run via nodeJS) there is no __POINZ_CONFIG__ set.
 *
 * In webpack dev serve + production, __POINZ_CONFIG__ is set via webpack (see webpack.config.js and webpack.production.config.js)
 */
const appConfig = typeof __POINZ_CONFIG__ !== 'undefined' ? __POINZ_CONFIG__ : {env: 'test'};
export default {
  ...appConfig,
  APP_STATUS_IDENTIFIER: 'poinzstatus'
};
