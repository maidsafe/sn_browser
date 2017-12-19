const initialState = {
    bookmarks     : [],
    notifications : [
    ],
    safeNetwork : {
        appStatus       : null,
        networkStatus   : null,
        app             : null,
        tasks           : [],
        readStatus      : '',
        savedBeforeQuit : false,
        saveStatus      : ''
    },
    tabs : [{
        url          : 'safe-auth://home/',
        history      : ['safe-auth://home/'],
        historyIndex : 0,
        isActiveTab  : true,
        isClosed     : false,
        windowId     : 1
    }],
    ui : {
        addressBarIsSelected : false
    }
};

export default initialState;
