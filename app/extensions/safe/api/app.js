const safeApp = require('@maidsafe/safe-node-app');
const ipc = require('./ipc');
const { genHandle, getObj, freeObj, freeAllNetObj, netStateCallbackHelper } = require('./helpers');

/* eslint no-underscore-dangle: ["error", { "allow": ["_with_async_cb_initialise"] }] */

module.exports.manifest = {
  _with_async_cb_initialise: 'readable',
  connect: 'promise',
  authorise: 'promise',
  connectAuthorised: 'promise',
  authoriseContainer: 'promise',
  authoriseShareMd: 'promise',
  webFetch: 'promise',
  networkState: 'promise',
  isNetStateInit: 'sync',
  isNetStateConnected: 'sync',
  isNetStateDisconnected: 'sync',
  isRegistered: 'promise',
  clearObjectCache: 'promise',
  isMockBuild: 'promise',
  canAccessContainer: 'promise',
  refreshContainersPermissions: 'promise',
  getContainersPermissions: 'promise',
  getOwnContainer: 'promise',
  getContainer: 'promise',
  reconnect: 'promise',
  logPath: 'promise',
  free: 'sync'
};

/**
 * Create a new SAFEApp instance without a connection to the network
 * @name window.safeApp.initialise
 *
 * @param {AppInfo} appInfo
 * @param {Function} [networkStateCallback=null] optional callback function
 * to receive network state updates after a unregistered/registered
 * connection is made with `connect`/`connectAuthorised` functions.
 * @param {Boolean} enableLog specifies whether or not to enable backend logs. Defaults to false
 * @returns {Promise<SAFEAppHandle>} new app instance handle
 *
 * @example
 * window.safeApp.initialise({
 *       id: 'net.maidsafe.test.webapp.id',
 *       name: 'WebApp Test',
 *       vendor: 'MaidSafe Ltd.'
 *    }, (newState) => {
 *       console.log("Network state changed to: ", newState);
 *    })
 *    .then((appHandle) => {
 *       console.log('SAFEApp instance initialised and handle returned: ', appHandle);
 *    });
 */
module.exports._with_async_cb_initialise = (appInfo, enableLog, safeAppGroupId) => { // eslint-disable-line no-underscore-dangle, max-len
  const appInfoCopy = Object.assign({}, appInfo);
  if (this && this.sender) {
    const wholeUrl = this.sender.getURL();
    appInfoCopy.scope = wholeUrl;
  } else {
    appInfoCopy.scope = null;
  }
  return netStateCallbackHelper(safeApp, appInfoCopy, enableLog || false, safeAppGroupId);
};

/**
 * Create a new, unregistered session (read-only),
 * e.g. useful for browsing web sites or just publicly available data.
 * @name window.safeApp.connect
 *
 * @param {SAFEAppHandle} appHandle the app handle
 *
 * @returns {Promise<SAFEAppHandle>} same app handle
 *
 * @example
 * window.safeApp.initialise({
 *    id: 'net.maidsafe.test.webapp.id',
 *    name: 'WebApp Test',
 *    vendor: 'MaidSafe Ltd.'
 * })
 * .then((appHandle) => window.safeApp.connect(appHandle))
 * .then(_ => {
 *    console.log('Unregistered session created');
 * });
 */
module.exports.connect = (appHandle) => new Promise((resolve, reject) => {
  getObj(appHandle)
      .then((obj) => obj.app.auth.genConnUri()
        .then((connReq) => ipc.sendAuthReq(connReq, true, (err, res) => {
          if (err) {
            return reject(new Error('Unable to get connection information: ', err));
          }
          return obj.app.auth.loginFromURI(res)
            .then(() => resolve(appHandle))
            .catch(reject);
        })))
      .catch(reject);
});

/**
 * Request the Authenticator (and user) to authorise this application
 * with the given permissions and optional parameters.
 * @name window.safeApp.authorise
 *
 * @param {SAFEAppHandle} appHandle the app handle
 * @param {Object} permissions mapping the container-names
 *                  to a list of permissions you want to
 *                  request
 * @param {Object} options optional parameters
 * @param {Boolean} [options.own_container=false] whether or not to request
 *    our own container to be created for the app.
 *
 * @returns {Promise<AuthURI>} auth granted `safe-://`-URI
 *
 * @example // Example of authorising an app:
 * window.safeApp.authorise(
 *    appHandle, // the app handle obtained when invoking `initialise`
 *    {
 *      _public: ['Insert'], // request to insert into `_public` container
 *      _other: ['Insert', 'Update'] // request to insert and update in `_other` container
 *    },
 *    {own_container: true} // and we want our own container, too
 * ).then((authUri) => {
 *    console.log('App was authorised and auth URI received: ', authUri);
 * });
 */
