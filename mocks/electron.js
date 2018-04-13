export const ipcRenderer = {
    on   : jest.fn(),
    send : jest.fn()
};
export const remote = {
    Menu : {
        buildFromTemplate : jest.fn()
    },

    // TODO: Refactor away webcontents ID as windowId
    getGlobal : jest.fn( (theGlobal) =>  {

        const fakeGlobals = {
            id: 1,
            SAFE_NODE_LIB_PATH: 'here'
        };

        return fakeGlobals[theGlobal];
    } ) ,
    getCurrentWebContents : jest.fn( () => ( { id: 1 } ) ),
    getCurrentWindow      : jest.fn( () => ( { webContents: { id: 1 } } ) ),
};
