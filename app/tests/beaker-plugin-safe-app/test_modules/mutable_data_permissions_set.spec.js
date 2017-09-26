let should = require('should');
let testHelpers = require('./helpers');

describe('window.safeMutableDataPermissionsSet', () => {
  // QUESTION: Please review the following statement. Is it accurate?
  it('sets allowable actions on a Mutable Data structure for an app (represented via the app\'s signing key)', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    const permissionsSetHandle = await window.safeMutableData.newPermissionSet(appHandle);
    await window.safeMutableDataPermissionsSet.setAllow(permissionsSetHandle, 'Insert');

    const mdHandle = await testHelpers.createMutableDataWithCustomPermissions(appHandle, ['ManagePermissions']);

    const mdVersion = await window.safeMutableData.getVersion(mdHandle);
    const appPubSignKeyHandle = await window.safeCrypto.getAppPubSignKey(appHandle);
    should(window.safeMutableData.setUserPermissions(mdHandle, appPubSignKeyHandle, permissionsSetHandle, mdVersion + 1))
    .be.fulfilled();
  });

  it('sets actions that will be denied for a given Mutable Data', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    const permissionsSetHandle = await window.safeMutableData.newPermissionSet(appHandle);
    await window.safeMutableDataPermissionsSet.setDeny(permissionsSetHandle, 'Insert');

    const mdHandle = await window.safeMutableData.newRandomPublic(appHandle, testHelpers.TAG_TYPE_DNS);
    await window.safeMutableData.quickSetup(mdHandle, {});

    const mdVersion = await window.safeMutableData.getVersion(mdHandle);
    const appPubSignKeyHandle = await window.safeCrypto.getAppPubSignKey(appHandle);
    should(window.safeMutableData.setUserPermissions(mdHandle, appPubSignKeyHandle, permissionsSetHandle, mdVersion + 1))
    .be.fulfilled();
  });

  it('clears permissions of a particular action', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    const permissionsSetHandle = await window.safeMutableData.newPermissionSet(appHandle);
    await window.safeMutableDataPermissionsSet.clear(permissionsSetHandle, 'Insert')

    const mdHandle = await window.safeMutableData.newRandomPublic(appHandle, testHelpers.TAG_TYPE_DNS);
    await window.safeMutableData.quickSetup(mdHandle, {});

    const mdVersion = await window.safeMutableData.getVersion(mdHandle);
    const appPubSignKeyHandle = await window.safeCrypto.getAppPubSignKey(appHandle);
    should(window.safeMutableData.setUserPermissions(mdHandle, appPubSignKeyHandle, permissionsSetHandle, mdVersion + 1))
    .be.fulfilled();
  });

  it('frees permsissions-set object from memory', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    const permissionsSetHandle = await window.safeMutableData.newPermissionSet(appHandle);
    window.safeMutableDataPermissionsSet.free(permissionsSetHandle);
    should(window.safeMutableDataPermissionsSet.setAllow(permissionsSetHandle, 'Insert'))
    .be.rejected();
  });
});
