import { shell, ipcMain, webContents, app as browserInstance } from 'electron';
import { CONSTANTS, APP_STATUS, MESSAGES, SAFE_APP_ERROR_CODES } from './constants';
import { fromAuthURI  } from 'safe-app';

import store from './store';
import logInRenderer from '../logInRenderer';
import { getAPI } from './helpers';

const STATE_KEY = CONSTANTS.STATE_KEY;

const appInfo = {
  id: 'net.maidsafe.app.browser',
  name: 'SAFE Browser',
  vendor: 'MaidSafe Ltd',
  opts: {
      own_container: true
    },
  permissions :{}
};

let appObj = null;

const safeApp = getAPI('safeApp');
const safeMutableData = getAPI('safeMutableData');
const safeMutableDataEntries = getAPI('safeMutableDataEntries');
const safeMutableDataMutation = getAPI('safeMutableDataMutation');

export const authoriseApp = () => {
  logInRenderer('Authorising app.')
  return new Promise( (resolve, reject ) =>
  {
    appObj = {};
    let dataStream =  safeApp.initialise(appInfo);
    dataStream.on('data', ( datum ) =>
    {
      let token = datum[0];
      appObj.token = token;

      safeApp.authorise( token, appInfo.permissions, appInfo.opts )
        .then((authUri) => {
          appObj.authUri = authUri;
          return safeApp.connectAuthorised( appToken, authUri )

        })
      resolve( token );
    })
  })
};



export const connect = (uri, netStatusCallback) => {
  let registeredApp;
  return fromAuthURI(APP_INFO.info, uri, netStatusCallback)
          .then((app) => registeredApp = app)
          .then(() => saveAuthData(uri))
          .then(() => registeredApp.auth.refreshContainersPermissions())
          .then(() => registeredApp);
}

export const reconnect = (app) => {
  return app.reconnect();
}


export const saveConfigToSafe = ( state, quit ) =>
{
  const stateToSave = { ...state, initializer: {} };
  const JSONToSave = JSON.stringify( stateToSave )

  const initializer = state.initializer;
  const app = initializer.app;

  if( !app || !app.token || !app.authUri )
  {
    logInRenderer("Not authorised to save to the network.")
    console.log("Not authorised to save to the network.")

    if( quit )
    {
      browserInstance.quit();
    }

    return Promise.reject();
  }

  return safeApp.connectAuthorised( app.token, app.authUri )
  .then( () =>
  {
    return safeApp.getHomeContainer( app.token )
    .then( homeMdHandle =>
      {
        let mutationHandle;
        return safeMutableData.getEntries(homeMdHandle)
         .then((entriesHandle) => safeMutableDataEntries.mutate(entriesHandle))
         .then((h) => mutationHandle = h)
         .then(_ => safeMutableData.get( homeMdHandle, STATE_KEY ) )
         .then((value) => safeMutableDataMutation.update(mutationHandle, STATE_KEY, JSONToSave, value.version + 1))
         .then(_ => safeMutableData.applyEntriesMutation(homeMdHandle, mutationHandle))
         .then( (done) =>
         {
            if( quit )
            {
              browserInstance.quit();
            }

           return Promise.resolve();
         } )
    })
    .catch( e =>
      {
        logInRenderer('Problems saving data to the network: ', e.message )

        if( quit )
        {
          browserInstance.quit();
        }
      })

  })

}

/**
 * Read the configuration from the netowrk
 * @param  {[type]} app SafeApp reference, with token and authUri
 */
export const readConfig = ( app ) =>
{
  if( !app || !app.token || !app.authUri )
  {
    return Promise.reject('Not authorised to read from the network.');
  }

  return safeApp.connectAuthorised( app.token, app.authUri )
  .then( () =>
  {
    return safeApp.getHomeContainer( app.token )
      .then( homeMdHandle => safeMutableData.get( homeMdHandle, STATE_KEY ) )
      .then( browserState => JSON.parse(  browserState.buf.toString() ) )
      .then( json => {
        logInRenderer("State retrieved: ", json  );
        return   json;
      })
      .catch( e => logInRenderer( 'Failure getting config from the network: ', e.message))

  })
}
