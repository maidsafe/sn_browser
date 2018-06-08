import { createActions } from 'redux-actions';

export const TYPES = {
    DESELECT_ADDRESS_BAR : 'DESELECT_ADDRESS_BAR',
    SELECT_ADDRESS_BAR : 'SELECT_ADDRESS_BAR',
    BLUR_ADDRESS_BAR  : 'BLUR_ADDRESS_BAR',
    RESET_STORE : 'RESET_STORE'

};

export const {
    blurAddressBar,
    deselectAddressBar,
    selectAddressBar,
    resetStore
} = createActions(
    TYPES.BLUR_ADDRESS_BAR,
    TYPES.DESELECT_ADDRESS_BAR,
    TYPES.SELECT_ADDRESS_BAR,
    TYPES.RESET_STORE
);
