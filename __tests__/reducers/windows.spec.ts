import { windows } from '$Reducers/windows';
import { TYPES as TABS_TYPES } from '$Actions/tabs_actions';
import { TYPES } from '$Actions/windows_actions';
import { initialAppState } from '$Reducers/initialAppState';
import { isRunningUnpacked } from '$Constants';

describe( 'windows reducer', () => {
    const tabId = Math.random().toString( 36 );
    const tabId1 = Math.random().toString( 36 );
    const tabId2 = Math.random().toString( 36 );
    const tabId3 = Math.random().toString( 36 );
    const firstWindowId = '1';
    const secondWindowId = '2';
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
            expect( addWindow ).not.toStrictEqual( IntialState );
            expect( addWindow ).toEqual( {
                openWindows: {
                    [firstWindowId]: {
                        ...basicwindow
                    }
                },
                closedWindows: {
                    [firstWindowId]: {
                        closedTabs: [],
                        lastActiveTabs: []
                    }
                }
            } );
        } );
        it( 'should handle adding another window', () => {
            const state = {
                openWindows: {
                    [firstWindowId]: {
                        ...basicwindow
                    }
                },
                closedWindows: {
                    [firstWindowId]: {
                        closedTabs: [],
                        lastActiveTabs: []
                    }
                }
            };
            const addWindow = windows( state, {
                type: TYPES.ADD_WINDOW,
                payload: { windowId: 2 }
            } );
            expect( addWindow ).not.toStrictEqual( state );
            expect( addWindow ).toEqual( {
                openWindows: {
                    [firstWindowId]: {
                        ...basicwindow
                    },
                    [secondWindowId]: {
                        ...basicwindow
                    }
                },
                closedWindows: {
                    [firstWindowId]: {
                        closedTabs: [],
                        lastActiveTabs: []
                    },
                    [secondWindowId]: {
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
                    [firstWindowId]: {
                        ...basicwindow,
                        tabs: []
                    }
                },
                closedWindows: {
                    [firstWindowId]: {
                        closedTabs: [],
                        lastActiveTabs: []
                    }
                }
            };
            const addTabNext = windows( state, {
                type: TYPES.ADD_TAB_NEXT,
                payload: { windowId: 1, tabId }
            } );
            expect( addTabNext ).not.toStrictEqual( state );
            expect( addTabNext.openWindows ).not.toStrictEqual( state.openWindows );
            expect( addTabNext.openWindows[firstWindowId] ).not.toStrictEqual(
                state.openWindows[firstWindowId]
            );
            expect( addTabNext.closedWindows ).toStrictEqual( state.closedWindows );
            expect( addTabNext.closedWindows[firstWindowId] ).toStrictEqual(
                state.closedWindows[firstWindowId]
            );
            expect( addTabNext ).toEqual( {
                openWindows: {
                    [firstWindowId]: {
                        ...basicwindow,
                        tabs: [tabId]
                    }
                },
                closedWindows: {
                    [firstWindowId]: {
                        closedTabs: [],
                        lastActiveTabs: []
                    }
                }
            } );
        } );
        it( 'should add another tab without passing the index', () => {
            const state = {
                openWindows: {
                    [firstWindowId]: {
                        ...basicwindow,
                        tabs: [tabId]
                    }
                },
                closedWindows: {
                    [firstWindowId]: {
                        closedTabs: [],
                        lastActiveTabs: []
                    }
                }
            };
            const addTabNext = windows( state, {
                type: TYPES.ADD_TAB_NEXT,
                payload: { windowId: 1, tabId: tabId1 }
            } );
            expect( addTabNext ).not.toStrictEqual( state );
            expect( addTabNext.openWindows ).not.toStrictEqual( state.openWindows );
            expect( addTabNext.openWindows[firstWindowId] ).not.toStrictEqual(
                state.openWindows[firstWindowId]
            );
            expect( addTabNext.closedWindows ).toStrictEqual( state.closedWindows );
            expect( addTabNext.closedWindows[firstWindowId] ).toStrictEqual(
                state.closedWindows[firstWindowId]
            );
            expect( addTabNext ).toEqual( {
                openWindows: {
                    [firstWindowId]: {
                        ...basicwindow,
                        tabs: [tabId1, tabId]
                    }
                },
                closedWindows: {
                    [firstWindowId]: {
                        closedTabs: [],
                        lastActiveTabs: []
                    }
                }
            } );
        } );
        it( 'should add another tab with passing the index', () => {
            const state = {
                openWindows: {
                    [firstWindowId]: {
                        ...basicwindow,
                        tabs: [tabId1, tabId]
                    }
                },
                closedWindows: {
                    [firstWindowId]: {
                        closedTabs: [],
                        lastActiveTabs: []
                    }
                }
            };
            const addTabNext = windows( state, {
                type: TYPES.ADD_TAB_NEXT,
                payload: { windowId: 1, tabId: tabId2, tabIndex: 0 }
            } );
            expect( addTabNext ).not.toStrictEqual( state );
            expect( addTabNext.openWindows ).not.toStrictEqual( state.openWindows );
            expect( addTabNext.openWindows[firstWindowId] ).not.toStrictEqual(
                state.openWindows[firstWindowId]
            );
            expect( addTabNext.closedWindows ).toStrictEqual( state.closedWindows );
            expect( addTabNext.closedWindows[firstWindowId] ).toStrictEqual(
                state.closedWindows[firstWindowId]
            );
            expect( addTabNext ).toEqual( {
                openWindows: {
                    [firstWindowId]: {
                        ...basicwindow,
                        tabs: [tabId1, tabId2, tabId]
                    }
                },
                closedWindows: {
                    [firstWindowId]: {
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
                    [firstWindowId]: {
                        ...basicwindow
                    }
                },
                closedWindows: {
                    [firstWindowId]: {
                        closedTabs: [],
                        lastActiveTabs: []
                    }
                }
            };
            const addTabEnd = windows( state, {
                type: TYPES.ADD_TAB_END,
                payload: { windowId: 1, tabId }
            } );
            expect( addTabEnd ).not.toStrictEqual( state );
            expect( addTabEnd.openWindows ).not.toStrictEqual( state.openWindows );
            expect( addTabEnd.openWindows[firstWindowId] ).not.toStrictEqual(
                state.openWindows[firstWindowId]
            );
            expect( addTabEnd.closedWindows ).toStrictEqual( state.closedWindows );
            expect( addTabEnd.closedWindows[firstWindowId] ).toStrictEqual(
                state.closedWindows[firstWindowId]
            );
            expect( addTabEnd ).toEqual( {
                openWindows: {
                    [firstWindowId]: {
                        ...basicwindow,
                        tabs: [tabId]
                    }
                },
                closedWindows: {
                    [firstWindowId]: {
                        closedTabs: [],
                        lastActiveTabs: []
                    }
                }
            } );
        } );
        it( 'add another tab at the end', () => {
            const state = {
                openWindows: {
                    [firstWindowId]: {
                        ...basicwindow,
                        tabs: [tabId]
                    }
                },
                closedWindows: {
                    [firstWindowId]: {
                        closedTabs: [],
                        lastActiveTabs: []
                    }
                }
            };
            const addTabEnd = windows( state, {
                type: TYPES.ADD_TAB_END,
                payload: { windowId: 1, tabId: tabId1 }
            } );
            expect( addTabEnd ).not.toStrictEqual( state );
            expect( addTabEnd.openWindows ).not.toStrictEqual( state.openWindows );
            expect( addTabEnd.openWindows[firstWindowId] ).not.toStrictEqual(
                state.openWindows[firstWindowId]
            );
            expect( addTabEnd.closedWindows ).toStrictEqual( state.closedWindows );
            expect( addTabEnd.closedWindows[firstWindowId] ).toStrictEqual(
                state.closedWindows[firstWindowId]
            );
            expect( addTabEnd ).toEqual( {
                openWindows: {
                    [firstWindowId]: {
                        ...basicwindow,
                        tabs: [tabId, tabId1]
                    }
                },
                closedWindows: {
                    [firstWindowId]: {
                        closedTabs: [],
                        lastActiveTabs: []
                    }
                }
            } );
        } );
        it( 'add tab at the end of another window', () => {
            const state = {
                openWindows: {
                    [firstWindowId]: {
                        ...basicwindow,
                        tabs: [tabId, tabId1]
                    },
                    [secondWindowId]: {
                        ...basicwindow,
                        tabs: []
                    }
                },
                closedWindows: {
                    [firstWindowId]: {
                        closedTabs: [],
                        lastActiveTabs: []
                    },
                    [secondWindowId]: {
                        closedTabs: [],
                        lastActiveTabs: []
                    }
                }
            };
            const addTabEnd = windows( state, {
                type: TYPES.ADD_TAB_END,
                payload: { windowId: 2, tabId: tabId2 }
            } );
            expect( addTabEnd ).not.toStrictEqual( state );
            expect( addTabEnd.openWindows ).not.toStrictEqual( state.openWindows );
            expect( addTabEnd.openWindows[firstWindowId] ).toStrictEqual(
                state.openWindows[firstWindowId]
            );
            expect( addTabEnd.openWindows[secondWindowId] ).not.toStrictEqual(
                state.openWindows[secondWindowId]
            );
            expect( addTabEnd.closedWindows ).toStrictEqual( state.closedWindows );
            expect( addTabEnd ).toEqual( {
                openWindows: {
                    [firstWindowId]: {
                        ...basicwindow,
                        tabs: [tabId, tabId1]
                    },
                    [secondWindowId]: {
                        ...basicwindow,
                        tabs: [tabId2]
                    }
                },
                closedWindows: {
                    [firstWindowId]: {
                        closedTabs: [],
                        lastActiveTabs: []
                    },
                    [secondWindowId]: {
                        closedTabs: [],
                        lastActiveTabs: []
                    }
                }
            } );
        } );
        it( 'add one last tab at the end of the initial window', () => {
            const state = {
                openWindows: {
                    [firstWindowId]: {
                        ...basicwindow,
                        tabs: [tabId, tabId1]
                    },
                    [secondWindowId]: {
                        ...basicwindow,
                        tabs: [tabId2]
                    }
                },
                closedWindows: {
                    [firstWindowId]: {
                        closedTabs: [],
                        lastActiveTabs: []
                    },
                    [secondWindowId]: {
                        closedTabs: [],
                        lastActiveTabs: []
                    }
                }
            };
            const addTabEnd = windows( state, {
                type: TYPES.ADD_TAB_END,
                payload: { windowId: 1, tabId: tabId3 }
            } );
            expect( addTabEnd ).not.toStrictEqual( state );
            expect( addTabEnd.openWindows ).not.toStrictEqual( state.openWindows );
            expect( addTabEnd.openWindows[firstWindowId] ).not.toStrictEqual(
                state.openWindows[firstWindowId]
            );
            expect( addTabEnd.openWindows[secondWindowId] ).toStrictEqual(
                state.openWindows[secondWindowId]
            );
            expect( addTabEnd.closedWindows ).toStrictEqual( state.closedWindows );
            expect( addTabEnd ).toEqual( {
                openWindows: {
                    [firstWindowId]: {
                        ...basicwindow,
                        tabs: [tabId, tabId1, tabId3]
                    },
                    [secondWindowId]: {
                        ...basicwindow,
                        tabs: [tabId2]
                    }
                },
                closedWindows: {
                    [firstWindowId]: {
                        closedTabs: [],
                        lastActiveTabs: []
                    },
                    [secondWindowId]: {
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
                    [firstWindowId]: {
                        ...basicwindow,
                        tabs: [tabId]
                    }
                },
                closedWindows: {
                    [firstWindowId]: {
                        closedTabs: [],
                        lastActiveTabs: []
                    }
                }
            };
            const setActiveTab = windows( state, {
                type: TYPES.SET_ACTIVE_TAB,
                payload: { windowId: 1, tabId }
            } );
            expect( setActiveTab ).not.toStrictEqual( state );
            expect( setActiveTab.openWindows ).not.toStrictEqual( state.openWindows );
            expect( setActiveTab.openWindows[firstWindowId] ).not.toStrictEqual(
                state.openWindows[firstWindowId]
            );
            expect(
                setActiveTab.openWindows[firstWindowId].activeTab
            ).not.toStrictEqual( state.openWindows[firstWindowId].activeTab );
            expect( setActiveTab.openWindows[firstWindowId].ui ).toStrictEqual(
                state.openWindows[firstWindowId].ui
            );
            expect( setActiveTab.openWindows[firstWindowId].tabs ).toStrictEqual(
                state.openWindows[firstWindowId].tabs
            );
            expect( setActiveTab ).toEqual( {
                openWindows: {
                    [firstWindowId]: {
                        ...basicwindow,
                        activeTab: tabId,
                        tabs: [tabId]
                    }
                },
                closedWindows: {
                    [firstWindowId]: {
                        closedTabs: [],
                        lastActiveTabs: []
                    }
                }
            } );
        } );
        it( 'should set another tab to active tab', () => {
            const state = {
                openWindows: {
                    [firstWindowId]: {
                        ...basicwindow,
                        tabs: [tabId, tabId1]
                    }
                },
                closedWindows: {
                    [firstWindowId]: {
                        closedTabs: [],
                        lastActiveTabs: []
                    }
                }
            };
            const setActiveTab = windows( state, {
                type: TYPES.SET_ACTIVE_TAB,
                payload: { windowId: 1, tabId: tabId1 }
            } );
            expect( setActiveTab ).not.toStrictEqual( state );
            expect( setActiveTab.openWindows ).not.toStrictEqual( state.openWindows );
            expect( setActiveTab.openWindows[firstWindowId] ).not.toStrictEqual(
                state.openWindows[firstWindowId]
            );
            expect(
                setActiveTab.openWindows[firstWindowId].activeTab
            ).not.toStrictEqual( state.openWindows[firstWindowId].activeTab );
            expect( setActiveTab.openWindows[firstWindowId].ui ).toStrictEqual(
                state.openWindows[firstWindowId].ui
            );
            expect( setActiveTab.openWindows[firstWindowId].tabs ).toStrictEqual(
                state.openWindows[firstWindowId].tabs
            );
            expect( setActiveTab ).toEqual( {
                openWindows: {
                    [firstWindowId]: {
                        ...basicwindow,
                        activeTab: tabId1,
                        tabs: [tabId, tabId1]
                    }
                },
                closedWindows: {
                    [firstWindowId]: {
                        closedTabs: [],
                        lastActiveTabs: []
                    }
                }
            } );
        } );
        it( 'should set another new Tab to Active tab in new window', () => {
            const state = {
                openWindows: {
                    [firstWindowId]: {
                        ...basicwindow,
                        activeTab: tabId,
                        tabs: [tabId]
                    },
                    [secondWindowId]: {
                        ...basicwindow,
                        tabs: [tabId1]
                    }
                },
                closedWindows: {
                    [firstWindowId]: {
                        closedTabs: [],
                        lastActiveTabs: []
                    },
                    [secondWindowId]: {
                        closedTabs: [],
                        lastActiveTabs: []
                    }
                }
            };
            const setActiveTab = windows( state, {
                type: TYPES.SET_ACTIVE_TAB,
                payload: { windowId: 2, tabId: tabId1 }
            } );
            expect( setActiveTab ).not.toStrictEqual( state );
            expect( setActiveTab.openWindows ).not.toStrictEqual( state.openWindows );
            expect( setActiveTab.openWindows[firstWindowId] ).toStrictEqual(
                state.openWindows[firstWindowId]
            );
            expect( setActiveTab.openWindows[firstWindowId].activeTab ).toStrictEqual(
                state.openWindows[firstWindowId].activeTab
            );
            expect( setActiveTab.openWindows[firstWindowId].ui ).toStrictEqual(
                state.openWindows[firstWindowId].ui
            );
            expect( setActiveTab.openWindows[firstWindowId].tabs ).toStrictEqual(
                state.openWindows[firstWindowId].tabs
            );
            expect( setActiveTab.openWindows[secondWindowId] ).not.toStrictEqual(
                state.openWindows[secondWindowId]
            );
            expect(
                setActiveTab.openWindows[secondWindowId].activeTab
            ).not.toStrictEqual( state.openWindows[secondWindowId].activeTab );
            expect( setActiveTab.openWindows[secondWindowId].ui ).toStrictEqual(
                state.openWindows[secondWindowId].ui
            );
            expect( setActiveTab.openWindows[secondWindowId].tabs ).toStrictEqual(
                state.openWindows[secondWindowId].tabs
            );
            expect( setActiveTab ).toEqual( {
                openWindows: {
                    [firstWindowId]: {
                        ...basicwindow,
                        activeTab: tabId,
                        tabs: [tabId]
                    },
                    [secondWindowId]: {
                        ...basicwindow,
                        activeTab: tabId1,
                        tabs: [tabId1]
                    }
                },
                closedWindows: {
                    [firstWindowId]: {
                        closedTabs: [],
                        lastActiveTabs: []
                    },
                    [secondWindowId]: {
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
                    [firstWindowId]: {
                        ...basicwindow,
                        tabs: [tabId, tabId2, tabId1]
                    }
                },
                closedWindows: {
                    [firstWindowId]: {
                        closedTabs: [],
                        lastActiveTabs: []
                    }
                }
            };
            const closeTab = windows( state, {
                type: TYPES.WINDOW_CLOSE_TAB,
                payload: { windowId: 1, tabId }
            } );
            expect( closeTab ).not.toStrictEqual( state );
            expect( closeTab.openWindows ).not.toStrictEqual( state.openWindows );
            expect( closeTab.openWindows[firstWindowId] ).not.toStrictEqual(
                state.openWindows[firstWindowId]
            );
            expect( closeTab.closedWindows ).not.toStrictEqual( state.closedWindows );
            expect( closeTab.closedWindows[firstWindowId] ).not.toStrictEqual(
                state.closedWindows[firstWindowId]
            );
            expect( closeTab ).toEqual( {
                openWindows: {
                    [firstWindowId]: {
                        ...basicwindow,
                        activeTab: tabId2,
                        tabs: [tabId2, tabId1]
                    }
                },
                closedWindows: {
                    [firstWindowId]: {
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
                    [firstWindowId]: {
                        ...basicwindow,
                        tabs: [tabId, tabId2, tabId1]
                    }
                },
                closedWindows: {
                    [firstWindowId]: {
                        closedTabs: [],
                        lastActiveTabs: []
                    }
                }
            };
            const closeTab = windows( state, {
                type: TYPES.WINDOW_CLOSE_TAB,
                payload: { windowId: 1, tabId: tabId2 }
            } );
            expect( closeTab ).not.toStrictEqual( state );
            expect( closeTab.openWindows ).not.toStrictEqual( state.openWindows );
            expect( closeTab.openWindows[firstWindowId] ).not.toStrictEqual(
                state.openWindows[firstWindowId]
            );
            expect( closeTab.closedWindows ).not.toStrictEqual( state.closedWindows );
            expect( closeTab.closedWindows[firstWindowId] ).not.toStrictEqual(
                state.closedWindows[firstWindowId]
            );
            expect( closeTab ).toEqual( {
                openWindows: {
                    [firstWindowId]: {
                        ...basicwindow,
                        activeTab: tabId1,
                        tabs: [tabId, tabId1]
                    }
                },
                closedWindows: {
                    [firstWindowId]: {
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
                    [firstWindowId]: {
                        ...basicwindow,
                        activeTab: tabId,
                        tabs: [tabId1]
                    },
                    [secondWindowId]: {
                        ...basicwindow,
                        activeTab: tabId3,
                        tabs: [tabId2, tabId3]
                    }
                },
                closedWindows: {
                    [firstWindowId]: {
                        closedTabs: [
                            {
                                lastTabIndex: 0,
                                tabId
                            }
                        ],
                        lastActiveTabs: []
                    },
                    [secondWindowId]: {
                        closedTabs: [],
                        lastActiveTabs: []
                    }
                }
            };
            const closeTab = windows( state, {
                type: TYPES.WINDOW_CLOSE_TAB,
                payload: { windowId: 2, tabId: tabId2 }
            } );
            expect( closeTab ).not.toStrictEqual( state );
            expect( closeTab.openWindows ).not.toStrictEqual( state.openWindows );
            expect( closeTab.openWindows[firstWindowId] ).toStrictEqual(
                state.openWindows[firstWindowId]
            );
            expect( closeTab.openWindows[secondWindowId] ).not.toStrictEqual(
                state.openWindows[secondWindowId]
            );
            expect( closeTab.closedWindows ).not.toStrictEqual( state.closedWindows );
            expect( closeTab.closedWindows[firstWindowId] ).toStrictEqual(
                state.closedWindows[firstWindowId]
            );
            expect( closeTab.closedWindows[secondWindowId] ).not.toStrictEqual(
                state.closedWindows[secondWindowId]
            );
            expect( closeTab ).toEqual( {
                openWindows: {
                    [firstWindowId]: {
                        ...basicwindow,
                        activeTab: tabId,
                        tabs: [tabId1]
                    },
                    [secondWindowId]: {
                        ...basicwindow,
                        activeTab: tabId3,
                        tabs: [tabId3]
                    }
                },
                closedWindows: {
                    [firstWindowId]: {
                        closedTabs: [
                            {
                                lastTabIndex: 0,
                                tabId
                            }
                        ],
                        lastActiveTabs: []
                    },
                    [secondWindowId]: {
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
                    [firstWindowId]: {
                        ...basicwindow,
                        tabs: [tabId1]
                    }
                },
                closedWindows: {
                    [firstWindowId]: {
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
            expect( reopenTab ).not.toStrictEqual( state );
            expect( reopenTab.openWindows[firstWindowId] ).not.toStrictEqual(
                state.openWindows[firstWindowId]
            );
            expect( reopenTab.openWindows[firstWindowId].ui ).toStrictEqual(
                state.openWindows[firstWindowId].ui
            );
            expect( reopenTab.openWindows[firstWindowId].activeTab ).toStrictEqual(
                state.openWindows[firstWindowId].activeTab
            );
            expect( reopenTab.openWindows[firstWindowId].tabs ).not.toStrictEqual(
                state.openWindows[firstWindowId].tabs
            );
            expect( reopenTab.closedWindows[firstWindowId] ).not.toStrictEqual(
                state.closedWindows[firstWindowId]
            );
            expect(
                reopenTab.closedWindows[firstWindowId].closedTabs
            ).not.toStrictEqual( state.closedWindows[firstWindowId].closedTabs );
            expect(
                reopenTab.closedWindows[firstWindowId].lastActiveTabs
            ).toStrictEqual( state.closedWindows[firstWindowId].lastActiveTabs );
            expect( reopenTab ).toEqual( {
                openWindows: {
                    [firstWindowId]: {
                        ...basicwindow,
                        tabs: [tabId1, tabId2]
                    }
                },
                closedWindows: {
                    [firstWindowId]: {
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
                    [firstWindowId]: {
                        ...basicwindow,
                        tabs: [tabId1, tabId2]
                    }
                },
                closedWindows: {
                    [firstWindowId]: {
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
            expect( reopenTab ).not.toStrictEqual( state );
            expect( reopenTab.openWindows[firstWindowId] ).not.toStrictEqual(
                state.openWindows[firstWindowId]
            );
            expect( reopenTab.openWindows[firstWindowId].ui ).toStrictEqual(
                state.openWindows[firstWindowId].ui
            );
            expect( reopenTab.openWindows[firstWindowId].activeTab ).toStrictEqual(
                state.openWindows[firstWindowId].activeTab
            );
            expect( reopenTab.openWindows[firstWindowId].tabs ).not.toStrictEqual(
                state.openWindows[firstWindowId].tabs
            );
            expect( reopenTab.closedWindows[firstWindowId] ).not.toStrictEqual(
                state.closedWindows[firstWindowId]
            );
            expect(
                reopenTab.closedWindows[firstWindowId].closedTabs
            ).not.toStrictEqual( state.closedWindows[firstWindowId].closedTabs );
            expect(
                reopenTab.closedWindows[firstWindowId].lastActiveTabs
            ).toStrictEqual( state.closedWindows[firstWindowId].lastActiveTabs );
            expect( reopenTab ).toEqual( {
                openWindows: {
                    [firstWindowId]: {
                        ...basicwindow,
                        tabs: [tabId1, tabId, tabId2]
                    }
                },
                closedWindows: {
                    [firstWindowId]: {
                        closedTabs: [],
                        lastActiveTabs: []
                    }
                }
            } );
        } );
        it( 'should reopen a closed tab in another window', () => {
            const state = {
                openWindows: {
                    [firstWindowId]: {
                        ...basicwindow,
                        tabs: [tabId3]
                    },
                    [secondWindowId]: {
                        ...basicwindow,
                        tabs: [tabId1, tabId2]
                    }
                },
                closedWindows: {
                    [firstWindowId]: {
                        closedTabs: [],
                        lastActiveTabs: []
                    },
                    [secondWindowId]: {
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
            expect( reopenTab ).not.toStrictEqual( state );
            expect( reopenTab.openWindows[firstWindowId] ).toStrictEqual(
                state.openWindows[firstWindowId]
            );
            expect( reopenTab.closedWindows[firstWindowId] ).toStrictEqual(
                state.closedWindows[firstWindowId]
            );

            expect( reopenTab.openWindows[secondWindowId] ).not.toStrictEqual(
                state.openWindows[secondWindowId]
            );
            expect( reopenTab.openWindows[secondWindowId].ui ).toStrictEqual(
                state.openWindows[secondWindowId].ui
            );
            expect( reopenTab.openWindows[secondWindowId].activeTab ).toStrictEqual(
                state.openWindows[secondWindowId].activeTab
            );
            expect( reopenTab.openWindows[secondWindowId].tabs ).not.toStrictEqual(
                state.openWindows[secondWindowId].tabs
            );
            expect( reopenTab.closedWindows[secondWindowId] ).not.toStrictEqual(
                state.closedWindows[secondWindowId]
            );
            expect(
                reopenTab.closedWindows[secondWindowId].closedTabs
            ).not.toStrictEqual( state.closedWindows[secondWindowId].closedTabs );
            expect(
                reopenTab.closedWindows[secondWindowId].lastActiveTabs
            ).toStrictEqual( state.closedWindows[secondWindowId].lastActiveTabs );
            expect( reopenTab ).toEqual( {
                openWindows: {
                    [firstWindowId]: {
                        ...basicwindow,
                        tabs: [tabId3]
                    },
                    [secondWindowId]: {
                        ...basicwindow,
                        tabs: [tabId1, tabId, tabId2]
                    }
                },
                closedWindows: {
                    [firstWindowId]: {
                        closedTabs: [],
                        lastActiveTabs: []
                    },
                    [secondWindowId]: {
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
                    [firstWindowId]: {
                        ...basicwindow,
                        tabs: [tabId, tabId1, tabId2]
                    },
                    [secondWindowId]: {
                        ...basicwindow,
                        tabs: [tabId3]
                    }
                },
                closedWindows: {
                    [firstWindowId]: {
                        closedTabs: [],
                        lastActiveTabs: []
                    },
                    [secondWindowId]: {
                        closedTabs: [],
                        lastActiveTabs: []
                    }
                }
            };
            const closeWindow = windows( state, {
                type: TYPES.CLOSE_WINDOW,
                payload: { windowId: 1 }
            } );
            expect( closeWindow ).not.toStrictEqual( state );
            expect( closeWindow.openWindows ).not.toStrictEqual( state.openWindows );
            expect( closeWindow.openWindows[firstWindowId] === undefined ).toEqual(
                true
            );
            expect( closeWindow.closedWindows ).not.toStrictEqual( state.closedWindows );
            expect( closeWindow ).toEqual( {
                openWindows: {
                    [secondWindowId]: {
                        ...basicwindow,
                        tabs: [tabId3]
                    }
                },
                closedWindows: {
                    [firstWindowId]: {
                        closedTabs: [],
                        lastActiveTabs: [tabId, tabId1, tabId2]
                    },
                    [secondWindowId]: {
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
                    [firstWindowId]: {
                        ...basicwindow,
                        tabs: [tabId]
                    },
                    [secondWindowId]: {
                        ...basicwindow,
                        tabs: []
                    }
                },
                closedWindows: {
                    [firstWindowId]: {
                        closedTabs: [],
                        lastActiveTabs: []
                    },
                    [secondWindowId]: {
                        closedTabs: [],
                        lastActiveTabs: []
                    }
                }
            };
            const showSettingsMenu = windows( state, {
                type: TYPES.SHOW_SETTINGS_MENU,
                payload: { windowId: 1 }
            } );
            expect( showSettingsMenu ).not.toStrictEqual( state );
            expect( showSettingsMenu.openWindows[firstWindowId] ).not.toStrictEqual(
                state.openWindows[firstWindowId]
            );
            expect(
                showSettingsMenu.openWindows[firstWindowId].activeTab
            ).toStrictEqual( state.openWindows[firstWindowId].activeTab );
            expect( showSettingsMenu.openWindows[firstWindowId].tabs ).toStrictEqual(
                state.openWindows[firstWindowId].tabs
            );
            expect( showSettingsMenu.openWindows[firstWindowId].ui ).not.toStrictEqual(
                state.openWindows[firstWindowId].ui
            );
            expect( showSettingsMenu.openWindows[secondWindowId] ).toStrictEqual(
                state.openWindows[secondWindowId]
            );
            expect( showSettingsMenu.closedWindows[secondWindowId] ).toStrictEqual(
                state.closedWindows[secondWindowId]
            );
            expect( showSettingsMenu ).toEqual( {
                openWindows: {
                    [firstWindowId]: {
                        ...basicwindow,
                        tabs: [tabId],
                        ui: {
                            settingsMenuIsVisible: true
                        }
                    },
                    [secondWindowId]: {
                        ...basicwindow,
                        tabs: []
                    }
                },
                closedWindows: {
                    [firstWindowId]: {
                        closedTabs: [],
                        lastActiveTabs: []
                    },
                    [secondWindowId]: {
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
                    [firstWindowId]: {
                        ...basicwindow,
                        tabs: [tabId],
                        ui: {
                            settingsMenuIsVisible: true
                        }
                    },
                    [secondWindowId]: {
                        ...basicwindow,
                        tabs: []
                    }
                },
                closedWindows: {
                    [firstWindowId]: {
                        closedTabs: [],
                        lastActiveTabs: []
                    },
                    [secondWindowId]: {
                        closedTabs: [],
                        lastActiveTabs: []
                    }
                }
            };
            const hideSettingsMenu = windows( state, {
                type: TYPES.HIDE_SETTINGS_MENU,
                payload: { windowId: 1 }
            } );
            expect( hideSettingsMenu ).not.toStrictEqual( state );
            expect( hideSettingsMenu.openWindows[firstWindowId] ).not.toStrictEqual(
                state.openWindows[firstWindowId]
            );
            expect(
                hideSettingsMenu.openWindows[firstWindowId].activeTab
            ).toStrictEqual( state.openWindows[firstWindowId].activeTab );
            expect( hideSettingsMenu.openWindows[firstWindowId].tabs ).toStrictEqual(
                state.openWindows[firstWindowId].tabs
            );
            expect( hideSettingsMenu.openWindows[firstWindowId].ui ).not.toStrictEqual(
                state.openWindows[firstWindowId].ui
            );
            expect( hideSettingsMenu.openWindows[secondWindowId] ).toStrictEqual(
                state.openWindows[secondWindowId]
            );
            expect( hideSettingsMenu.closedWindows[secondWindowId] ).toStrictEqual(
                state.closedWindows[secondWindowId]
            );
            expect( hideSettingsMenu ).toEqual( {
                openWindows: {
                    [firstWindowId]: {
                        ...basicwindow,
                        tabs: [tabId],
                        ui: {
                            settingsMenuIsVisible: false
                        }
                    },
                    [secondWindowId]: {
                        ...basicwindow,
                        tabs: []
                    }
                },
                closedWindows: {
                    [firstWindowId]: {
                        closedTabs: [],
                        lastActiveTabs: []
                    },
                    [secondWindowId]: {
                        closedTabs: [],
                        lastActiveTabs: []
                    }
                }
            } );
        } );
    } );
} );
