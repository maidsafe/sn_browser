let should = require('should');
let testHelpers = require('./helpers');

describe('window.safeNfsFile', () => {
  it('returns the file size', async () => {
    const nfsHandle = await testHelpers.createNfsEmulation();
    const fileHandle = await window.safeNfs.create(nfsHandle, 'Hello, SAFE world!');
    const fileSize = await window.safeNfsFile.size(fileHandle);
    should(fileSize).be.equal(18);
  });

  it('opens a new file', async () => {
    const nfsHandle = await testHelpers.createNfsEmulation();
    // NOTE: null is set as the 2nd argument to create an initial file
    should(window.safeNfs.open(nfsHandle, null, testHelpers.OPEN_MODE_OVERWRITE))
    .be.fulfilled();
  });

  it('writes to a new file and closes file to commit to network', async () => {
    const nfsHandle = await testHelpers.createNfsEmulation();
    // NOTE: null is set as the 2nd argument to create an initial file
    let fileHandle = await window.safeNfs.open(nfsHandle, null, testHelpers.OPEN_MODE_OVERWRITE);
    await window.safeNfsFile.write(fileHandle, 'Hello, SAFE world!');
    await window.safeNfsFile.close(fileHandle);

    fileHandle = await window.safeNfs.open(nfsHandle, fileHandle, testHelpers.OPEN_MODE_READ);
    const fileData = await window.safeNfsFile.read(fileHandle, testHelpers.FILE_READ_FROM_BEGIN, testHelpers.FILE_READ_TO_END);
    should(String.fromCharCode.apply(null, new Uint8Array(fileData)))
    .be.equal('Hello, SAFE world!');
  });

  it('returns metadata of a specified file', async () => {
    const nfsHandle = await testHelpers.createNfsEmulation();
    const fileHandle = await window.safeNfs.create(nfsHandle, 'Hello, SAFE world!');
    should(window.safeNfsFile.metadata(fileHandle)).be.fulfilled();
  });

  it('frees file object from memory', async () => {
    const nfsHandle = await testHelpers.createNfsEmulation();
    const fileHandle = await window.safeNfs.create(nfsHandle, 'Hello, SAFE world!');
    window.safeNfsFile.free(fileHandle);
    should(window.safeNfsFile.size(fileHandle)).be.rejected();
  });


});
