const
  _ = require('lodash'),
  path = require('path'),
  Promise = require('bluebird'),
  nativeFs = require('fs'),
  ncu = require('npm-check-updates');

const writeFile = Promise.promisify(nativeFs.writeFile);

function getPackageFileToUse() {
  if (process.argv.length < 3) {
    throw new Error('Please specify path to package.json');
  }

  return path.resolve(process.cwd(), process.argv[2]);
}

function getPackageInformation(packageFile) {
  const pkg = require(packageFile);
  return {
    currentDependencies: _.merge({}, pkg.dependencies, pkg.devDependencies),
    name: pkg.name
  };
}

/**
 * Check our 3rd party npm modules defined as dependencies/devDependencies in our package.json
 */
function runCheck() {

  const packageFile = getPackageFileToUse();

  console.log('Reading information from  ' + packageFile);

  const pkg = getPackageInformation(packageFile);
  const reportFileName = `./npm_dependencies_report.${pkg.name}.md`;


  ncu
    .run({
      packageFile: packageFile,
      'error-level': 1 // we don't want to fail CI... we write a report file
    })
    .then(upgraded => {
      const tmpl = _.size(upgraded) > 0
        ? '# NPM DependencyCheck Report for <%- name %>\nThe following dependencies are out-of-date:\n\n<% _.forEach(upgraded, function(version, dependency) { %>* <%- dependency %>: <%- currentDependencies[dependency]%> -> <%- version%>\n<% }); %>'
        : '# NPM DependencyCheck Report for <%- name %>\nNo dependencies are out-of-date :-)';

      const data = _.merge({
        upgraded: upgraded,
        _: _
      }, pkg);

      const report = _.template(tmpl)(data);

      return report;
    })
    .then(report => writeFile(reportFileName, report, 'utf-8'))
    .then(() => {
      console.log('Report saved to ' + reportFileName);
      process.exit(0);
    })
    .catch(err => {
      console.error(err);
      process.exit(1);
    });

}

runCheck();
