let should = require('should');
let testHelpers = require('../helpers');

describe('window.safeApp.connect', () => {
  it('connects an unauthorised app to an unregistered session on the network', () => {
    return testHelpers.initialiseApp()
      .then(appHandle => {
        window.safeApp.connect(appHandle).should.be.fulfilled();
      })
  });

  it('exists', () => {
    should.exist(window.safeApp.connect);
  });
});
