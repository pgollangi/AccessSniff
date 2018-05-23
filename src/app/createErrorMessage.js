/* @flow */

type issueObject = {
  error: number,
  warning: number,
  notice: number
}

const CreateErrorMessage = (issueCount: issueObject): string => {
  const { error, warning, notice } = issueCount;
  let errorString = error === 1 ? 'error' : 'errors';
  let warningString = warning === 1 ? 'warning' : 'warnings';
  let noticeString = notice === 1 ? 'notice' : 'notices';
  return `There were ${error} ${errorString}, ${warning} ${warningString} and ${notice} ${noticeString}`;
};

export { CreateErrorMessage as default };
