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
  return window.safeApp.authorise(appHandle, permissions, ownContainer).then(authUri => ({appHandle, authUri}));
}

const authoriseAndConnect = () => {
  return initialiseApp()
  .then(appHandle => authoriseApp(appHandle))
  .then(({appHandle, authUri}) => window.safeApp.connectAuthorised(appHandle, authUri))
}

const createUnownedMutableData = () => {
  return window.safeApp.initialise(appInfo2)
  .then(appHandle => authoriseApp(appHandle))
  .then(({appHandle, authUri}) => window.safeApp.connectAuthorised(appHandle, authUri))
  .then(appHandle => window.safeMutableData.newRandomPublic(appHandle, 15001))
  .then(mdHandle => window.safeMutableData.quickSetup(mdHandle, {entryFrom: 'different application'}))
  .then(mdHandle => window.safeMutableData.getNameAndTag(mdHandle))
}

module.exports = {
  permissions,
  authUris,
  initialiseApp,
  authoriseApp,
  authoriseAndConnect,
  createUnownedMutableData
};
