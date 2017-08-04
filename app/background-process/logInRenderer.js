import { webContents } from 'electron'

let targetContents;

/**
 * On window initialisation we need to specify the webContents we're targetting for later
 * @param {[type]} webContents [description]
 */
export function setRenderLoggerTarget( webContents )
{
  targetContents = webContents;
}

/**
 * Set the target webcontents to log to
 * @param  {[type]} args [description]
 * @return {[type]}      [description]
 */
export function logInRenderer( ...args )
{
  let target = targetContents || webContents.getFocusedWebContents();
  if( ! target )
  {
    return;
  }

  target.send( 'command', 'log', ...args );
}

export default logInRenderer;
