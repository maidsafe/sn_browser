let crypto = require('crypto');

const authUris = {
  registeredUri: 'safe-bmV0Lm1haWRzYWZlLnRlc3Qud2ViYXBwLmlk:AQAAAGSv7oQAAAAAAAAAACAAAAAAAAAAGQ1zYg9iFKof2TVkAPp0R2kjU9DDWmmR_uAXBYvaeIAgAAAAAAAAAKecZc5pOSeoU53v43RdoTscGQbuAO0hF6HA_4ou9GJnIAAAAAAAAADsycX-1RCaNJxnYf6ka1pLncSez4w4PmPIS5lau_IblkAAAAAAAAAAbZdkFJ6Ydhh_OwA7mfYcnta_95k2xRazJsDSeMFGj3vsycX-1RCaNJxnYf6ka1pLncSez4w4PmPIS5lau_IbliAAAAAAAAAAx559E774w-6AWnIXBSm0NWOBW2zr8TOPThmdIeEsoFEgAAAAAAAAAHRNdser-WDOLIBGsDfRbNI304vnYILXI1JZC96tiFvzAAAAAAAAAAAAAAAAAAAAAG7Di2O1ssjN0izb88iclOKj7WD5LtaVriMIrLBbVRHimDoAAAAAAAAYAAAAAAAAAH2p2f2I4yuQPLkSJE_u9-PtM1WD7E65ZA==',
  unregisteredUri: 'safe-dW5yZWdpc3RlcmVk:AQAAAMga9SYCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=',
  containersUri: 'safe-bmV0Lm1haWRzYWZlLnRlc3Qud2ViYXBwLmlk:AQAAALDJZuUBAAAAAAAAAA==',
  sharedMdataUri: 'safe-bmV0Lm1haWRzYWZlLmV4YW1wbGVzLnRlc3QtYXBw:AQAAADvUUzgDAAAAAAAAAA=='
};

const appInfo2 = {
  id: 'alternate.net.maidsafe.beaker_plugin_safe_app.test',
  name: 'alternate_app',
  vendor: 'alt MaidSafe Ltd.',
  scope: null
}

const TAG_TYPE_DNS = 15001;
const TAG_TYPE_WWW = 15002;

//  Replaces the entire content of the file when writing data.
const OPEN_MODE_OVERWRITE = 1;

//  Appends to existing data in the file.
const OPEN_MODE_APPEND = 2;

//  Open file to read.
const OPEN_MODE_READ = 4;

//  Read the file from the beginning.
const FILE_READ_FROM_BEGIN = 0;

//  Read entire contents of a file.
const FILE_READ_TO_END = 0;

const permissions = {
    _public: ['Read', 'Insert', 'Update', 'Delete', 'ManagePermissions'],
    _publicNames: ['Read', 'Insert', 'Update', 'Delete', 'ManagePermissions']
}

const ownContainer =  { own_container: true };

const initialiseApp = (scope) => {
  const appInfo = {
      id: 'net.maidsafe.beaker_plugin_safe_app.test',
      name: 'beaker_plugin_safe_app_test',
      vendor: 'MaidSafe Ltd.',
      scope: scope
  };
  return window.safeApp.initialise(appInfo);
}

const authoriseApp = (appHandle) => {
  return window.safeApp.authorise(appHandle, permissions, ownContainer);
}

const authoriseAndConnect = async () => {
  let appHandle = await initialiseApp();
  let authUri = await authoriseApp(appHandle);
  return window.safeApp.connectAuthorised(appHandle, authUri);
}

const createNfsEmulation = async () => {
  const mdHandle = await createRandomPublicMutableData();
  return window.safeMutableData.emulateAs(mdHandle, 'NFS');
}

const createRandomPrivateMutableData = async () => {
  const appHandle = await window.safeApp.initialise(appInfo2);
  const authUri = await authoriseApp(appHandle);
  await window.safeApp.connectAuthorised(appHandle, authUri);
  const mdHandle = await window.safeMutableData.newRandomPrivate(appHandle, TAG_TYPE_DNS);
  return window.safeMutableData.quickSetup(mdHandle, {});
}

const createRandomPublicMutableData = async (entriesObject) => {
  const appHandle = await window.safeApp.initialise(appInfo2);
  const authUri = await authoriseApp(appHandle);
  await window.safeApp.connectAuthorised(appHandle, authUri);
  const mdHandle = await window.safeMutableData.newRandomPublic(appHandle, TAG_TYPE_DNS);
  return window.safeMutableData.quickSetup(mdHandle, entriesObject || {});
}

const createRandomXorName = () => crypto.randomBytes(32);

const createUnownedMutableData = async () => {
  let appHandle = await window.safeApp.initialise(appInfo2);
  let authUri = await authoriseApp(appHandle);
  await window.safeApp.connectAuthorised(appHandle, authUri);
  let mdHandle = await window.safeMutableData.newRandomPublic(appHandle, TAG_TYPE_DNS);
  await window.safeMutableData.quickSetup(mdHandle, {entryFrom: 'different application'});
  return window.safeMutableData.getNameAndTag(mdHandle);
}

module.exports = {
  permissions,
  authUris,
  initialiseApp,
  authoriseApp,
  authoriseAndConnect,
  createUnownedMutableData,
  TAG_TYPE_DNS,
  TAG_TYPE_WWW,
  createRandomPrivateMutableData,
  createRandomPublicMutableData,
  createRandomXorName,
  createNfsEmulation,
  OPEN_MODE_OVERWRITE,
  OPEN_MODE_APPEND,
  OPEN_MODE_READ,
  FILE_READ_FROM_BEGIN,
  FILE_READ_TO_END
};
