// TODO. Unify with test lib/constants browser UI?
export const CLASSES = {
    ADDRESS_BAR: 'js-address',
    ACTIVE_TAB: 'js-tabBar__active-tab',
    TAB: 'js-tab',
    ADD_TAB: 'js-tabBar__add-tab',
    CLOSE_TAB: 'js-tabBar__close-tab',
    SAFE_BROWSER_PAGE: 'js-safeBrowser__page',
    SPECTRON_AREA: 'js-spectron-area',
    SPECTRON_AREA__SPOOF_SAVE: 'js-spectron-area__spoof-save',
    SPECTRON_AREA__SPOOF_LOAD: 'js-spectron-area__spoof-read',
    NOTIFIER_TEXT: 'js-notifier__text',
    BOOKMARK_PAGE: 'js-bookmark-page',
    FORWARDS: 'js-address__forwards',
    BACKWARDS: 'js-address__backwards',
    REFRESH: 'js-address__refresh',
    ADDRESS_INPUT: 'js-address__input',
    MENU: 'js-address__menu',

    NOTIFICATION__ACCEPT: 'js-notification__accept',
    NOTIFICATION__REJECT: 'js-notification__reject',
    NOTIFICATION__IGNORE: 'js-notification__ignore',

    SETTINGS_MENU: 'js-settingsMenu',
    SETTINGS_MENU__BUTTON: 'js-settingsMenu_button',
    SETTINGS_MENU__BOOKMARKS: 'js-settingsMenu_bookmarks',
    SETTINGS_MENU__HISTORY: 'js-settingsMenu_history',
    SETTINGS_MENU__TOGGLE: 'js-settingsMenu_toggle',
    SETTINGS_MENU__TOGGLE_BUTTON: 'js-settingsMenu_toggleButton',
    SETTINGS_MENU__TOGGLE_TEXT: 'js-settingsMenu_toggleText',
    MOCK_TAG: 'js-addressBar_mockTag'
};

export const getDomClasses = () => {
    const domClasses = {};

    Object.keys( CLASSES ).forEach( theClass => {
        domClasses[theClass] = `.${CLASSES[theClass]}`;
    } );

    return domClasses;
};

export const GET_DOM_EL_CLASS = getDomClasses();
