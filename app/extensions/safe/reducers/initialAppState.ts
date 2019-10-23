export const initialAppState = {
    pWeb: {
        versionedUrls: {},
        availableNrsUrls: [],
        mySites: []
    },
    safeBrowserApp: {
    // appStatus: null,
    // networkStatus: null,
        app: null,
        // readStatus: '',
        // authResponseUri: '',
        // savedBeforeQuit: false,
        // saveStatus: '',
        isMock: null,
        isAuthorised: false,
        experimentsEnabled: false,
        showingWebIdDropdown: false,
        isFetchingWebIds: false,
        webIds: []
    }
};
