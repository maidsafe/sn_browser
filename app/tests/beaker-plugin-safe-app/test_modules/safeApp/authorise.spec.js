let should = require('should');
let testHelpers = require('../helpers');

const permissions = {
    _public: ['Read', 'Insert', 'Update', 'Delete', 'ManagePermissions'],
    _publicNames: ['Read', 'Insert', 'Update', 'Delete', 'ManagePermissions']
}

const ownContainer =  { own_container: true };

describe('window.safeApp.authorise', () => {
  it('authorises application and return some authentication uri', async function() {
    this.timeout(30000);
    const appHandle = await testHelpers.initialiseApp();
    const authUri = await testHelpers.authoriseApp(appHandle);
    should(authUri).startWith('safe-')
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
    const authUri = await window.safeApp.authorise(appHandle, misspelledPermissions, ownContainer);
    await window.safeApp.connectAuthorised(appHandle, authUri);
    const permObjects = await window.safeApp.getContainersPermissions(appHandle);
    should(permObjects._public['ManagePermissions']).be.false();
    should(permObjects._publicNames['Insert']).be.false();
  });
});
