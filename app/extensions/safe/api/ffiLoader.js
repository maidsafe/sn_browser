import lib from '../ffi/lib';

/* eslint-disable import/prefer-default-export */
export const loadLibrary = (libPath) => lib.load(libPath);
/* eslint-enable import/prefer-default-export */
