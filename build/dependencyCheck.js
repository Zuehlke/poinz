const
  _ = require('lodash'),
  path = require('path'),
  fs = require('fs'),
  q = require('q'),
  ncu = require('npm-check-updates');


function getPackageFileToUse() {
  if (process.argv.length < 3) {
    throw new Error('Please specify path to package.json');
  }

  return path.resolve(process.cwd(), process.argv[2]);
}

function getPackageInformation() {
  const pkg = require(getPackageFileToUse());
  return {
    currentDependencies: _.merge({}, pkg.dependencies, pkg.devDependencies),
    name: pkg.name
  };
}

/**
 * Check our 3rd party npm modules defined as dependencies/devDependencies in our package.json
 */
function runCheck() {

  const pkg = getPackageInformation();
  const reportFileName = `./npm_dependencies_report.${pkg.name}.md`;

  ncu.run({
      packageFile: getPackageFileToUse(),
      'error-level': 1 // we don't want to fail CI... we write a report file
    })
    .then(function (upgraded) {
      const tmpl = _.size(upgraded)
        ? '# NPM DependencyCheck Report for <%- name %>\nThe following dependencies are out-of-date:\n\n<% _.forEach(upgraded, function(version, dependency) { %>* <%- dependency %>: <%- currentDependencies[dependency]%> -> <%- version%>\n<% }); %>'
        : '# NPM DependencyCheck Report for <%- name %>\nNo dependencies are out-of-date :-)';
      return _.template(tmpl)(_.merge({
        upgraded: upgraded
      }, pkg));
    })
    .then(function (report) {
      return q.nfcall(fs.writeFile, reportFileName, report);
    })
    .then(function () {
      console.log('Report saved to ' + reportFileName);
      process.exit(0);
    })
    .catch(err => {
      console.error(err);
      process.exit(1);
    });

}

runCheck();
