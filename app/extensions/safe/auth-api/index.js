import * as ffiLoader from './ffiLoader';
import * as client from './client';

export const safeAuthApi =
    {
        name       : 'safeAuthenticator',
        isInternal : true,
        manifest   : client.manifest,
        methods    : client,
        protocols  : ['safe-auth']
    }
;

export const ffi = {
    client,
    ffiLoader
};
