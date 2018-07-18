const initialState = {
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
    peruseApp : {
        appStatus       : null,
        networkStatus   : null,
        app             : null,
        readStatus      : '',
        authResponseUri : '',
        savedBeforeQuit : false,
        saveStatus      : '',
        isMock          : null,
        showingWebIdDropdown : false,
        webIds          : [
            // {
            //     name: 'Joshuef',
            //     nick: 'joshuef',
            //     id: 1,
            //     inbox: [
            //         {
            //             text       : 'Im just a longely post',
            //             timestamp : 1529489241522,
            //             from    : 'Not Wilson',
            //             app :  'NotTwitter',
            //             verified: true
            //         },
            //         {
            //             text       : 'unverifieeeddd',
            //             timestamp : 1529489241522,
            //             from    : 'Not Wilson',
            //             app :  'NotTwitter',
            //             verified: true
            //         }
            //
            //     ],
            //     pk:     '',
            //     isDefault: true,
            //     isSelected : true,
            //     posts : [
            //         {
            //             text       : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            //             timestamp : 1529489241520,
            //         },
            //         {
            //             text       : '22222222222222222222222222Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            //             timestamp : 1529489241524,
            //         },
            //         {
            //             text       : '3333333333333333333 ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            //             timestamp : 1529489241529
            //         }
            //     ],
            // },
            // {
            //     name: 'Not Wilson',
            //     nick: 'not joshuef',
            //     id: 2,
            //     inbox: [],
            //     pk:     '',
            //     isDefault: false,
            //     isSelected : false,
            //     posts : [
            //         {
            //             text       : 'Im just a longely post',
            //             timestamp : 1529489241520,
            //         }
            //
            //     ],
            //
            // }
        ]
    },
    webFetch : {
        fetching : false,
        link     : '',
        error    : null,
        options  : ''
    }
};

export default initialState;
