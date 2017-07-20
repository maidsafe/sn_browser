// Example taken from: https://github.com/electron/electron/issues/4857#issuecomment-200608167
import env from './env';

const BUILD_FOLDER = './resources/build/';
const APP_NAME = 'maidsafe-safebrowser';
const registerProtocolHandlers =  () => {
  if( env.name  !==  'production' )
  {
      return;
  }

  if (process.platform === 'linux')
  {
    installLinuxDesktopFile()
    installLinuxDesktopIcon()
  }
}


function installLinuxDesktopFile () {
  var fs = require('fs')
  var path = require('path')
  var os = require('os')

  var templatePath =  `${BUILD_FOLDER}${APP_NAME}.desktop`

  var desktopFile = fs.readFileSync(templatePath, 'utf8')

  const escapedExecPath = process.execPath.replace(/\s/g, '\\ ');
  const escapedExecDir = path.dirname(process.execPath).replace(/\s/g, '\\ ');

  desktopFile = desktopFile.replace(/\$APP_PATH/g, escapedExecDir )
  desktopFile = desktopFile.replace(/\$EXEC_PATH/g, escapedExecPath )

  var desktopFilePath = path.join(os.homedir(), '.local', 'share', 'applications', 'safebrowser.desktop')
  fs.writeFileSync(desktopFilePath, desktopFile)
}

function installLinuxDesktopIcon () {
  var fs = require('fs')
  var path = require('path')
  var os = require('os')

  var iconStaticPath =  `${BUILD_FOLDER}safeicon.png`

  var iconFile = fs.readFileSync(iconStaticPath)

  var iconFilePath = path.join(os.homedir(), '.local', 'share', 'icons', 'safebrowser.png')
  fs.writeFileSync(iconFilePath, iconFile)
}


export default registerProtocolHandlers;
