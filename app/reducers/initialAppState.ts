const initialState = {
    bookmarks: [{ url: 'safe-auth://home/#/login' }],
    remoteCalls: [],
    notifications: [],
    tabs: [],
    ui: {
        windows: [],
        addressBarIsSelected: false,
        pageIsLoading: false,
        shouldFocusWebview: false
    }
};

export default initialState;
