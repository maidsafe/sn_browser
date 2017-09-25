let should = require('should');
let testHelpers = require('../helpers');

describe('window.safeApp.logPath', () => {
  it('returns core client library log path as string', function() {
    return testHelpers.authoriseAndConnect()
    .then(appHandle => window.safeApp.logPath(appHandle))
    .then(logPath => {
      should(typeof logPath).equal("string");
    })
  });

  it('exists', () => {
    should.exist(window.safeApp.logPath);
  });
});
