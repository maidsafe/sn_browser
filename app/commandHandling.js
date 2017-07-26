import { ipcMain } from 'electron';

/**
 * handle commands from ipc comms.
 * @param  {Object} store redux store
 */
export default function handleCommands( store )
{
    ipcMain.on( 'command', (e, commandToBounce ) =>
    {
        e.sender.send( 'command', commandToBounce );
    });

}
