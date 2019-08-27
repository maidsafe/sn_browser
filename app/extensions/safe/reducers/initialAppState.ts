export const initialAppState = {
    pWeb: {
        versionedUrls: {}
    },
    safeBrowserApp: {
        appStatus: null,
        networkStatus: null,
        app: null,
        readStatus: '',
        authResponseUri: '',
        savedBeforeQuit: false,
        saveStatus: '',
        isMock: null,
        experimentsEnabled: false,
        showingWebIdDropdown: false,
        isFetchingWebIds: false,
        webIds: []
    }
};
