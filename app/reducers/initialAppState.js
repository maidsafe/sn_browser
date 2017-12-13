const initialState = {
    ui : {
        addressBarIsFocussed : false
    },
    notifications : [
    ],
    tabs : [{
        url          : 'safe-auth://home/',
        history      : ['safe-auth://home/'],
        historyIndex : 0,
        isActiveTab  : true,
        isClosed     : false,
        windowId     : 1
    }]
};

export default initialState;
