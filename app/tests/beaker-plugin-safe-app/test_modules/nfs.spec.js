let should = require('should');
let testHelpers = require('./helpers');

describe('window.safeNfs', async () => {
  it('creates file and returns handle', async () => {
    const nfsHandle = await testHelpers.createNfsEmulation();
    // NOTE: the safeNfs create function is an abstraction, using\
    // safeNfsFile functions of open, write, and close to create a file
    const fileHandle = await window.safeNfs.create(nfsHandle, 'data content');
    should(fileHandle.length).be.equal(64);
  });

  it('inserts file into an underlying mutable data structure', async () => {
    const nfsHandle = await testHelpers.createNfsEmulation();
    const fileHandle = await window.safeNfs.create(nfsHandle, 'Hello, SAFE world!');
    should(window.safeNfs.insert(nfsHandle, fileHandle, 'index.html')).be.fulfilled();
  });

  it('fetches a file from an underlying mutable data structure', async () => {
    const nfsHandle = await testHelpers.createNfsEmulation();
    let fileHandle = await window.safeNfs.create(nfsHandle, 'Hello, SAFE world!');
    await window.safeNfs.insert(nfsHandle, fileHandle, 'index.html')
    should(window.safeNfs.fetch(nfsHandle, 'index.html')).be.fulfilled();
  });

  it('updates an existing file path with a new file', async () => {
    // NOTE: this is distinctly updating a mutable data entry, and not updating a file
    const nfsHandle = await testHelpers.createNfsEmulation();
    let fileHandle = await window.safeNfs.create(nfsHandle, 'Hello, SAFE world!');
    await window.safeNfs.insert(nfsHandle, fileHandle, 'index.html');
    const fileMeta = await window.safeNfsFile.metadata(fileHandle);
    fileHandle = await window.safeNfs.create(nfsHandle, 'Hello, SAFE world! I am a different file');
    await window.safeNfs.update(nfsHandle, fileHandle, 'index.html', fileMeta.version + 1);
    fileHandle = await window.safeNfs.fetch(nfsHandle, 'index.html');
    fileHandle = await window.safeNfs.open(nfsHandle, fileHandle, testHelpers.OPEN_MODE_READ);
    const fileData = await window.safeNfsFile.read(fileHandle, testHelpers.FILE_READ_FROM_BEGIN, testHelpers.FILE_READ_TO_END);
    await window.safeNfsFile.close(fileHandle);
    const humanReadable = String.fromCharCode.apply(null, new Uint8Array(fileData));
    should(humanReadable).be.equal('Hello, SAFE world! I am a different file');
  });

  it('removes a file entry from underlying mutable data', async () => {
    // NOTE: this function does not delete the file (underlying immutable data) from the network
    const nfsHandle = await testHelpers.createNfsEmulation();
    let fileHandle = await window.safeNfs.create(nfsHandle, 'Hello, SAFE world!');
    await window.safeNfs.insert(nfsHandle, fileHandle, 'index.html');
    const fileMeta = await window.safeNfsFile.metadata(fileHandle);
    await window.safeNfs.delete(nfsHandle, 'index.html', fileMeta.version + 1);
    should(window.safeNfs.fetch(nfsHandle, 'index.html')).be.rejected();
  });

  it('opens a file for use with safeNfsFile module, returns the same handle', async () => {
    const nfsHandle = await testHelpers.createNfsEmulation();
    let fileHandle = await window.safeNfs.create(nfsHandle, 'Hello, SAFE world!');
    let oldFileHandle = fileHandle;
    fileHandle = await window.safeNfs.open(nfsHandle, fileHandle, testHelpers.OPEN_MODE_READ);
    should(fileHandle).be.equal(oldFileHandle);
    should(window.safeNfsFile.read(fileHandle, testHelpers.FILE_READ_FROM_BEGIN, testHelpers.FILE_READ_TO_END))
    .be.fulfilled();
  });

  it('free nfs object from memory', async () => {
    const nfsHandle = await testHelpers.createNfsEmulation();
    window.safeNfs.free(nfsHandle);
    should(window.safeNfs.create(nfsHandle, 'Hello, SAFE world!')).be.rejected();
  });
});
