export const ipcRenderer = {
  on: jest.fn()
};
export const remote = {
  Menu: jest.fn(),

  // TODO: Refactor away webcontents ID as windowId
  getCurrentWindow: jest.fn( () => ({ webContents: { id: 1 } }) ),
  // Menu: jest.fn()
};
