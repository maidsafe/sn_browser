// Example taken from: https://github.com/electron/electron/issues/4857#issuecomment-200608167
import path from 'path';
import fs from 'fs-extra';
import os from 'os';
import env from './env';

const BUILD_FOLDER = path.resolve( __dirname, '../../resources/build/' );
const APP_NAME = 'maidsafe-safebrowser';
const ICON_FILE = 'safeicon.png';


const registerProtocolHandlers =  () => {

  if( env.name  !==  'production' )
  {
    return;
  }

  if (process.platform === 'win32') {
    var iconPath = path.join(process.resourcesPath, 'app.asar.unpacked', 'build', ICON_FILE );
    registerProtocolHandlerWin32('safe', 'URL:SAFE Network URL', iconPath, process.execPath );

    // dont add safe-auth for now as added via authenticator
    // registerProtocolHandlerWin32('safe-auth', 'URL:SAFE Network URL', iconPath, escapedExecPath )
  }

  if (process.platform === 'linux')
  {
    installLinuxDesktopFile()
    installLinuxDesktopIcon()
  }
}


function installLinuxDesktopFile () {
  const escapedExecPath = process.execPath.replace(/\s/g, '\\ ');
  const escapedExecDir = path.dirname(process.execPath).replace(/\s/g, '\\ ');

  var templatePath =  `${BUILD_FOLDER}/${APP_NAME}.desktop`

  var desktopFile = fs.readFileSync(templatePath, 'utf8')

  desktopFile = desktopFile.replace(/\$APP_PATH/g, escapedExecDir )
  desktopFile = desktopFile.replace(/\$EXEC_PATH/g, escapedExecPath )

  var desktopFilePathLocation = path.join(os.homedir(), '.local', 'share', 'applications' )
  var desktopFilePath = path.join( desktopFilePathLocation, `${APP_NAME}.desktop`)

  fs.ensureDirSync(desktopFilePathLocation)
  fs.writeFileSync(desktopFilePath, desktopFile)
}

function installLinuxDesktopIcon () {
  var iconStaticPath =  `${BUILD_FOLDER}/${ICON_FILE}`;

  var iconFile = fs.readFileSync(iconStaticPath)

  var iconFilePathLocation = path.join(os.homedir(), '.local', 'share', 'icons' )
  var iconFilePath = path.join( iconFilePathLocation, ICON_FILE)
  fs.ensureDirSync(iconFilePathLocation)
  fs.writeFileSync(iconFilePath, iconFile)
}


export default registerProtocolHandlers;


/**
 * To add a protocol handler on Windows, the following keys must be added to the Windows
 * registry:
 *
 * HKEY_CLASSES_ROOT
 *   $PROTOCOL
 *     (Default) = "$NAME"
 *     URL Protocol = ""
 *     DefaultIcon
 *       (Default) = "$ICON"
 *     shell
 *       open
 *         command
 *           (Default) = "$COMMAND" "%1"
 *
 * Source: https://msdn.microsoft.com/en-us/library/aa767914.aspx
 *
 * However, the "HKEY_CLASSES_ROOT" key can only be written by the Administrator user.
 * So, we instead write to "HKEY_CURRENT_USER\Software\Classes", which is inherited by
 * "HKEY_CLASSES_ROOT" anyway, and can be written by unprivileged users.
 */

function registerProtocolHandlerWin32 (protocol, name, icon, command) {
  var Registry = require('winreg')

  var protocolKey = new Registry({
    hive: Registry.HKCU, // HKEY_CURRENT_USER
    key: '\\Software\\Classes\\' + protocol
  })
  protocolKey.set('', Registry.REG_SZ, name, callback)
  protocolKey.set('URL Protocol', Registry.REG_SZ, '', callback)

  var iconKey = new Registry({
    hive: Registry.HKCU,
    key: '\\Software\\Classes\\' + protocol + '\\DefaultIcon'
  })
  iconKey.set('', Registry.REG_SZ, icon, callback)

  var commandKey = new Registry({
    hive: Registry.HKCU,
    key: '\\Software\\Classes\\' + protocol + '\\shell\\open\\command'
  })
  commandKey.set('', Registry.REG_SZ, '"' + command + '" "%1"', callback)

  function callback (err) {
    if (err) log.error(err.message || err)
  }
}
