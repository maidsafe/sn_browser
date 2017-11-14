let should = require('should');
let testHelpers = require('./helpers');

describe('window.safeMutableDataPermissions', () => {
  it('returns the number of permission-sets per unique signing key', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    const mdHandle = await window.safeMutableData.newRandomPublic(appHandle, testHelpers.TYPE_TAG_DNS);
    let permissionsHandle = await window.safeMutableData.newPermissions(appHandle);
    const entriesHandle = await window.safeMutableData.newEntries(appHandle);
    const appPubSignKeyHandle = await window.safeCrypto.getAppPubSignKey(appHandle);
    let permissionSet = ['ManagePermissions'];
    // Inserts the permission-set, which allows ManagePermissions actions, only for the specified signing key
    await window.safeMutableDataPermissions.insertPermissionsSet(permissionsHandle, appPubSignKeyHandle, permissionSet);
    await window.safeMutableData.put(mdHandle, permissionsHandle, entriesHandle);

    let permissionsLength = await window.safeMutableDataPermissions.len(permissionsHandle);
    should(permissionsLength).be.equal(1);

    permissionSet = ['Insert'];
    const mdVersion = await window.safeMutableData.getVersion(mdHandle);
    // // Inserts the permission-set, which allows Insert actions, for any user, since the 2nd argument is set to null
    await window.safeMutableData.setUserPermissions(mdHandle, null, permissionSet, mdVersion + 1)

    permissionsHandle = await window.safeMutableData.getPermissions(mdHandle);
    permissionsLength = await window.safeMutableDataPermissions.len(permissionsHandle);
    should(permissionsLength).be.equal(2);
  });

  it('retrieves a permission-set for a given signing key and returns handle', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    const mdHandle = await window.safeMutableData.newRandomPublic(appHandle, testHelpers.TYPE_TAG_DNS);
    await window.safeMutableData.quickSetup(mdHandle, {});
    const permissionsHandle = await window.safeMutableData.getPermissions(mdHandle);
    const appPubSignKeyHandle = await window.safeCrypto.getAppPubSignKey(appHandle);
    should(window.safeMutableDataPermissions.getPermissionsSet(permissionsHandle, appPubSignKeyHandle))
    .be.fulfilled();
  });

  it('inserts permission-set into permissions object', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    const mdHandle = await window.safeMutableData.newRandomPublic(appHandle, testHelpers.TYPE_TAG_DNS);
    const permissionsHandle = await window.safeMutableData.newPermissions(appHandle);
    const entriesHandle = await window.safeMutableData.newEntries(appHandle);
    const appPubSignKeyHandle = await window.safeCrypto.getAppPubSignKey(appHandle);
    const permissionSet = ['ManagePermissions'];

    // insertPermissionsSet is the highlighted function of this test
    // This is an example of it's usage within a practical context
    await window.safeMutableDataPermissions.insertPermissionsSet(permissionsHandle, appPubSignKeyHandle, permissionSet);

    should(window.safeMutableData.put(mdHandle, permissionsHandle, entriesHandle))
    .be.fulfilled();
  });

  it('iterates over permissions entries, executing a callback for each', async() => {
    const appHandle = await testHelpers.authoriseAndConnect();
    const mdHandle = await window.safeMutableData.newRandomPublic(appHandle, testHelpers.TYPE_TAG_DNS);
    let permissionsHandle = await window.safeMutableData.newPermissions(appHandle);
    const entriesHandle = await window.safeMutableData.newEntries(appHandle);
    const appPubSignKeyHandle = await window.safeCrypto.getAppPubSignKey(appHandle);
    let permissionSet = ['ManagePermissions'];
    await window.safeMutableDataPermissions.insertPermissionsSet(permissionsHandle, appPubSignKeyHandle, permissionSet);
    await window.safeMutableData.put(mdHandle, permissionsHandle, entriesHandle);
    permissionSet = ['Insert'];
    const mdVersion = await window.safeMutableData.getVersion(mdHandle);
    await window.safeMutableData.setUserPermissions(mdHandle, null, permissionSet, mdVersion + 1)
    permissionsHandle = await window.safeMutableData.getPermissions(mdHandle);
    const permissionsEntries = await window.safeMutableDataPermissions.listPermissionSets(permissionsHandle);
    should(permissionsEntries.length).be.equal(2);
  });
}).timeout(15000);
