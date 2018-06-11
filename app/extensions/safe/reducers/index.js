// @flow
import authenticator from './authenticator';
import peruseApp from './peruseApp';
import webFetch from './webFetch';

const safeReducers = {
    authenticator,
    peruseApp,
    webFetch
};

export default safeReducers;
