let should = require('should');
let testHelpers = require('../helpers');

describe('window.safeApp.getContainersPermissions', () => {

  it('returns a JSON object list of app permissions', function() {
    return testHelpers.authoriseAndConnect()
    .then(appHandle => {
      should(window.safeApp.getContainersPermissions(appHandle)).be.fulfilled();
    })
  });

  it('requests further container permissions', async function() {
    this.timeout(30000);
    const permissions = {
      _videos: ['Read', 'Insert', 'Update']
    };

    const appHandle = await testHelpers.authoriseAndConnect();
    await window.safeApp.authoriseContainer(appHandle, permissions);
    const permsObject = await window.safeApp.getContainersPermissions(appHandle);

    should(permsObject).have.property("_videos");
    should(permsObject._videos).have.property("Read", true);
    should(permsObject._videos).have.property("Insert", true);
    should(permsObject._videos).have.property("Update", true);
    should(permsObject._videos).have.property("Delete", false);
    should(permsObject._videos).have.property("ManagePermissions", false);
  });

  it('exists', () => {
    should.exist(window.safeApp.getContainersPermissions);
  });
});
