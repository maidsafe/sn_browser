let should = require('should');
let testHelpers = require('../helpers');

describe('window.safeApp.connectAuthorised', () => {
  it('connects an authorised app to a registered session on the network', () => {
    testHelpers.authoriseAndConnect().should.be.fulfilled();
  });

  it('exists', () => {
    should.exist(window.safeApp.connectAuthorised);
  });
});
