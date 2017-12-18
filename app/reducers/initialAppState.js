const initialState = {
    bookmarks : [ ],
    notifications : [
    ],
    tabs : [{
        url          : 'peruse:history',
        // url          : 'safe-auth://home/',
        history      : ['peruse:history'],
        // history      : ['safe-auth://home/'],
        historyIndex : 0,
        isActiveTab  : true,
        isClosed     : false,
        windowId     : 1
    }],
    ui : {
        addressBarIsFocussed : false
    }
};

export default initialState;
