import { createActions } from 'redux-actions';

export const TYPES = {
    DESELECT_ADDRESS_BAR : 'DESELECT_ADDRESS_BAR',
    SELECT_ADDRESS_BAR : 'SELECT_ADDRESS_BAR',
    BLUR_ADDRESS_BAR  : 'BLUR_ADDRESS_BAR'
};

export const {
    blurAddressBar,
    deselectAddressBar,
    selectAddressBar
} = createActions(
    TYPES.BLUR_ADDRESS_BAR,
    TYPES.DESELECT_ADDRESS_BAR,
    TYPES.SELECT_ADDRESS_BAR
);
