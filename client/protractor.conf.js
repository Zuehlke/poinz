'use strict';

// either start Poinz from your "deploy" folder, or start a docker container (if run from docker container, make sure to use localhost:8080 for e2eBaseUrl)
// ( do not use the webdack-dev-server, since it displays the app within an iframe )
var e2eBaseUrl = 'http://localhost:8080';

var exportsConfig = {

  framework: 'jasmine2',

  // The location of the selenium standalone server .jar file.
  seleniumServerJar: './node_modules/protractor/node_modules/webdriver-manager/selenium/selenium-server-standalone-2.53.1.jar',
  // find its own unused port.
  seleniumPort: null,

  chromeDriver: './node_modules/protractor/node_modules/webdriver-manager/selenium/chromedriver_2.25',
  seleniumArgs: [],

  allScriptsTimeout: 11000,

  specs: [
    'test/e2e/**/_setup.js',
    'test/e2e/**/*Spec.js'
  ],

  capabilities: {
    browserName: 'chrome'
  },

  onPrepare: function () {
    // since we have a ReactJS application (no angular), we need to disable sync.
    browser.ignoreSynchronization = true;
  },

  baseUrl: e2eBaseUrl,

  rootElement: 'body',

  params: {
    baseUrl: e2eBaseUrl
  },

  jasmineNodeOpts: {

    // If set, only execute specs whose names match the pattern, which is
    // internally compiled to a RegExp.
    //grep: 'failing',
    // Inverts 'grep' matches
    // invertGrep: false,

    // If true, print colors to the terminal.
    showColors: true,
    // If true, include stack traces in failures.
    includeStackTrace: true,
    // Default time to wait in ms before a test fails.
    defaultTimeoutInterval: 60000
  }
};

exports.config = exportsConfig;
