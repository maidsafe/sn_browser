let should = require('should');
let testHelpers = require('../helpers');

describe('window.safeApp.refreshContainersPermissions', () => {
  // QUESTION: What is the purpose of refreshContainersPermissions?
  // I don't see any noticeable differnce before and after so I'm not sure how to test this.
  it.skip('refreshes container permissions', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    let permsObject = await window.safeApp.getContainersPermissions(appHandle);
    console.log(permsObject);
    const containerHandle = await window.safeApp.getContainer(appHandle, '_public');
    const appPubSignKeyHandle = await window.safeCrypto.getAppPubSignKey(appHandle);
    const permissionsSetHandle = await window.safeMutableData.getUserPermissions(containerHandle, appPubSignKeyHandle);
    await window.safeMutableDataPermissionsSet.setDeny(permissionsSetHandle, 'Insert');
    const mdVersion = await window.safeMutableData.getVersion(containerHandle);

    await window.safeMutableData.setUserPermissions(containerHandle, appPubSignKeyHandle, permissionsSetHandle, mdVersion + 1);
    await window.safeApp.refreshContainersPermissions(appHandle);
    permsObject = await window.safeApp.getContainersPermissions(appHandle);
    console.log(permsObject);
  });

  it('exists', () => {
    should.exist(window.safeApp.refreshContainersPermissions);
  });
});
