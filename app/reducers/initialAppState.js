const initialState = {
    bookmarks     : [{ url: 'safe-auth://home/#/login' }],
    authenticator : {
        isAuthorised        : false,
        userSecret          : null,
        userPassword        : null,
        inviteCode          : null,
        secretStrength      : 0,
        passwordStrength    : 0,
        error               : null,
        loading             : false,
        networkState        : 0, // Connecting
        authenticatorHandle : '',
        libStatus           : true,
        authenticationQueue : []
        // createAccNavPos: 1,
        // showPopupWindow: false,
        // libErrPopup: false

    },

    remoteCalls : [
    ],
    notifications : [
    ],
    peruseApp : {
        appStatus       : null,
        networkStatus   : undefined,
        app             : null,
        readStatus      : '',
        authResponseUri : '',
        savedBeforeQuit : false,
        saveStatus      : '',
        isMock          : null
    },
    tabs : [{
        url          : 'safe-auth://home/',
        history      : ['safe-auth://home/'],
        historyIndex : 0,
        index        : 0,
        isActiveTab  : true,
        isClosed     : false
    }],
    ui : {
        addressBarIsSelected : false
    },
    webFetch : {
        fetching : false,
        link     : '',
        error    : null,
        options  : ''
    }
};

export default initialState;
