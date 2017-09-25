let should = require('should');
let testHelpers = require('../helpers');

describe('window.safeApp.canAccessContainer', () => {
  it('can confirm container access', function() {
    return testHelpers.authoriseAndConnect()
    .then(appHandle => window.safeApp.canAccessContainer(appHandle, "_public", ["Insert"]))
    .then(canAccessContainer => {
      canAccessContainer.should.be.true;
    })
  });

  it('exists', () => {
    should.exist(window.safeApp.canAccessContainer);
  });
});
