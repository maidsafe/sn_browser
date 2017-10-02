let should = require('should');
let testHelpers = require('../helpers');

describe('window.safeApp.isRegistered', () => {
  it('confirms if app is registered with network', function() {
    return testHelpers.authoriseAndConnect()
    .then(appHandle => {
      should(window.safeApp.isRegistered(appHandle)).be.true;
    })
  });

  it('exists', () => {
    should.exist(window.safeApp.isRegistered);
  });
});
