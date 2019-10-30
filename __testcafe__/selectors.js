import { Selector } from 'testcafe';
import { CLASSES } from '../app/constants/classes';

export const addressBar = Selector( `.${CLASSES.ADDRESS_BAR}` );
export const addressBarInput = Selector( `.${CLASSES.ADDRESS_INPUT}` );
export const addTab = Selector( `.${CLASSES.ADD_TAB}` );
export const closeTab = Selector( `.${CLASSES.CLOSE_TAB}` );
export const tab = Selector( `.${CLASSES.TAB}` );
export const bookmarkPage = Selector( `.${CLASSES.BOOKMARK_PAGE}` );
