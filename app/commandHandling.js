import { ipcMain } from 'electron';

/**
 * handle commands from ipc comms.
 * @param  {Object} store redux store
 */
export default function handleCommands( store )
{
    //here we have the store. And so we could manipulate it...
    //
    //We're bouncing commands back to Browser.js
    ipcMain.on( 'command', (e, commandToBounce ) =>
    {
        e.sender.send( 'command', commandToBounce );
    });

}
