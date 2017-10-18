import { ipcRenderer } from 'electron'
import * as yo from 'yo-yo'

const A_SECOND = 1000;
const A_MINUTE = 60000;
const DISCONNECTED = 'Disconnected';
const CONNECTED = 'Connected';
var reconnectTime = 30;
var reconnectPeriod = `seconds`;
var reconnectIn = `${ reconnectTime } ${ reconnectPeriod }`;
var autoConnectionAttempts = 0;
let safeConnectionIntervalId;

var safeAuthNetworkState = DISCONNECTED
var safeNetworkState = CONNECTED

let updateNav;

/**
 * Bind handles for the ipc messaging to setup reconnection behaviours and trigger navbar updates.
 * @param  {function} update update the navbar render
 */
export const setupSafeReconnectionHandlers = ( update ) =>
{
  updateNav = update;

  ipcRenderer.on('safeAppConnectionChange', function(event, status) {
    safeNetworkState = status

    if( status === DISCONNECTED ){
      startSafeConnectionCountdown();
    }
    else{
      clearInterval( safeConnectionIntervalId )
    }

    updateNav()
  })
}


let resetConnectionCount = () =>{
  reconnectTime = 30;
  reconnectPeriod = `seconds`;
}

let setConnectionCountdownToMinutes = () =>{
  reconnectTime = 5;
  reconnectPeriod = `minutes`;
}



export const attemptToReconnectApps = (e) => {
  ipcRenderer.send('safeReconnectApp');
}



export const getSafeConnectionIntervalId = () =>
{
  return safeConnectionIntervalId
}

export const safeConnectionMessage = () => {
 if (safeNetworkState === DISCONNECTED) {
    return yo `<div class="message__warning">One or more SAFE connections have been disconnected. <a href="#" onclick=${attemptToReconnectApps}>Click here to reconnect now</a>. Otherwise we'll attempt to reconnect automatically in ${ reconnectIn }.</div>`
  }
}


export const startSafeConnectionCountdown = ( timeframe = 'seconds') =>
{
  let timer = A_SECOND;

  if( timeframe == 'minutes' )
  {
    timer = A_MINUTE;
  }

  clearInterval( safeConnectionIntervalId )

  safeConnectionIntervalId = setInterval(function () {
    reconnectTime -= 1;

    if( safeNetworkState == CONNECTED )
    {
      clearInterval( safeConnectionIntervalId )
      return;
    }

    reconnectIn = `${ reconnectTime } ${ reconnectPeriod }`;
    updateNav();


    if( reconnectTime < 1 )
    {
      clearInterval( safeConnectionIntervalId )
      autoConnectionAttempts += 1;

      if( autoConnectionAttempts > 4 )
      {
        timeframe = 'minutes';
        setConnectionCountdownToMinutes();
      }
      else{
        resetConnectionCount()
      }

      attemptToReconnectApps();
      startSafeConnectionCountdown( timeframe )

    }
  }, timer );
}
