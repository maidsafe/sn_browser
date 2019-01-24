import lib from '../ffi/lib';

/* eslint-disable import/prefer-default-export */
export const loadLibrary = ( isMock = false, libPath ) => lib.load( isMock, libPath );
/* eslint-enable import/prefer-default-export */
