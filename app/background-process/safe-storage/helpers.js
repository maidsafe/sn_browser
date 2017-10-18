import beakerSafePlugin from 'beaker-plugin-safe-app';
import beakerAuthPlugin  from 'beaker-plugin-safe-authenticator';

const allAPIs = beakerSafePlugin.webAPIs;
const authAPIs = beakerAuthPlugin.webAPIs;

const WITH_CALLBACK_TYPE_PREFIX = '_with_cb_';
const WITH_ASYNC_CALLBACK_TYPE_PREFIX = '_with_async_cb_';

export const authReconnect = ( ) =>
{
  const authApi = authAPIs.find( api =>  api.name === 'safeAuthenticator' )

  let reconnect = authApi.methods.reconnect;

  reconnect();
}

export const getAPI = ( name ) =>
{
  const relevantApi = allAPIs.find( api =>  api.name === name )
  let methods = relevantApi.manifest;

  let newFnObject = {};
  Object.keys(methods).forEach( method =>
    {
      let newName = method;
      if( method.startsWith( WITH_ASYNC_CALLBACK_TYPE_PREFIX ) )
      {
        newName = method.replace( WITH_ASYNC_CALLBACK_TYPE_PREFIX, '')
      }
      if( method.startsWith( WITH_CALLBACK_TYPE_PREFIX ) )
      {
        newName = method.replace( WITH_CALLBACK_TYPE_PREFIX, '')
      }

        newFnObject[ newName ] = relevantApi.methods[ method ]
    })

  return newFnObject;
}
