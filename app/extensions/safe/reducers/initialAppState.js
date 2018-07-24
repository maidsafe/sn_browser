const initialState = {
    authenticator : {
        reAuthoriseState    : 0,
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
    peruseApp : {
        appStatus       : null,
        networkStatus   : null,
        app             : null,
        readStatus      : '',
        authResponseUri : '',
        savedBeforeQuit : false,
        saveStatus      : '',
        isMock          : null
    },
    webFetch : {
        fetching : false,
        link     : '',
        error    : null,
        options  : ''
    }
};

export default initialState;
