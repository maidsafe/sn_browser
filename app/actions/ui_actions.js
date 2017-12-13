import { createActions } from 'redux-actions';

export const TYPES = {
    FOCUS_ADDRESS_BAR : 'FOCUS_ADDRESS_BAR',
    BLUR_ADDRESS_BAR  : 'BLUR_ADDRESS_BAR'
};

export const {
    blurAddressBar,
    focusAddressBar
} = createActions(
    TYPES.BLUR_ADDRESS_BAR,
    TYPES.FOCUS_ADDRESS_BAR
);
