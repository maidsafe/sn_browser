let should = require('should');
let testHelpers = require('../helpers');

describe('window.safeApp.getOwnContainer', () => {
  it('returns Mutable Data handle to root container of app', function() {
    return testHelpers.authoriseAndConnect()
    .then(appHandle => window.safeApp.getOwnContainer(appHandle))
    .then(mdHandle => {
      should(mdHandle.length).equal(64);
    })
  });

  it('exists', () => {
    should.exist(window.safeApp.getOwnContainer);
  });
});
