export const ipcRenderer = {
    on   : jest.fn(),
    send : jest.fn()
};
export const remote = {
    Menu : jest.fn(),

    // TODO: Refactor away webcontents ID as windowId
    getCurrentWebContents : jest.fn( () => ( { id: 1 } ) ),
    getCurrentWindow      : jest.fn( () => ( { webContents: { id: 1 } } ) ),
};
