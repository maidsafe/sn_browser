import { createActions } from 'redux-actions';
import { logger } from '$Logger';

export const TYPES = {
    SET_KNOWN_VERSIONS_FOR_URL: 'SET_KNOWN_VERSIONS_FOR_URL',
    SET_URL_AVAILABILITY: 'SET_URL_AVAILABILITY'
};

export const { setKnownVersionsForUrl, setUrlAvailability } = createActions(
    TYPES.SET_KNOWN_VERSIONS_FOR_URL,
    TYPES.SET_URL_AVAILABILITY
);