module.exports.authorise = (appHandle, permissions, options) => new Promise((resolve, reject) => {
  getObj(appHandle)
      .then((obj) => obj.app.auth.genAuthUri(permissions, options)
        .then((authReq) => ipc.sendAuthReq(authReq, false, (err, res) => {
          if (err) {
            return reject(new Error('Unable to authorise the application: ', err));
          }
          return resolve(res);
        })))
      .catch(reject);
});

/**
 * Create a new, registered Session (read-write)
 * If you have received a response URI (which you are allowed
 * to store securely), you can directly get an authenticated app
 * by using this helper function. Just provide said URI as the
 * second value.
 * @name window.safeApp.connectAuthorised
 *
 * @param {SAFEAppHandle} appHandle the app handle
 * @param {AuthURI} authUri granted auth URI
 *
 * @returns {Promise<SAFEAppHandle>} same app handle
 *
 * @example // Example of creating a registered session:
 * window.safeApp.authorise(
 *    appHandle, // the app handle obtained when invoking `initialise`
 *    {
 *      _public: ['Insert'], // request to insert into `_public` container
 *      _other: ['Insert', 'Update'] // request to insert and update in `_other` container
 *    },
 *    {own_container: true} // and we want our own container, too
 * )
 * .then((authUri) => window.safeApp.connectAuthorised(appHandle, authUri))
 * .then(_ => {
 *    console.log('The app was authorised & a session was created with the network');
 * });
 */
module.exports.connectAuthorised = (appHandle, authUri) => getObj(appHandle)
    .then((obj) => obj.app.auth.loginFromURI(authUri))
    .then(() => appHandle);

/**
 * Request the Authenticator (and user) to authorise this application
 * with further continer permissions.
 * @name window.safeApp.authoriseContainer
 *
 * @param {SAFEAppHandle} appHandle the app handle
 * @param {Object} permissions mapping container name to list of permissions
 *
 * @returns {Promise<AuthURI>} auth granted `safe-://`-URI
 *
 * @example // Requesting further container authorisation:
 * window.safeApp.authoriseContainer(
 *   appHandle, // the app handle obtained when invoking `initialise`
 *   { _publicNames: ['Update'] } // request to update into `_publicNames` container
 * ).then((authUri) => {
 *    console.log('App was authorised and auth URI received: ', authUri);
 * });
 */
module.exports.authoriseContainer = (appHandle, permissions) => new Promise((resolve, reject) => {
  getObj(appHandle)
      .then((obj) => obj.app.auth.genContainerAuthUri(permissions)
        .then((authReq) => ipc.sendAuthReq(authReq, false, (err, res) => {
          if (err) {
            return reject(new Error('Unable to authorise the application: ', err)); // TODO send Error in specific
          }
          return resolve(res);
        })))
      .catch(reject);
});

/**
 * Request the Authenticator (and user) to authorise this application
 * with specific mutation permissions for a MutableData.
 * @name window.safeApp.authoriseShareMd
 *
 * @param {SAFEAppHandle} appHandle the app handle
 * @param {[Object]} permissions list of permissions
 *
 * @returns {Promise<AuthURI>} auth granted `safe-://`-URI
 *
 * @example // example of requesting permissions for a couple of MutableData's:
 * window.safeApp.authoriseShareMd(
 *   appHandle, // the app handle obtained when invoking `initialise`
 *   [
 *    { type_tag: 15001,   // request for MD with tag 15001
 *      name: 'XoRname1',  // request for MD located at address 'XoRname1'
 *      perms: ['Insert'], // request for inserting into the referenced MD
 *    },
 *    { type_tag: 15020,   // request for MD with tag 15020
 *      name: 'XoRname2',  // request for MD located at address 'XoRname2'
 *      perms: ['Insert', `Update`], // request for updating and inserting into the referenced MD
 *    }
 *   ]
 * )
 */
