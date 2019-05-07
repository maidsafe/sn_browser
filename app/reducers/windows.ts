/* eslint-disable */
import { TYPES } from '$Actions/windows_actions';
import { logger } from '$Logger';
import { TYPES as TAB_TYPES } from '$Actions/tabs_actions';
import { initialState as initialAppState } from './initialAppState';

const initialState = initialAppState.windows;

const addWindow = ( state, tab ) =>
{
  const targetWindow = tab.windowId; 
  const openWindows = { ...state.openWindows };
  const closedWindows = { ...state.closedWindows };
  const newState = 
  {
    openWindows: {
      ...openWindows,
      [ targetWindow ]: {
        activeTab: null,
        ui: 
        {
          settingsMenuIsVisible: false
        },
        tabs: []
      }
    },
    closedWindows : {
      ...closedWindows,
      [ targetWindow ]: 
      {
        closedtabs : [],
        lastActiveTabs : []
      }
    }
  }
  return newState;
};

const addTabNext = ( state, tab )=>
{
  const openWindows = { ...state.openWindows };
  const targetWindow = tab.windowId;
  const tabId = tab.tabId;
  let lasttabIndex = ++tab.tabIndex || 0;
  openWindows[targetWindow].tabs.splice(lasttabIndex, 0, tabId);
  const newTabs = openWindows[targetWindow].tabs;
  const newWindow ={
    activeTab: null,
    ui: 
    {
      settingsMenuIsVisible: false
    },
    tabs: newTabs
  }
  let newOpenWindows = { ...state.openWindows, [targetWindow]: newWindow };
  let newState = { ...state, openWindows: newOpenWindows };
  return newState;
};

const addTabEnd = ( state, tab )=>
{
  const openWindows = { ...state.openWindows };
  const targetWindow = tab.windowId;
  const tabId = tab.tabId;
  openWindows[targetWindow].tabs.push( tabId );
  const newWindow ={
    activeTab: null,
    ui: 
    {
      settingsMenuIsVisible: false
    },
    tabs: openWindows[targetWindow].tabs
  }
  let newOpenWindows = { ...state.openWindows, [targetWindow]: newWindow };
  let newState = { ...state, openWindows: newOpenWindows };
  return newState;
};

const setActiveTab = ( state, tab )=>
{
  const targetWindow = tab.windowId;
  const tabId = tab.tabId;
  const openWindows = { ...state.openWindows };
  const newWindow ={
    ...openWindows[targetWindow],
    activeTab: tabId   
  }
  let newOpenWindows = { ...state.openWindows, [targetWindow]: newWindow };
  let newState = { ...state, openWindows: newOpenWindows };
  return newState;
};

const closetab = (state,tab) =>
{
  const targetWindow = tab.windowId;
  const openWindows = { ...state.openWindows };
  const closedWindows = { ...state.closedWindows };
  const tabId = tab.tabId;
  const lasttabIndex = openWindows[targetWindow].tabs.findIndex(tab => {return tab === tabId});
  const tabsIndexLength = openWindows[targetWindow].tabs.length-1;
  const newOpenTabs = openWindows[targetWindow].tabs.filter(tab => tab !== tabId);
  const newActiveTab = tabsIndexLength === lasttabIndex ? newOpenTabs[tabsIndexLength-1] : newOpenTabs[lasttabIndex] ;
  const newWindow = {
    ...openWindows[targetWindow],
    tabs: newOpenTabs,
    activeTab: newActiveTab
  };
  const obj =
  {
    tabId,
    lasttabIndex
  }
  closedWindows[targetWindow].closedtabs.push(obj);
  let newOpenWindows = { ...state.openWindows, [targetWindow]: newWindow };
  let newState = { ...state, openWindows: newOpenWindows, closedWindows: closedWindows };
  return newState;
};

