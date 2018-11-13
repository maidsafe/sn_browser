// @flow
import authenticator from './authenticator';
import safeBrowserApp from './safeBrowserApp';
import webFetch from './webFetch';

const safeReducers = {
    authenticator,
    safeBrowserApp,
    webFetch
};

export default safeReducers;
