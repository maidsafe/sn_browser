let should = require('should');
let testHelpers = require('../helpers');

describe('window.safeApp.refreshContainersPermissions', () => {
  it('refreshes container permissions', async function() {
    this.timeout(30000);
    const permissions = {
        _public: ['Read', 'Insert', 'Update', 'Delete', 'ManagePermissions']
    }

    const appInfo = {
        id: `random net.maidsafe.beaker_plugin_safe_app.test${Math.round(Math.random() * 100000)}`,
        name: `random beaker_plugin_safe_app_test${Math.round(Math.random() * 100000)}`,
        vendor: 'MaidSafe Ltd.'
    };
    const appHandle = await window.safeApp.initialise(appInfo);
    const authUri = await window.safeApp.authorise(appHandle, permissions, {});
    await window.safeApp.connectAuthorised(appHandle, authUri);

    await window.safeApp.refreshContainersPermissions(appHandle);

    const containerHandle = await window.safeApp.getContainer(appHandle, '_public');
    let permsObject = await window.safeApp.getContainersPermissions(appHandle);
    should.not.exist(permsObject['_publicNames']);

    const updatePermissions = {
        _publicNames: ['Read', 'Insert', 'Update', 'Delete', 'ManagePermissions']
    }

    await window.safeApp.authoriseContainer(appHandle, updatePermissions);
    await window.safeApp.refreshContainersPermissions(appHandle);

    permsObject = await window.safeApp.getContainersPermissions(appHandle);
    should.exist(permsObject['_publicNames']);
  });

  it('exists', () => {
    should.exist(window.safeApp.refreshContainersPermissions);
  });
});
