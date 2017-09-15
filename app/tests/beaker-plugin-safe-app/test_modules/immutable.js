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

  it('writes to immutable data, closes it, and reads contents of immutable data', () => {
    return testHelpers.authoriseAndConnect()
    .then(appHandle => window.safeImmutableData.create(appHandle)
      .then(writerHandle => window.safeImmutableData.write(writerHandle, 'immutable data content')
        .then(() => window.safeCipherOpt.newPlainText(appHandle))
        .then((cipherOptHandle) => window.safeImmutableData.closeWriter(writerHandle, cipherOptHandle))
      )
      .then(idAddress => window.safeImmutableData.fetch(appHandle, idAddress))
      .then(readerHandle => window.safeImmutableData.read(readerHandle))
      .then((buffer) => {
        should(String.fromCharCode.apply(null, new Uint8Array(buffer))).be.equal('immutable data content');
      })
    )
  })
});
