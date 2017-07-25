import { ipcMain, webContents } from 'electron';

function getActiveTabWebContents( store )
{
    let activeTab = store.getState().tabs.toJS().find( tab => tab.isActiveTab );
    return webContents.fromId( activeTab.webContentsId );
}

export function refreshActiveTab( store )
{
    getActiveTabWebContents( store ).reload();
}

export function activeTabBackwards( store )
{

    getActiveTabWebContents( store ).goBack();
}

export function activeTabForwards( store )
{
    console.log("GO FORWARRRRDDDSSSSS??", getActiveTabWebContents( store ).canGoForward() );
    getActiveTabWebContents( store ).goForward();
}
