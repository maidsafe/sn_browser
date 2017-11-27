const { genHandle, getObj, replaceObj, freeObj } = require('../helpers');

module.exports.manifest = {
  create: 'promise',
  fetch: 'promise',
  insert: 'promise',
  update: 'promise',
  delete: 'promise',
  open: 'promise',
  free: 'sync'
};

/**
 * Create a new file with the given content, put the content
 * on the network via ImmutableData (public) and wrap it into a File.
 * @name window.safeNfs.create
 *
 * @param {NFSHandle} nfsHandle the NFS emulation handle
 * @param {(String|Buffer)} content
 *
 * @returns {Promise<FileHandle>} the File handle of a newly created file
 * */
module.exports.create = (nfsHandle, content) => getObj(nfsHandle)
    .then((obj) => obj.netObj.create(content)
      .then((file) => genHandle(obj.app, file)));

/**
 * Find the file of the given filename (aka keyName in the MutableData)
 * @name window.safeNfs.fetch
 *
 * @param {NFSHandle} nfsHandle the NFS emulation handle
 * @param {String} fileName - the path/file name
 *
 * @returns {Promise<FileHandle>} the handle of the File found for that path
 * */
module.exports.fetch = (nfsHandle, fileName) => getObj(nfsHandle)
    .then((obj) => obj.netObj.fetch(fileName)
      .then((file) => genHandle(obj.app, file)));

/**
 * Insert the given file into the underlying MutableData, directly commit
 * to the network.
 * @name window.safeNfs.insert
 *
 * @param {NFSHandle} nfsHandle the NFS emulation handle
 * @param {FileHandle} fileHandle the handle of the File to store
 * @param {(String|Buffer)} fileName the path to store the file under
 *
 * @returns {Promise<FileHandle>} the same File handle
 * */
module.exports.insert = (nfsHandle, fileHandle, fileName) => getObj(nfsHandle)
    .then((nfsObj) => getObj(fileHandle)
      .then((fileObj) => nfsObj.netObj.insert(fileName, fileObj.netObj))
    )
    .then(() => fileHandle);

/**
 * Replace a path with a new file. Directly commit to the network.
 * @name window.safeNfs.update
 *
 * @param {NFSHandle} nfsHandle the NFS emulation handle
 * @param {FileHandle} fileHandle the handle of the File to store
 * @param {(String|Buffer)} fileName - the path to store the file under
 * @param {Number} version the version successor, to ensure you
 *         are overwriting the right one
 * @returns {Promise<FileHandle>} the same File handle
 * */
module.exports.update = (nfsHandle, fileHandle, fileName, version) => getObj(nfsHandle)
    .then((nfsObj) => getObj(fileHandle)
      .then((fileObj) => nfsObj.netObj.update(fileName, fileObj.netObj, version))
    )
    .then(() => fileHandle);

/**
* Delete a file from path. Directly commit to the network.
* @name window.safeNfs.delete
*
* @param {NFSHandle} nfsHandle the NFS emulation handle
* @param {(String|Buffer)} fileName - the path to store the file under
* @param {Number} version the version successor, to ensure you
*        are overwriting the right one
* @returns {Promise}
* */
module.exports.delete = (nfsHandle, fileName, version) => getObj(nfsHandle)
    .then((nfsObj) => nfsObj.netObj.delete(fileName, version));

/**
 * Open a file for reading or writing.
 * A new File handle is returned if the handle passed in is null, otherwise
 * the File handle provided is returned.
 *
 * Open Modes:
 *
 *  1 = Replaces the entire content of the file when writing data.
 *
 *  2 = Appends to existing data in the file.
 *
 *  4 = Open file to read.
 *
 * @name window.safeNfs.open
 *
 * @param {NFSHandle} nfsHandle the NFS emulation handle
 * @param {FileHandle|null} fileHandle the handle of the File to open, if null
 * a new file is created
 * @param {Number} openMode the mode for opening the file
 *
 * @returns {Promise<FileHandle>} a File handle. A new handle is returned if the
 * handle passed in is null, otherwise the File handle provided is returned
 * */
module.exports.open = (nfsHandle, fileHandle, openMode) => getObj(nfsHandle)
    .then((nfsObj) => getObj(fileHandle, true)
      .then((fileObj) => nfsObj.netObj.open(fileObj.netObj, openMode))
      .then((file) => {
        if (fileHandle) {
          return replaceObj(fileHandle, nfsObj.app, file);
        }
        return genHandle(nfsObj.app, file);
      })
    );

/**
 * Free the NFS emulation instance from memory
 * @name window.safeNfs.free
 *
 * @param {NFSHandle} nfsHandle the NFS emulation handle
*/
module.exports.free = (nfsHandle) => freeObj(nfsHandle);

/**
 * @name NFSHandle
 * @typedef {String} NFSHandle
 * @description Holds the reference to a NFS emulation instance.
 * Note that it is required to free the memory used by such an instance when it's
 * not needed anymore by the client aplication, please refer to the `free` function.
 */
