import { createActions } from 'redux-actions';

export const TYPES = {
    DESELECT_ADDRESS_BAR : 'DESELECT_ADDRESS_BAR',
    SELECT_ADDRESS_BAR : 'SELECT_ADDRESS_BAR',
    BLUR_ADDRESS_BAR  : 'BLUR_ADDRESS_BAR',
    RELOAD_PAGE : 'RELOAD_PAGE',
    PAGE_LOADED : 'PAGE_LOADED'
};

export const {
    blurAddressBar,
    deselectAddressBar,
    selectAddressBar,
    reloadPage,
    pageLoaded
} = createActions(
    TYPES.BLUR_ADDRESS_BAR,
    TYPES.DESELECT_ADDRESS_BAR,
    TYPES.SELECT_ADDRESS_BAR,
    TYPES.RELOAD_PAGE,
    TYPES.PAGE_LOADED
);
