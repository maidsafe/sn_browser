import { BrowserWindow } from 'electron';
import logger from 'logger';

// Thanks BRAVE browser
let backgroundProcess = null;
let backgroundProcessTimer = null;

// EXAMPLE
//   const param = `
//     (function() {
//       let ctx = document.createElement('canvas').getContext('2d')
//       ctx.font = '${fontSize} ${fontFamily}'
//       const width = ctx.measureText('${title}').width
//
//       return width
//     })()
//   `
//
//   tabs.executeScriptInBackground(param, (err, url, result) => {
//     if (err) {
//       throw err
//     }
//
//     if (type === siteTags.BOOKMARK) {
//       appActions.onBookmarkWidthChanged(Immutable.fromJS([
//         {
//           key: item.get('key'),
//           parentFolderId: item.get('parentFolderId'),
//           width: result[0]
//         }
//       ]))
//     } else {
//       appActions.onBookmarkFolderWidthChanged(Immutable.fromJS([
//         {
//           key: item.get('key'),
//           parentFolderId: item.get('parentFolderId'),
//           width: result[0]
//         }
//       ]))
//     }
//   })
// }

/**
 * Execute script in the browser tab
 * @param win{object} - window in which we want to execute script
 * @param debug{boolean} - would you like to close window or not
 * @param script{string} - script that you want to execute
 * @param cb{function} - function that we call after script is completed
 */
const runScript = async ( win, debug, script, cb ) =>
{
    if( ! win.webContents )
    {
        logger.error('wbcontents doesnt exist yet')
        return;
    }
    if( debug )
    {
        win.webContents.openDevTools()
    }
    const res = win.webContents.executeJavaScript( script, ( err, url, result ) =>
    {
        logger.info('resullltttssss??????????', result)
        cb( err, url, result );
        if ( !debug )
        {
            backgroundProcessTimer = setTimeout( () =>
            {
                if ( backgroundProcess )
                {
                    win.close();
                    backgroundProcess = null;
                }
            }, 2 * 60 * 1000 ); // 2 min
        }

    } )

    return res.then( r => logger.info('process worked')).catch( e => logger.error('did not worrkrkkkkkkk') );
    logger.info('the bg script was passed', res);
};


/**
 * Execute script in the background browser window
 * @param script{string} - script that we want to run
 * @param cb{function} - function that we want to call when script is done
 * @param debug{boolean} - would you like to keep browser window when script is done
 */
export const executeScriptInBackground = ( script, cb, debug = true ) =>
{
    if ( backgroundProcessTimer )
    {
        clearTimeout( backgroundProcessTimer );
    }

    if ( backgroundProcess === null )
    {
        backgroundProcess = new BrowserWindow( {
            show           : debug,
            webPreferences : {
                // partition : 'default' // TODO make safe
            }
        } );

        backgroundProcess.webContents.on( 'did-finish-load', () =>
        {
            runScript( backgroundProcess, debug, script, cb );
        } );
        backgroundProcess.loadURL( 'about:blank' );
    }
    else
    {
        runScript( backgroundProcess, debug, script, cb );
    }
};

export default executeScriptInBackground;
