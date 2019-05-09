import { windows } from '$Reducers/windows';
import { TYPES as TABS_TYPES } from '$Actions/tabs_actions'
import { TYPES } from '$Actions/windows_actions';
import { initialAppState } from '$Reducers/initialAppState';
import { isRunningUnpacked } from '$Constants';

describe( 'windows reducer', () => {
    const tabId = Math.random().toString( 36 );
    const tabId1 = Math.random().toString( 36 );
    const tabId2 = Math.random().toString( 36 );
    const tabId3 = Math.random().toString( 36 );
    const IntialState = initialAppState.windows;
    const basicwindow = {
        activeTab: null,
        ui: {
            settingsMenuIsVisible: false
        },
        tabs: []
    };
    it( 'should return the initial state', () => {
        expect( windows( undefined, {} ) ).toEqual( initialAppState.windows );
    } );
    describe( 'ADD_WINDOW', () => {
        it( 'should handle adding a window', () => {
            const addWindow = windows( IntialState, {
                type: TYPES.ADD_WINDOW,
                payload: { windowId: 1 }
            } );
            expect( addWindow ).toEqual( {
                openWindows: {
                    '1': {
                        ...basicwindow
                    }
                },
                closedWindows: {
                    '1': {
                        closedTabs: [],
                        lastActiveTabs: []
                    }
                }
            } );
        } );
        it( 'should handle adding another window', () => {
            const state = {
                openWindows: {
                    '1': {
                        ...basicwindow
                    }
                },
                closedWindows: {
                    '1': {
                        closedTabs: [],
                        lastActiveTabs: []
                    }
                }
            };
            const addWindow = windows( state, {
                type: TYPES.ADD_WINDOW,
                payload: { windowId: 2 }
            } );
            expect( addWindow ).toEqual( {
                openWindows: {
                    '1': {
                        ...basicwindow
                    },
                    '2': {
                        ...basicwindow
                    }
                },
                closedWindows: {
                    '1': {
                        closedTabs: [],
                        lastActiveTabs: []
                    },
                    '2': {
                        closedTabs: [],
                        lastActiveTabs: []
                    }
                }
            } );
        } );
    } );
    describe( 'ADD_TAB_NEXT', () => {
        it( 'should add handle add tab without passing index', () => {
            const state = {
                openWindows: {
                    '1': {
                        ...basicwindow,
                        tabs: []
                    }
                },
                closedWindows: {
                    '1': {
                        closedTabs: [],
                        lastActiveTabs: []
                    }
                }
            };
            const addTabNext = windows( state, {
                type: TYPES.ADD_TAB_NEXT,
                payload: { windowId: 1, tabId }
            } );
            expect( addTabNext ).toEqual( {
                openWindows: {
                    '1': {
                        ...basicwindow,
                        tabs: [tabId]
                    }
                },
                closedWindows: {
                    '1': {
                        closedTabs: [],
                        lastActiveTabs: []
                    }
                }
            } );
        } );
        it( 'should add another tab without passing the index', () => {
            const state = {
                openWindows: {
                    '1': {
                        ...basicwindow,
                        tabs: [tabId]
                    }
                },
                closedWindows: {
                    '1': {
                        closedTabs: [],
                        lastActiveTabs: []
                    }
                }
            };
            const addTabNext = windows( state, {
                type: TYPES.ADD_TAB_NEXT,
                payload: { windowId: 1, tabId: tabId1 }
            } );
            expect( addTabNext ).toEqual( {
                openWindows: {
                    '1': {
                        ...basicwindow,
                        tabs: [tabId1, tabId]
                    }
                },
                closedWindows: {
                    '1': {
                        closedTabs: [],
                        lastActiveTabs: []
                    }
                }
            } );
        } );
        it( 'should add another tab with passing the index', () => {
            const state = {
                openWindows: {
                    '1': {
                        ...basicwindow,
                        tabs: [tabId1, tabId]
                    }
                },
                closedWindows: {
                    '1': {
                        closedTabs: [],
                        lastActiveTabs: []
                    }
                }
            };
            const addTabNext = windows( state, {
                type: TYPES.ADD_TAB_NEXT,
                payload: { windowId: 1, tabId: tabId2, tabIndex: 0 }
            } );
            expect( addTabNext ).toEqual( {
                openWindows: {
                    '1': {
                        ...basicwindow,
                        tabs: [tabId1, tabId2, tabId]
                    }
                },
                closedWindows: {
                    '1': {
                        closedTabs: [],
                        lastActiveTabs: []
                    }
                }
            } );
        } );
    } );
    describe( 'ADD_TAB_END', () => {
        it( 'add a tab at the end', () => {
            const state = {
                openWindows: {
                    '1': {
                        ...basicwindow
                    }
                },
                closedWindows: {
                    '1': {
                        closedTabs: [],
                        lastActiveTabs: []
                    }
                }
            };
            const addTabEnd = windows( state, {
                type: TYPES.ADD_TAB_END,
                payload: { windowId: 1, tabId }
            } );
            expect( addTabEnd ).toEqual( {
                openWindows: {
                    '1': {
                        ...basicwindow,
                        tabs: [tabId]
                    }
                },
                closedWindows: {
                    '1': {
                        closedTabs: [],
                        lastActiveTabs: []
                    }
                }
            } );
        } );
        it( 'add another tab at the end', () => {
            const state = {
                openWindows: {
                    '1': {
                        ...basicwindow,
                        tabs: [tabId]
                    }
                },
                closedWindows: {
                    '1': {
                        closedTabs: [],
                        lastActiveTabs: []
                    }
                }
            };
            const addTabEnd = windows( state, {
                type: TYPES.ADD_TAB_END,
                payload: { windowId: 1, tabId: tabId1 }
            } );
            expect( addTabEnd ).toEqual( {
                openWindows: {
                    '1': {
                        ...basicwindow,
                        tabs: [tabId, tabId1]
                    }
                },
                closedWindows: {
                    '1': {
                        closedTabs: [],
                        lastActiveTabs: []
                    }
                }
            } );
        } );
        it( 'add tab at the end of another window', () => {
            const state = {
                openWindows: {
                    '1': {
                        ...basicwindow,
                        tabs: [tabId, tabId1]
                    },
                    '2': {
                        ...basicwindow,
                        tabs: []
                    }
                },
                closedWindows: {
                    '1': {
                        closedTabs: [],
                        lastActiveTabs: []
                    },
                    '2': {
                        closedTabs: [],
                        lastActiveTabs: []
                    }
                }
            };
            const addTabEnd = windows( state, {
                type: TYPES.ADD_TAB_END,
                payload: { windowId: 2, tabId: tabId2 }
            } );
            expect( addTabEnd ).toEqual( {
                openWindows: {
                    '1': {
                        ...basicwindow,
                        tabs: [tabId, tabId1]
                    },
                    '2': {
                        ...basicwindow,
                        tabs: [tabId2]
                    }
                },
                closedWindows: {
                    '1': {
                        closedTabs: [],
                        lastActiveTabs: []
                    },
                    '2': {
                        closedTabs: [],
                        lastActiveTabs: []
                    }
                }
            } );
        } );
        it( 'add one last another tab at the end of the initial window', () => {
            const state = {
                openWindows: {
                    '1': {
                        ...basicwindow,
                        tabs: [tabId, tabId1]
                    },
                    '2': {
                        ...basicwindow,
                        tabs: [tabId2]
                    }
                },
                closedWindows: {
                    '1': {
                        closedTabs: [],
                        lastActiveTabs: []
                    },
                    '2': {
                        closedTabs: [],
                        lastActiveTabs: []
                    }
                }
            };
            const addTabEnd = windows( state, {
                type: TYPES.ADD_TAB_END,
                payload: { windowId: 1, tabId: tabId3 }
            } );
            expect( addTabEnd ).toEqual( {
                openWindows: {
                    '1': {
                        ...basicwindow,
                        tabs: [tabId, tabId1, tabId3]
                    },
                    '2': {
                        ...basicwindow,
                        tabs: [tabId2]
                    }
                },
                closedWindows: {
                    '1': {
                        closedTabs: [],
                        lastActiveTabs: []
                    },
                    '2': {
                        closedTabs: [],
                        lastActiveTabs: []
                    }
                }
            } );
        } );
    } );
    describe( 'SET_ACTIVE_TAB', () => {
        it( 'should set new tab to active tab', () => {
            const state = {
                openWindows: {
                    '1': {
                        ...basicwindow,
                        tabs: [tabId]
                    }
                },
                closedWindows: {
                    '1': {
                        closedTabs: [],
                        lastActiveTabs: []
                    }
                }
            };
            const setActiveTab = windows( state, {
                type: TYPES.SET_ACTIVE_TAB,
                payload: { windowId: 1, tabId }
            } );
            expect( setActiveTab ).toEqual( {
                openWindows: {
                    '1': {
                        ...basicwindow,
                        activeTab: tabId,
                        tabs: [tabId]
                    }
                },
                closedWindows: {
                    '1': {
                        closedTabs: [],
                        lastActiveTabs: []
                    }
                }
            } );
        } );
        it( 'should set another tab to active tab', () => {
            const state = {
                openWindows: {
                    '1': {
                        ...basicwindow,
                        tabs: [tabId, tabId1]
                    }
                },
                closedWindows: {
                    '1': {
                        closedTabs: [],
                        lastActiveTabs: []
                    }
                }
            };
            const setActiveTab = windows( state, {
                type: TYPES.SET_ACTIVE_TAB,
                payload: { windowId: 1, tabId: tabId1 }
            } );
            expect( setActiveTab ).toEqual( {
                openWindows: {
                    '1': {
                        ...basicwindow,
                        activeTab: tabId1,
                        tabs: [tabId, tabId1]
                    }
                },
                closedWindows: {
                    '1': {
                        closedTabs: [],
                        lastActiveTabs: []
                    }
                }
            } );
        } );
        it( 'should set another new Tab to Active tab in new window', () => {
            const state = {
                openWindows: {
                    '1': {
                        ...basicwindow,
                        activeTab: tabId,
                        tabs: [tabId]
                    },
                    '2': {
                        ...basicwindow,
                        tabs: [tabId1]
                    }
                },
                closedWindows: {
                    '1': {
                        closedTabs: [],
                        lastActiveTabs: []
                    },
                    '2': {
                        closedTabs: [],
                        lastActiveTabs: []
                    }
                }
            };
            const setActiveTab = windows( state, {
                type: TYPES.SET_ACTIVE_TAB,
                payload: { windowId: 2, tabId: tabId1 }
            } );
            expect( setActiveTab ).toEqual( {
                openWindows: {
                    '1': {
                        ...basicwindow,
                        activeTab: tabId,
                        tabs: [tabId]
                    },
                    '2': {
                        ...basicwindow,
                        activeTab: tabId1,
                        tabs: [tabId1]
                    }
                },
                closedWindows: {
                    '1': {
                        closedTabs: [],
                        lastActiveTabs: []
                    },
                    '2': {
                        closedTabs: [],
                        lastActiveTabs: []
                    }
                }
            } );
        } );
    } );
    describe( 'CLOSE_TAB', () => {
        it( 'close the intial tab', () => {
            const state = {
                openWindows: {
                    '1': {
                        ...basicwindow,
                        tabs: [tabId, tabId2, tabId1]
                    }
                },
                closedWindows: {
                    '1': {
                        closedTabs: [],
                        lastActiveTabs: []
                    }
                }
            };
            const closeTab = windows( state, {
                type: TYPES.WINDOW_CLOSE_TAB,
                payload: { windowId: 1, tabId }
            } );
            expect( closeTab ).toEqual( {
                openWindows: {
                    '1': {
                        ...basicwindow,
                        activeTab: tabId2,
                        tabs: [tabId2, tabId1]
                    }
                },
                closedWindows: {
                    '1': {
                        closedTabs: [
                            {
                                lastTabIndex: 0,
                                tabId
                            }
                        ],
                        lastActiveTabs: []
                    }
                }
            } );
        } );
        it( 'should close another tab', () => {
            const state = {
                openWindows: {
                    '1': {
                        ...basicwindow,
                        tabs: [tabId, tabId2, tabId1]
                    }
                },
                closedWindows: {
                    '1': {
                        closedTabs: [],
                        lastActiveTabs: []
                    }
                }
            };
            const closeTab = windows( state, {
                type: TYPES.WINDOW_CLOSE_TAB,
                payload: { windowId: 1, tabId: tabId2 }
            } );
            expect( closeTab ).toEqual( {
                openWindows: {
                    '1': {
                        ...basicwindow,
                        activeTab: tabId1,
                        tabs: [tabId, tabId1]
                    }
                },
                closedWindows: {
                    '1': {
                        closedTabs: [
                            {
                                lastTabIndex: 1,
                                tabId: tabId2
                            }
                        ],
                        lastActiveTabs: []
                    }
                }
            } );
        } );
        it( 'should close another tab in another window', () => {
            const state = {
                openWindows: {
                    '1': {
                        ...basicwindow,
                        activeTab: tabId,
                        tabs: [tabId1]
                    },
                    '2': {
                        ...basicwindow,
                        activeTab: tabId3,
                        tabs: [tabId2, tabId3]
                    }
                },
                closedWindows: {
                    '1': {
                        closedTabs: [
                            {
                                lastTabIndex: 0,
                                tabId
                            }
                        ],
                        lastActiveTabs: []
                    },
                    '2': {
                        closedTabs: [],
                        lastActiveTabs: []
                    }
                }
            };
            const closeTab = windows( state, {
                type: TYPES.WINDOW_CLOSE_TAB,
                payload: { windowId: 2, tabId: tabId2 }
            } );
            expect( closeTab ).toEqual( {
                openWindows: {
                    '1': {
                        ...basicwindow,
                        activeTab: tabId,
                        tabs: [tabId1]
                    },
                    '2': {
                        ...basicwindow,
                        activeTab: tabId3,
                        tabs: [tabId3]
                    }
                },
                closedWindows: {
                    '1': {
                        closedTabs: [
                            {
                                lastTabIndex: 0,
                                tabId
                            }
                        ],
                        lastActiveTabs: []
                    },
                    '2': {
                        closedTabs: [
                            {
                                lastTabIndex: 0,
                                tabId: tabId2
                            }
                        ],
                        lastActiveTabs: []
                    }
                }
            } );
        } );
    } );
    describe( 'REOPEN_TAB', () => {
        it( 'should reopen last closed tab', () => {
            const state = {
                openWindows: {
                    '1': {
                        ...basicwindow,
                        tabs: [tabId1]
                    }
                },
                closedWindows: {
                    '1': {
                        closedTabs: [
                            {
                                lastTabIndex: 1,
                                tabId
                            },
                            {
                                lastTabIndex: 1,
                                tabId: tabId2
                            }
                        ],
                        lastActiveTabs: []
                    }
                }
            };
            const reopenTab = windows( state, {
                type: TYPES.REOPEN_TAB,
                payload: { windowId: 1 }
            } );
            expect( reopenTab ).toEqual( {
                openWindows: {
                    '1': {
                        ...basicwindow,
                        tabs: [tabId1, tabId2]
                    }
                },
                closedWindows: {
                    '1': {
                        closedTabs: [
                            {
                                lastTabIndex: 1,
                                tabId
                            }
                        ],
                        lastActiveTabs: []
                    }
                }
            } );
        } );
        it( 'should reopen another closed tab', () => {
            const state = {
                openWindows: {
                    '1': {
                        ...basicwindow,
                        tabs: [tabId1, tabId2]
                    }
                },
                closedWindows: {
                    '1': {
                        closedTabs: [
                            {
                                lastTabIndex: 1,
                                tabId
                            }
                        ],
                        lastActiveTabs: []
                    }
                }
            };
            const reopenTab = windows( state, {
                type: TYPES.REOPEN_TAB,
                payload: { windowId: 1 }
            } );
            expect( reopenTab ).toEqual( {
                openWindows: {
                    '1': {
                        ...basicwindow,
                        tabs: [tabId1, tabId, tabId2]
                    }
                },
                closedWindows: {
                    '1': {
                        closedTabs: [],
                        lastActiveTabs: []
                    }
                }
            } );
        } );
        it( 'should reopen a closed tab in another window', () => {
            const state = {
                openWindows: {
                    '1': {
                        ...basicwindow,
                        tabs: [tabId3]
                    },
                    '2': {
                        ...basicwindow,
                        tabs: [tabId1, tabId2]
                    }
                },
                closedWindows: {
                    '1': {
                        closedTabs: [],
                        lastActiveTabs: []
                    },
                    '2': {
                        closedTabs: [
                            {
                                lastTabIndex: 1,
                                tabId
                            }
                        ],
                        lastActiveTabs: []
                    }
                }
            };
            const reopenTab = windows( state, {
                type: TYPES.REOPEN_TAB,
                payload: { windowId: 2 }
            } );
            expect( reopenTab ).toEqual( {
                openWindows: {
                    '1': {
                        ...basicwindow,
                        tabs: [tabId3]
                    },
                    '2': {
                        ...basicwindow,
                        tabs: [tabId1, tabId, tabId2]
                    }
                },
                closedWindows: {
                    '1': {
                        closedTabs: [],
                        lastActiveTabs: []
                    },
                    '2': {
                        closedTabs: [],
                        lastActiveTabs: []
                    }
                }
            } );
        } );
    } );
    describe( 'CLOSE_WINDOW', () => {
        it( 'should close a given window', () => {
            const state = {
                openWindows: {
                    '1': {
                        ...basicwindow,
                        tabs: [tabId, tabId1, tabId2]
                    },
                    '2': {
                        ...basicwindow,
                        tabs: [tabId3]
                    }
                },
                closedWindows: {
                    '1': {
                        closedTabs: [],
                        lastActiveTabs: []
                    },
                    '2': {
                        closedTabs: [],
                        lastActiveTabs: []
                    }
                }
            };
            const closeWindow = windows( state, {
                type: TYPES.CLOSE_WINDOW,
                payload: { windowId: 1 }
            } );

            expect( closeWindow ).toEqual( {
                openWindows: {
                    '2': {
                        ...basicwindow,
                        tabs: [tabId3]
                    }
                },
                closedWindows: {
                    '1': {
                        closedTabs: [],
                        lastActiveTabs: [tabId, tabId1, tabId2]
                    },
                    '2': {
                        closedTabs: [],
                        lastActiveTabs: []
                    }
                }
            } );
        } );
    } );
    describe( 'SHOW_SETTINGS_MENU', () => {
        it( 'enable setting menu for a given window', () => {
            const state = {
                openWindows: {
                    '1': {
                        ...basicwindow,
                        tabs: [tabId]
                    },
                    '2': {
                        ...basicwindow,
                        tabs: []
                    }
                },
                closedWindows: {
                    '1': {
                        closedTabs: [],
                        lastActiveTabs: []
                    },
                    '2': {
                        closedTabs: [],
                        lastActiveTabs: []
                    }
                }
            };
            const showSettingsMenu = windows( state, {
                type: TYPES.SHOW_SETTINGS_MENU,
                payload: { windowId: 1 }
            } );
            expect( showSettingsMenu ).toEqual( {
                openWindows: {
                    '1': {
                        ...basicwindow,
                        tabs: [tabId],
                        ui: {
                            settingsMenuIsVisible: true
                        }
                    },
                    '2': {
                        ...basicwindow,
                        tabs: []
                    }
                },
                closedWindows: {
                    '1': {
                        closedTabs: [],
                        lastActiveTabs: []
                    },
                    '2': {
                        closedTabs: [],
                        lastActiveTabs: []
                    }
                }
            } );
        } );
    } );
    describe( 'HIDE_SETTINGS_MENU', () => {
        it( 'hide setting menu for a given window', () => {
            const state = {
                openWindows: {
                    '1': {
                        ...basicwindow,
                        tabs: [tabId],
                        ui: {
                            settingsMenuIsVisible: true
                        }
                    },
                    '2': {
                        ...basicwindow,
                        tabs: []
                    }
                },
                closedWindows: {
                    '1': {
                        closedTabs: [],
                        lastActiveTabs: []
                    },
                    '2': {
                        closedTabs: [],
                        lastActiveTabs: []
                    }
                }
            };
            const hideSettingsMenu = windows( state, {
                type: TYPES.HIDE_SETTINGS_MENU,
                payload: { windowId: 1 }
            } );
            expect( hideSettingsMenu ).toEqual( {
                openWindows: {
                    '1': {
                        ...basicwindow,
                        tabs: [tabId],
                        ui: {
                            settingsMenuIsVisible: false
                        }
                    },
                    '2': {
                        ...basicwindow,
                        tabs: []
                    }
                },
                closedWindows: {
                    '1': {
                        closedTabs: [],
                        lastActiveTabs: []
                    },
                    '2': {
                        closedTabs: [],
                        lastActiveTabs: []
                    }
                }
            } );
        } );
    } );
} );
