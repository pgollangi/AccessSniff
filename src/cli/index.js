import program from 'commander';
import logger from '../logger';
import accessSniff from '../app';
import report from '../reports';
import packageInfo from '../../package.json';

var exports = {};

exports.setup = function(cliOptions) {

  var options = {};

  program
    .version(packageInfo.version)
    .option('-e, --errorLevels [errorLevels]', 'Error levels [error]', 'error')
    .option('-r, --reportType [reportType]', 'Report type [json]', 'json')
    .option('-l, --reportLocation [reportLocation]', 'Report Location [reports]', 'reports')
    .option('-f, --force', 'No failure in case of errors')
    .option('-q, --quiet', 'No terminal output')
    .on('--help', () => {
      console.log();
      console.log('  Error levels is a comma-delimited combination of error, warning and notice.');
      console.log('  If a message of one of the specified levels occurs, validation will fail.');
      console.log('  Report type can be one of json, text or csv. It specified the output format.');
    })
    .parse(cliOptions);

  if (!program.args.length) {
    logger.generalError('Please provide a filepath, url or string to check');
    return false;
  }

  options.errorLevels = program.errorLevels.split(',')
    .reduce((result, level) => {
      result[level] = true;
      return result;
    }, {});

  // ADD IN REPORTS
  options.reportType = program.reportType;
  options.reportLocation = program.reportLocation;

  if (program.force) {
    options.force = true;
  }

  options.verbose = !program.quiet;

  function writeReport(reportData) {
    if (options.reportType || options.reportLocation) {
      return report(reportData, options);
    }
  }

  new accessSniff(options)
    .run(program.args)
    .then(writeReport, result => {
      writeReport(result.reportLogs);
      process.exit(1);
    });

};

module.exports = exports;
