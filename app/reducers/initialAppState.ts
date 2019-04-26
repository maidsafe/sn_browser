export const initialState = {
    bookmarks: [{ url: 'safe-auth://home/#/login' }],
    remoteCalls: [],
    notifications: [],
    tabs: [
        {
            url: 'safe-auth://home/',
            history: ['safe-auth://home/'],
            historyIndex: 0,
            index: 0,
            isActiveTab: true,
            isClosed: false,
            webId: undefined
        }
    ],
    ui: {
        windows: [],
        addressBarIsSelected: false,
        pageIsLoading: false,
        shouldFocusWebview: false
    }
};
