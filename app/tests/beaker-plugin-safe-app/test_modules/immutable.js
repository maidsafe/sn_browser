let should = require('should');
let testHelpers = require('./helpers');

describe('window.safeImmutableData', () => {
  it('creates an immutable data writer', () => {
    return testHelpers.authoriseAndConnect()
    .then(appHandle => window.safeImmutableData.create(appHandle))
    .then(writerHandle => {
      should(writerHandle.length).be.equal(64);
    })
  });
});
