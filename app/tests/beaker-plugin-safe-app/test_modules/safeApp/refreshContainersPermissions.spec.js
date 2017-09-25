let should = require('should');
let testHelpers = require('../helpers');

describe('window.safeApp.refreshContainersPermissions', () => {
  // QUESTION: What is the purpose of refreshContainersPermissions?
  // I don't see any noticeable differnce before and after so I'm not sure how to test this.
  it.skip('refreshes container permissions', function() {
    return testHelpers.authoriseAndConnect()
    .then(appHandle => {
      return window.safeApp.getContainersPermissions(appHandle)
      .then(console.log)
      .then(() => window.safeApp.refreshContainersPermissions(appHandle))
      .then(() => window.safeApp.getContainersPermissions(appHandle))
      .then(console.log)
    })
  });

  it('exists', () => {
    should.exist(window.safeApp.refreshContainersPermissions);
  });
});