const reOpenTab = (state, tabs) => 
{
    const openWindows = { ...state.openWindows };
    const closedWindows = { ...state.closedWindows };
    let targetWindowId = tabs.windowId;
    let lastTabObj = closedWindows[targetWindowId].closedtabs.pop();
    const { tabId, lasttabIndex } = lastTabObj;
    openWindows[targetWindowId].tabs.splice(lasttabIndex,0 ,tabId);
    const newTabs = openWindows[targetWindowId].tabs;
    const newWindow = {
        ...openWindows[targetWindowId],
        tabs: newTabs
    };
    let newOpenWindows = { ...openWindows, [targetWindowId]: newWindow };
    let newState = { ...state, openWindows: newOpenWindows, closedWindows: closedWindows  };
    return newState;
};

const closeWindow = (state, tab)=>
{
  const targetwindow = tab.windowId;
  const openWindows = { ...state.openWindows };
  const closedWindows = { ...state.closedWindows };
  const newTabs = [ ...state.openWindows[targetwindow].tabs ];
  const newCloseWindow = {
    ...closedWindows[targetwindow],
    lastActiveTabs: newTabs
  }
  const filtered = Object.keys(openWindows).filter( key => key !== targetwindow.toString() ).reduce( (res, key) => (res[key] = openWindows[key], res), {} );
  let newClosedWindows = { ...state.closedWindows, [targetwindow]: newCloseWindow };
  let newState = { ...state, closedWindows: newClosedWindows, openWindows: filtered };
  return newState;
}

function toggleMenu( state, payload, showMenu )
{
    const targetWindow = payload.windowId;
    const openWindows = { ...state.openWindows };
    const newWindow = {
      ...openWindows[targetWindow],
      ui: 
      {
        settingsMenuIsVisible: showMenu
      }
    }
    let newOpenWindows = { ...state.openWindows, [targetWindow]: newWindow };
    let newState = { ...state, openWindows: newOpenWindows };
    return newState;
}

const showSettingsMenu = ( state, payload ) =>
{
    const showMenu = true;
    const newState = toggleMenu( state, payload, showMenu );
    return newState;
};

const hideSettingsMenu = ( state, payload ) =>
{
    const showMenu = false;
    const newState = toggleMenu( state, payload, showMenu );
    return newState;
};

const resetStore = (state, payload) =>
{
  const targetWindow = payload.windowId;
  const tabId = payload.tabId;
  const newState = 
  {
    openWindows: {
      [ targetWindow ]: {
        activeTab: tabId,
        ui: 
        {
          settingsMenuIsVisible: false
        },
        tabs: [tabId]
      }
    },
    closedWindows : {
      [ targetWindow ]: 
      {
        closedtabs : [],
        lastActiveTabs : []
      }
    }
  };
  return newState;
};

export function windows( state: object = initialState, action )
{
    const payload = action.payload;

    if ( action.error )
    {
        logger.error( 'ERROR IN ACTION', action.error );
        return state;
    }

    switch ( action.type )
    {
        case TYPES.ADD_WINDOW : {
          return addWindow( state, payload);
        }
        case TYPES.ADD_TAB_NEXT: {
          return addTabNext( state, payload );
        }
        case TYPES.ADD_TAB_END: {
            return addTabEnd( state, payload );
        }
        case TYPES.SET_ACTIVE_TAB: {
            return setActiveTab( state, payload );
        }
        case TYPES.WINDOW_CLOSE_TAB: {
            return closetab( state, payload );
        }
        case TYPES.REOPEN_TAB :
        {
            return reOpenTab( state, payload );
        }
        case TYPES.CLOSE_WINDOW: 
        {
          return closeWindow( state, payload );
        }
        case TYPES.SHOW_SETTINGS_MENU:
        {
            return showSettingsMenu( state, payload );
        }
        case TYPES.HIDE_SETTINGS_MENU:
        {
            return hideSettingsMenu( state, payload );
        }
        case TAB_TYPES.RESET_STORE:
        {
          return resetStore(state, payload);
        }
        default:
            return state;
    }
}
