let should = require('should');
let testHelpers = require('../helpers');

describe('window.safeApp.networkState', () => {
  it('returns network state', function() {
    return testHelpers.authoriseAndConnect()
    .then(appHandle => window.safeApp.networkState(appHandle))
    .then(networkState => {
      networkState.should.be.equal('Connected');
    })
  });

  it('exists', () => {
    should.exist(window.safeApp.networkState);
  });
});
