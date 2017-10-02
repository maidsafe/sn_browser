let should = require('should');
let testHelpers = require('../helpers');

describe('window.safeApp.initialise', () => {
  it('initialises application', () => {
      testHelpers.initialiseApp().should.be.fulfilled();
  });

  it('initialises and returns appHandle as a 64 character string', () => {
      return testHelpers.initialiseApp().then(appHandle => {
        should(appHandle.length).equal(64);
      })
  });

  it('should throw informative error, if App info is missing', () => {
    const malformedAppInfo = {
      id: 'net.maidsafe.test.javascript.id',
      named: 'JS Test'
    };

    should.throws(window.safeApp.initialise(malformedAppInfo));
  });

  it('should throw informative error, if App properties, excepting scope, are empty', () => {
    const malformedAppInfo = {
      id: 'net.maidsafe.test.javascript.id',
      name: 'JS Test',
      vendor: ' ',
      scope: null
    };

    should.throws(window.safeApp.initialise(malformedAppInfo));
  });

  it('should throw informative error, if appInfo structure is malformed', () => {
    const malformedAppInfo = {
      info: {
        id: 'net.maidsafe.test.javascript.id',
        name: 'JS Test',
        vendor: 'vendor value',
        scope: null
      }
    };

    should.throws(window.safeApp.initialise(malformedAppInfo));
  });

  it('should build an alternative if there is a scope', async function () {
    this.timeout(30000);

    let appHandle = await testHelpers.initialiseApp();
    const firstAuthUri = await testHelpers.authoriseApp(appHandle);
    appHandle = await testHelpers.initialiseApp(null, 'website')
    const secondAuthUri = await testHelpers.authoriseApp(appHandle);

    firstAuthUri.should.not.equal(secondAuthUri)
  });

  it('exists', async () => {
    should.exist(window.safeApp.initialise);
  });
});
