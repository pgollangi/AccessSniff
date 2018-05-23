import _ from 'underscore';
import Promise from 'bluebird';
import logger from '../logger';

import TestRunner from './testRunner';
import CreateErrorMessage from './createErrorMessage';
import { CreateReportsJson, GenerateReportLevels } from '../helpers';

import defaults from '../helpers/defaults';

export default class Accessibility {
  constructor(options) {

    // Merge defaults with options
    _.defaults(options, defaults);

    options.reportLevelsArray = GenerateReportLevels(options.reportLevels);

    // Assign options to this
    this.options = options;
  }

  run(filesInput) {
    const files = Promise.resolve(filesInput);
    const { verbose, errorLevels } = this.options;

    if (this.options.verbose) {
      logger.startMessage('Starting Accessibility tests');
    }

    return files
      .bind(this)
      .mapSeries((file) => TestRunner(file, this.options), { concurrency: 1 })
      .then(reports => CreateReportsJson(reports))
      .then(({ reportLogs, totalIssueCount, AllReportsLintFree }) => {
        let errorMessage = CreateErrorMessage(totalIssueCount);
        let reportError = totalIssueCount.error && errorLevels.error ||
          totalIssueCount.warning && errorLevels.warning ||
          totalIssueCount.notice && errorLevels.notice;

        if (AllReportsLintFree) {
          logger.lintFree(filesInput.length);
        }

        if (reportError && verbose) {
          logger.generalError(errorMessage);
        }

        if (!this.options.force && reportError) {
          return Promise.reject({
            errorMessage: errorMessage,
            reportLogs: reportLogs
          });
        }

        return reportLogs;
      });
  }

}
