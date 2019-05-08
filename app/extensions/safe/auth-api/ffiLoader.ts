import libLoader from '../ffi/lib';

/* eslint-disable import/prefer-default-export */
export const loadLibrary = ( isMock = false ) => libLoader.load( isMock );
/* eslint-enable import/prefer-default-export */
