import { ipcRenderer, ipcMain, remote, webContents } from 'electron';

const electronSyncerMiddleware = store => next => action =>
{
    let meta = action.meta;
    let syncAction = { ...action };
    let result = next(action);

    syncAction.meta = { sync: true };

    //prevent looping
    if( meta && meta.sync )
        return result;

    if( ipcMain )
    {
        webContents.getAllWebContents().forEach( webcontent => webcontent.send( 'electronSync', action ) ); //should also pass latest update window
    }

    if( ipcRenderer )
    {
        let currentWindowId = remote.getCurrentWindow().id;
        ipcRenderer.send('electronSync', currentWindowId,  syncAction );
    }

  return result
}


export const mainSync = ( store ) =>
{
    ipcMain.on('electronSync', (ev, currentWindowId,  action) =>
    {
        store.dispatch( action );

    });
}

export const rendererSync = ( store ) =>
{
    ipcRenderer.on('electronSync', (ev, action) => {
        store.dispatch( action );
    } );

}

export default electronSyncerMiddleware;
