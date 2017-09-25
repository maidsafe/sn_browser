let should = require('should');
let testHelpers = require('../helpers');

describe('window.safeApp.authoriseShareMd', () => {
  it.skip('can request permissions for a Mutable Data structure created by another app', function() {
    // TODO: Why skipped? Because of this issue: https://maidsafe.atlassian.net/browse/MAID-2316
    this.timeout(30000);

    return testHelpers.createUnownedMutableData()
    .then(nameAndTag => testHelpers.authoriseAndConnect().then(appHandle => ({appHandle, nameAndTag})))
    .then(({appHandle, nameAndTag}) => {
      const permissions = [
        {
          type_tag: nameAndTag.tag,
          name: nameAndTag.name.buffer,
          perms: ['Insert']
        }
      ];
      return window.safeApp.authoriseShareMd(appHandle, permissions)
    })
  });

  it('exists', () => {
    should.exist(window.safeApp.authoriseShareMd);
  });
});
