import { ipcMain } from 'electron';
import { refreshActiveTab, activeTabForwards, activeTabBackwards } from './commands';

/**
 * handle commands from ipc comms.
 * @param  {Object} store redux store
 */
export default function handleCommands( store )
{
    //TODO: These actions dont necessarily update the store. This should be handled in tab.
    ipcMain.on( 'refreshActiveTab', () => refreshActiveTab( store ) );
    ipcMain.on( 'goForwardActiveTab', () => activeTabForwards( store ) );
    ipcMain.on( 'goBackActiveTab', () => activeTabBackwards( store ) );
}
