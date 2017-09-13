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

  // it('fetches an existing immutable data from the network', () => {
  //
  // })

  it('reads contents of immutable data', () => {
    return testHelpers.authoriseAndConnect()
    .then(appHandle => window.safeImmutableData.create(appHandle)
      .then(writerHandle => window.safeImmutableData.write(writerHandle, 'immutable data content')
        .then(() => window.safeCipherOpt.newPlainText(appHandle))
        .then((cipherOptHandle) => window.safeImmutableData.closeWriter(appHandle, writerHandle))
      )
    )
    .then(idAddress => window.safeImmutableData.fetch(idAddress))
    .then(readerHandle => window.safeImmutableData.read(readerHandle))
    .then(console.log)
  })
});
