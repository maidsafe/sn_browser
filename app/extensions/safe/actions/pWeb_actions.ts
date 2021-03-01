import { createActions } from 'redux-actions';

import { logger } from '$Logger';

export const TYPES = {
    SET_KNOWN_VERSIONS_FOR_URL: 'SET_KNOWN_VERSIONS_FOR_URL',
    SET_NAME_AS_MY_SITE: 'SET_NAME_AS_MY_SITE',
};

export const { setKnownVersionsForUrl, setNameAsMySite } = createActions(
    TYPES.SET_KNOWN_VERSIONS_FOR_URL,
    TYPES.SET_NAME_AS_MY_SITE
);