module.exports.authoriseShareMd = (appHandle, permissions) => new Promise((resolve, reject) => {
  getObj(appHandle)
      .then((obj) => obj.app.auth.genShareMDataUri(permissions)
        .then((authReq) => ipc.sendAuthReq(authReq, false, (err, res) => {
          if (err) {
            return reject(new Error('Unable to authorise the application: ', err)); // TODO send Error in specific
          }
          return resolve(res);
        })))
      .catch(reject);
});

/**
 * Lookup a given `safe://...` URL in accordance with the
 * convention and fetch the requested object.
 * @name window.safeApp.webFetch
 *
 * @param {SAFEAppHandle} appHandle the app handle
 * @param {String} url url to fetch
 *
 * @returns {Promise<File>} the file object found for that URL
 *
 * @example // Retrieving a web page:
 * window.safeApp.webFetch(
 *   appHandle, // the app handle obtained when invoking `initialise`
 *   'safe://servicename.publicid' // the SAFE Network URL
 * )
 * .then((data) => {
 *    console.log('Web page content retrieved: ', data.toString());
 * });
 */
module.exports.webFetch = (appHandle, url) => getObj(appHandle)
    .then((obj) => obj.app.webFetch(url));

/**
 * Whether or not this is a registered/authenticated session.
 * @name window.safeApp.isRegistered
 *
 * @param {SAFEAppHandle} appHandle the app handle
 *
 * @returns {Boolean} true if this is an authenticated session
 *
 * @example // Checking if app is registered:
 * window.safeApp.isRegistered(appHandle)
 *    .then((r) => console.log('Is app registered?: ', r));
 */
module.exports.isRegistered = (appHandle) => getObj(appHandle)
    .then((obj) => obj.app.auth.registered);

/**
 * Current network connection state, e.g. `Connected` or `Disconnected`.
 * @name window.safeApp.networkState
 *
 * @param {SAFEAppHandle} appHandle the app handle
 *
 * @returns {String} network state
 *
 * @example // Checking network connection state:
 * window.safeApp.networkState(appHandle)
 *    .then((s) => console.log('Current network state: ', s));
 */
module.exports.networkState = (appHandle) => getObj(appHandle)
    .then((obj) => obj.app.networkState);

/**
 * Verify whether or not network state is INIT.
 * @name window.safeApp.isNetStateInit
 *
 * @param {SAFEAppHandle} appHandle
 *
 * @returns {Boolean}
 *
 * @example // Checking if app's network state is INIT
 * window.safeApp.isNetStateInit(appHandle)
 *   .then((s) => console.log('Is app in initialised network state? ', s));
 */
module.exports.isNetStateInit = (appHandle) => getObj(appHandle)
  .then((obj) => obj.app.isNetStateInit());

/**
 * Verify whether or not network state is CONNECTED
 * @name window.safeApp.isNetStateConnected
 *
 * @param {SAFEAppHandle} appHandle
 *
 * @returns {Boolean}
 *
 * @example // Checking if app's network state is CONNECTED
 * window.safeApp.isNetStateConnected(appHandle)
 *   .then((s) => console.log('Is app in connected network state? ', s));
 * */
module.exports.isNetStateConnected = (appHandle) => getObj(appHandle)
  .then((obj) => obj.app.isNetStateConnected());

/**
 * Verify whether or not network state is DISCONNECTED
 * @name window.safeApp.isNetStateDisconnected
 *
 * @param {SAFEAppHandle} appHandle
 *
 * @returns {Boolean}
 *
 * @example // Checking if app's network state is DISCONNECTED
 * window.safeApp.isNetStateDisconnected(appHandle)
 *   .then((s) => console.log('Is app in disconnected network state? ', s));
 * */
module.exports.isNetStateDisconnected = (appHandle) => getObj(appHandle)
  .then((obj) => obj.app.isNetStateDisconnected());

/**
 * Resets the object cache kept by the underlyging library
 * @name window.safeApp.clearObjectCache
 *
 * @param {SAFEAppHandle} appHandle
 *
 * @returns {Boolean}
 *
 * @example // Resets native object cache as well as front-end object handles except for SAFEApp
 * window.safeApp.clearObjectCache(appHandle)
 *   .then(() => {
 *     console.log('All network objects dropped');
 *     console.log(appHandle, ' still valid.');
 *     window.safeApp.isRegistered(appHandle)
 *     .then((res) => {
 *       console.log(`Successful fulfillment verifies that ${appHandle} is still valid. `, res);
 *     });
 *   });
 * */
