/* @flow */
import _ from 'underscore';
import getElementPosition from '../helpers/getElementPosition';

type optionObject = {
  ignore: Array<string>,
  ignoreByDescription: Array,
  ignoreByElement: Array,
  ignoreByClass: Array,
  ignoreById: Array,
  reportLevelsArray: Array<string>
}

const ignoredCheck = (ignore: [], error: string): boolean => {
  if (!error) {
    return false;
  }

  return _.some(ignore, rule => error.startsWith(rule));
};

const ignoredCheckOther = (ignore: [], text: string): boolean => {
  return !!text && _.some(ignore, expression => {
    if (typeof expression === 'string') {
      return expression === text;
    }
    return expression.test(text);
  });
};

const buildMessage = (msg: string, fileContents: string,
  {ignore, ignoreByDescription, ignoreByElement, ignoreByClass, ignoreById,
  reportLevelsArray}: optionObject) => {
  const msgSplit = msg.split('|');
  let message;

  const ignored = ignoredCheck(ignore, msgSplit[1]) ||
    ignoredCheckOther(ignoreByDescription, msgSplit[2]) ||
    ignoredCheckOther(ignoreByElement, msgSplit[3]) ||
    ignoredCheckOther(ignoreByClass, msgSplit[4]) ||
    ignoredCheckOther(ignoreById, msgSplit[5]);

  if (ignored) {
    return message;
  }

  // Start the Logging if the the report level matches
  if (_.contains(reportLevelsArray, msgSplit[0])) {
    message = {
      heading: msgSplit[0],
      issue: msgSplit[1],
      description: msgSplit[2],
      position: getElementPosition(msgSplit[3], fileContents),
      element: {
        node: msgSplit[3],
        class: msgSplit[4],
        id: msgSplit[5]
      }
    };
  }

  // Return the message for reports
  return message;

};

export { buildMessage as default, ignoredCheck, ignoredCheckOther };
