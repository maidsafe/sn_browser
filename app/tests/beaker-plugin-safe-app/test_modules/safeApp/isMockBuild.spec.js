let should = require('should');
let testHelpers = require('../helpers');

describe('window.safeApp.isMockBuild', () => {
  it('return true if underlyging library is compiled against mock-routing', async () => { 
    const appHandle = await testHelpers.authoriseAndConnect();
    
    should(await window.safeApp.isMockBuild(appHandle)).be.true;
  });

  it('exists', () => {
    should.exist(window.safeApp.isMockBuild);
  });
});
