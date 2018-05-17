import { ignoredCheck, ignoredCheckOther } from './buildMessage';

const Tests = {
  setUp: done => {
    done();
  },
  isRuleIgnored: test => {
    const ignored = [
      'WCAG2AA.Principle4.Guideline4_1.4_1_1.F77',
      'WCAG2AA.Principle1.Guideline1_4.1_4_3.G145.Fail',
      'WCAG2AA.Principle1.Guideline1_4.1_4_3.G18'
    ];

    let checkedRule;

    checkedRule= ignoredCheck(ignored, 'WCAG2AA.Principle1.Guideline1_4.1_4_3.G18');
    test.ok(checkedRule === true);

    checkedRule = ignoredCheck(ignored, 'WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.BgImage');
    test.ok(checkedRule === true);

    checkedRule = ignoredCheck(ignored, 'WCAG2A.Principle1.Guideline1_1.1_1_1.H2.EG3');
    test.ok(checkedRule === false);

    checkedRule = ignoredCheck(ignored, undefined);
    test.ok(checkedRule === false);

    test.expect(4);
    test.done();
  },
  isRuleIgnoredByOther: test => {
    const ignored = [
      'This form field should be labelled in some way. Use the label element ' +
      '(either with a "for" attribute or wrapped around the form field), or ' +
      '"title", "aria-label" or "aria-labelledby" attributes as appropriate.',
      /^This element has a role of "\w+" but does not have a name available to an accessibility API\. Valid names are: [^.]+\.$/
    ];

    let checkedRule;

    checkedRule = ignoredCheckOther(ignored,
      'This form field should be labelled in some way. Use the label element ' +
      '(either with a "for" attribute or wrapped around the form field), or ' +
      '"title", "aria-label" or "aria-labelledby" attributes as appropriate.');
    test.ok(checkedRule === true);

    checkedRule = ignoredCheckOther(ignored,
      'This element has a role of "button" but does not have a name available ' +
      'to an accessibility API. Valid names are: element content.');
    test.ok(checkedRule === true);

    test.expect(2);
    test.done();
  }
};

export { Tests as default };
