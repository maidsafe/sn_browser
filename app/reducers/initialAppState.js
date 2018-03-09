const initialState = {
    bookmarks     : [{ url: 'safe-auth://home/#/login' }],
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
        isMock          : false
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
    }
};

export default initialState;
