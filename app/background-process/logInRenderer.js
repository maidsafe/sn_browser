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
 * @param  {[String/Array]} args params to log in render, can be string or array like
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


export function sendToShellWindow( ...args )
{
  let target = targetContents || webContents.getFocusedWebContents();
  if( ! target )
  {
    return;
  }

  target.send( ...args );
}

export default logInRenderer;
