import { createActions } from 'redux-actions';
import { logger } from '$Logger';

export const TYPES = {
    SET_KNOWN_VERSIONS_FOR_URL: 'SET_KNOWN_VERSIONS_FOR_URL'
};

export const { setKnownVersionsForUrl } = createActions(
    TYPES.SET_KNOWN_VERSIONS_FOR_URL
);
