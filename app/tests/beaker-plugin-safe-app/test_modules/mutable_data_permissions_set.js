let should = require('should');
let testHelpers = require('./helpers');

describe('window.safeMutableDataPermissionsSet', () => {
  // QUESTION: Please review the following statement. Is it accurate?
  it('sets allowable actions on a Mutable Data structure by an app, represented by the app\'s signing key', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    const permissionsSetHandle = await window.safeMutableData.newPermissionSet(appHandle);
    should(window.safeMutableDataPermissionsSet.setAllow(permissionsSetHandle, 'Insert'))
    .be.fulfilled();
  });

  it('sets actions that will be denied for a given Mutable Data', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    const permissionsSetHandle = await window.safeMutableData.newPermissionSet(appHandle);
    should(window.safeMutableDataPermissionsSet.setDeny(permissionsSetHandle, 'Insert'))
    .be.fulfilled();
  });

  it('clears permissions of a particular action', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    const permissionsSetHandle = await window.safeMutableData.newPermissionSet(appHandle);
    should(window.safeMutableDataPermissionsSet.clear(permissionsSetHandle, 'Insert'))
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
