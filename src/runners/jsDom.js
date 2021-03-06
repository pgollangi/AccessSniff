import fs from 'fs';
import path from 'path';
import { JSDOM, VirtualConsole } from 'jsdom';
import Promise from 'bluebird';
import validator from 'validator';

const scriptPath = path.join(__dirname, '../HTMLCS.min.js');

const RunJsDomInstance = (file, accessibilityLevel) => {
  return new Promise((resolve, reject) => {
    const htmlcs = fs.readFileSync(scriptPath, { encoding: 'utf-8' });
    let promise;
    let messages = [];
    const vConsole = new VirtualConsole();
    const jsDomOptions = {
      resources: 'usable',
      runScripts: 'dangerously',
      virtualConsole: vConsole
    };

    vConsole.on('log', (message) => {
      if (message === 'done') {
        resolve(messages);
      } else {
        messages.push([accessibilityLevel, message]);
      }
    });

    if (validator.isURL(file)) {
      promise = JSDOM.fromURL(file, jsDomOptions);
    } else if (fs.existsSync(file)) {
      promise = JSDOM.fromFile(file, jsDomOptions);
    } else {
      promise = Promise.resolve(new JSDOM(file, jsDomOptions));
    }

    promise.then(dom => {
      var script = dom.window.document.createElement('script');
      script.textContent = htmlcs;
      dom.window.document.head.appendChild(script);
      return new Promise((resolve, reject) => {
        var counter = 0;
        var interval = dom.window.setInterval(() => {
          if (dom.window.HTMLCS_RUNNER) {
            dom.window.clearInterval(interval);
            dom.window.HTMLCS_RUNNER.run(accessibilityLevel);
            resolve();
          }
          if (++counter > 5 * 10) {
            dom.window.clearInterval(interval);
            reject(new Error('Waiting for HTML_CodeSniffer timed out.'));
          }
        }, 200);
      });
    }, reject);
  });
};

export { RunJsDomInstance as default };