module.exports.clearObjectCache = (appHandle) => getObj(appHandle)
  .then((obj) => obj.app.clearObjectCache())
  .then(() => freeAllNetObj(appHandle));

/**
 * Retuns true if the underlyging library was compiled against mock-routing.
 * @name window.safeApp.isMockBuild
 *
 * @param {SAFEAppHandle} appHandle
 *
 * @returns {Boolean}
 *
 * @example // Checking is underlying library is mock build
 * window.safeApp.isMockBuild(appHandle)
 * .then((bool) => {
 *  console.log('Was underlying safe_app library built for mock development? ', bool);
 * });
 * */
module.exports.isMockBuild = (appHandle) => getObj(appHandle)
  .then((obj) => obj.app.isMockBuild());

/**
 * Whether or not this session has specifc permission access of a given
 * container.
 * @name window.safeApp.canAccessContainer
 *
 * @param {SAFEAppHandle} appHandle the app handle
 * @param {String} name name of the container, e.g. `_public`
 * @param {(String|Array<String>)} [permissions=['Read']] permissions to check for
 *
 * @returns {Promise<Boolean>} true if this app can access the container with given permissions
 *
 * @example // Checking if the app has 'Read' permission for the '_public' container:
 * window.safeApp.canAccessContainer(appHandle, '_public', ['Read'])
 *    .then((r) => console.log('Has the app `Read` permission for `_public` container?: ', r));
 */
module.exports.canAccessContainer = (appHandle, name, permissions) => getObj(appHandle)
    .then((obj) => obj.app.auth.canAccessContainer(name, permissions));

/**
 * Refresh permissions for accessible containers from the network. Useful when
 * you just connected or received a response from the authenticator.
 * @name window.safeApp.refreshContainersPermissions
 *
 * @param {SAFEAppHandle} appHandle the app handle
 *
 * @returns {Promise<SAFEAppHandle>} same app handle when finished refreshing
 *
 * @example // Updating client with previously updated container permissions
 * const permissions = {
 *   _public: ['Read', 'Insert', 'Update', 'Delete', 'ManagePermissions']
 * }
 *
 * const appInfo = {
 *   id: `random net.maidsafe.beaker_plugin_safe_app.test${Math.round(Math.random() * 100000)}`,
 *   name: `random beaker_plugin_safe_app_test${Math.round(Math.random() * 100000)}`,
 *   vendor: 'MaidSafe Ltd.'
 * };
 * const appHandle = await window.safeApp.initialise(appInfo);
 * const authUri = await window.safeApp.authorise(appHandle, permissions, {});
 * await window.safeApp.connectAuthorised(appHandle, authUri);
 * await window.safeApp.refreshContainersPermissions(appHandle);
 *
 * const containerHandle = await window.safeApp.getContainer(appHandle, '_public');
 * let permsObject = await window.safeApp.getContainersPermissions(appHandle);
 * //should.not.exist(permsObject['_publicNames']);
 *
 * const updatePermissions = {
 *   _publicNames: ['Read', 'Insert', 'Update', 'Delete', 'ManagePermissions']
 * }
 *
 * await window.safeApp.authoriseContainer(appHandle, updatePermissions);
 * await window.safeApp.refreshContainersPermissions(appHandle);
 *
 * permsObject = await window.safeApp.getContainersPermissions(appHandle);
 * should.exist(permsObject['_publicNames']);
 */
module.exports.refreshContainersPermissions = (appHandle) => getObj(appHandle)
    .then((obj) => obj.app.auth.refreshContainersPermissions())
    .then(() => appHandle);

/**
 * Get the names of all containers found and the app's granted
 * permissions for each of them.
 * @name window.safeApp.getContainersPermissions
 *
 * @param {SAFEAppHandle} appHandle the app handle
 *
 * @returns {Promise<Array<ContainerPerms>>} list of containers permissions
 *
 * @example // Reading granted container permission for an app
 * window.safeApp.getContainersPermissions(appHandle)
 * .then((object) => {
 *   console.log('JSON object representation of app container permmissions: ', object');
 * });
 */
module.exports.getContainersPermissions = (appHandle) => getObj(appHandle)
    .then((obj) => obj.app.auth.getContainersPermissions());

