let should = require('should');
let testHelpers = require('../helpers');

describe('window.safeApp.authorise', () => {
  it('authorises application and return some authentication uri', async () => {
    const appHandle = await testHelpers.initialiseApp();
    should(testHelpers.authoriseApp(appHandle)).be.fulfilled();
  });

  it('exists', () => {
    should.exist(window.safeApp.authorise);
  });

  it('denies misspelled permission actions', async () => {
    const misspelledPermissions = {
        _public: ['Read', 'Insert', 'Update', 'Delete', 'ManagePermisions'],
        _publicNames: ['Read', 'Inserts', 'Update', 'Delete', 'ManagePermissions']
    };

    const appInfo = {
        id: `random net.maidsafe.beaker_plugin_safe_app.test${Math.round(Math.random() * 100000)}`,
        name: `random beaker_plugin_safe_app_test${Math.round(Math.random() * 100000)}`,
        vendor: 'MaidSafe Ltd.'
    };
    const appHandle = await window.safeApp.initialise(appInfo);
    should(window.safeApp.authorise(appHandle, misspelledPermissions, {})).be.rejected();
  });
}).timeout(15000);
