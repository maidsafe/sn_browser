let should = require('should');
let testHelpers = require('../helpers');

describe('window.safeApp.free', () => {
  it('frees app object from memory', function() {
    return testHelpers.authoriseAndConnect()
    .then(appHandle => {
      window.safeApp.free(appHandle)
      should(window.safeApp.connect(appHandle)).be.rejected();
    });
  });

  it('exists', () => {
    should.exist(window.safeApp.free);
  });
});