/**
 * Get the MutableData for the apps own container generated by Authenticator
 * @name window.safeApp.getOwnContainer
 *
 * @param {SAFEAppHandle} appHandle the app handle
 *
 * @returns {Promise<MutableDataHandle>} the handle for the MutableData behind it
 *
 * @example // Retrieve own container:
 * window.safeApp.getOwnContainer(appHandle)
 *    .then((mdHandle) => window.safeMutableData.getVersion(mdHandle))
 *    .then((v) => console.log('Own Container version: ', v));
 */
module.exports.getOwnContainer = (appHandle) => getObj(appHandle)
    .then((obj) => obj.app.auth.getOwnContainer()
      .then((md) => genHandle(obj.app, md)));

/**
 * Lookup and return the information necessary to access a container.
 * @name window.safeApp.getContainer
 *
 * @param {SAFEAppHandle} appHandle the app handle
 * @param {String} name name of the container, e.g. `_public`
 *
 * @returns {Promise<MutableDataHandle>} handle for the MutableData behind it
 *
 * @example // Retrieve the '_public' container:
 * window.safeApp.canAccessContainer(appHandle, '_public', ['Read'])
 *    .then((r) => {
 *       if (r) {
 *          console.log('The app has `Read` permission for `_public` container');
 *          window.safeApp.getContainer(appHandle, '_public')
 *             .then((mdHandle) => window.safeMutableData.getVersion(mdHandle))
 *             .then((v) => console.log('`_public` Container version: ', v));
 *       }
 *    });
 */
module.exports.getContainer = (appHandle, name) => getObj(appHandle)
    .then((obj) => obj.app.auth.getContainer(name)
      .then((md) => genHandle(obj.app, md)));

/**
 * Reconnect SAFEApp instance if connection is disconnected
 * @name window.safeApp.reconnect
 *
 * @param {SAFEAppHandle} appHandle the app handle
 *
 * @example // Reconnecting app instance
 * window.safeApp.reconnect(appHandle);
 */
module.exports.reconnect = (appHandle) => getObj(appHandle)
    .then((obj) => obj.app.reconnect());

/**
 * Generate the log path for the provided filename.
 * If the filename provided is null, it then returns
 * the path of where the safe_core log file is located.
 * @name window.safeApp.logPath
 *
 * @param {SAFEAppHandle} appHandle the app handle
 * @param {String} [filename=null] log filename to generate the path
 *
 * @returns {Promise<String>} the log filename path generated
 *
 * @example // Retrieve the '_public' container:
 * window.safeApp.logPath(appHandle, 'mylogfile.log')
 *    .then((path) => console.log('Log path generated: ', path));
 */
module.exports.logPath = (appHandle, filename) => getObj(appHandle)
    .then((obj) => obj.app.logPath(filename));

/**
 * Free the SAFEApp instance from memory, as well as all other
 * objects created with it, e.g. ImmutableData and MutableData objects, etc.
 * @name window.safeApp.free
 *
 * @param {SAFEAppHandle} appHandle the app handle
 *
 * @example // Freeing app instance from memory
 * window.safeApp.free(appHandle);
 */
module.exports.free = (appHandle) => freeObj(appHandle);

/**
 * @name SAFEAppHandle
 * @typedef {String} SAFEAppHandle
 * @description Holds the reference to a SAFEApp instance which is the primary interface to interact
 * with the SAFE network.
 * Note that it is required to free the memory used by such an instance when it's
 * not needed anymore by the client aplication, please refer to the `free` function.
 */

/**
 * @name AppInfo
 * @typedef {Object} AppInfo
 * @description Holds the information about tha client application, needed for authentication.
 * @param {String} id - unique identifier for the app
 *        (e.g. 'net.maidsafe.examples.mail-app')
 * @param {String} name - human readable name of the app (e.g. "Mail App")
 * @param {String} vendor - human readable name of the vendor (e.g. "MaidSafe Ltd.")
 */

/**
 * @name AuthURI
 * @typedef {String} AuthURI
 * @description The auth URI (`'safe-auth://...'`) returned by the Authenticator after the user has
 * authorised the application. This URL can be used by the
 * application to connect to the network wihout the need to get authorisation
 * from the Authenticator again. Although if the user decided to revoke the application
 * the auth URI shall be obtained again from the Authenticator.
 */
