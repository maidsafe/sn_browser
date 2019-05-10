import { ipcRenderer, remote } from 'electron';
import React, { Component } from 'react';
import { AddressBar } from '$Components/AddressBar';
import { TabBar } from '$Components/TabBar';
import { TabContents } from '$Components/TabContents';
// import { logger } from '$Logger';
import { extendComponent } from '$Utils/extendComponent';
import { wrapBrowserComponent } from '$Extensions/components';
import { isEqual } from 'lodash';
import styles from './browser.css';
import { handleNotifications, Notification } from '$Utils/handleNotificiations';

interface BrowserProps {
    bookmarks?: Array<any>;
    notifications: Array<Notification>;
    tabs: object;
    windows: object;
    windowId: any;
    addBookmark: ( ...args: Array<any> ) => any;
    removeBookmark: ( ...args: Array<any> ) => any;
    addWindow: ( ...args: Array<any> ) => any;
    addTabNext: ( ...args: Array<any> ) => any;
    addTabEnd: ( ...args: Array<any> ) => any;
    setActiveTab: ( ...args: Array<any> ) => any;
    windowCloseTab: ( ...args: Array<any> ) => any;
    reopenTab: ( ...args: Array<any> ) => any;
    closeWindow: ( ...args: Array<any> ) => any;
    showSettingsMenu: ( ...args: Array<any> ) => any;
    hideSettingsMenu: ( ...args: Array<any> ) => any;
    addTab: ( ...args: Array<any> ) => any;
    updateTab: ( ...args: Array<any> ) => any;
    tabForwards: ( ...args: Array<any> ) => any;
    tabBackwards: ( ...args: Array<any> ) => any;
    focusWebview: ( ...args: Array<any> ) => any;
    blurAddressBar: ( ...args: Array<any> ) => any;
    selectAddressBar: ( ...args: Array<any> ) => any;
    deselectAddressBar: ( ...args: Array<any> ) => any;
    updateNotification: ( ...args: Array<any> ) => any;
    clearNotification: ( ...args: Array<any> ) => any;
}

class Browser extends Component<BrowserProps, {}> {
    static defaultProps = {
        addressBarIsSelected: false,
        tabs: {},
        windows: {},
        bookmarks: [],
        notifications: []
    };

    constructor( props ) {
        super( props );
        this.state = {};

        console.log( 'browser constructed-----' );
    }

    componentDidMount() {
        const {
            addTab,
            addTabEnd,
            setActiveTab,
            windowCloseTab,
            reopenTab,
            clearNotification,
            tabForwards,
            tabBackwards
        } = this.props;
        const addressBar = this.address;
        const theBrowser = this;
        const body = document.querySelector( 'body' );
        const div = document.createElement( 'div' );
        div.setAttribute( 'class', 'no_display' );
        div.setAttribute( 'id', 'link_revealer' );
        body.append( div );
    }

    static getDerivedStateFromProps( props, state ) {
        const { bookmarks, safeBrowserApp, tabs, windows, windowId } = props;

        const experimentsEnabled = safeBrowserApp
            ? safeBrowserApp.experimentsEnabled
            : false;

        // only show the first notification without a response.
        // TODO: Move windowId from state to store.
        const windowsTabs = windows.openWindows[windowId]
            ? windows.openWindows[windowId].tabs
            : [];

        const thisWindowOpenTabs = [];

        windowsTabs.forEach( ( tabId ) => {
            const aTab = tabs[tabId];

            if ( !aTab ) return;

            thisWindowOpenTabs.push( tabs[tabId] );
        } );

        const activeTabId = windows.openWindows[windowId]
            ? windows.openWindows[windowId].activeTab
            : undefined;

        const activeTab = activeTabId !== undefined ? tabs[activeTabId] : undefined;

        const activeTabAddress = activeTab ? activeTab.url : '';

        const activeTabIsBookmarked = !!bookmarks.find(
            ( bookmark ) => bookmark.url === activeTabAddress
        );
        const activeTabAddressIsSelected = tabs[activeTabId]
            ? tabs[activeTabId].ui.addressBarIsSelected
            : false;

        const { shouldFocusWebview } = activeTabId && tabs[activeTabId]
            ? tabs[activeTabId].ui.shouldFocusWebview
            : false;
        const { settingsMenuIsVisible } = windows.openWindows[windowId]
            ? windows.openWindows[windowId].ui
            : false;

        return {
            activeTab,
            activeTabId,
            activeTabAddress,
            activeTabIsBookmarked,
            activeTabAddressIsSelected,
            openTabs: thisWindowOpenTabs,
            shouldFocusWebview,
            settingsMenuIsVisible,
            windowId,
            experimentsEnabled
        };
    }

    componentDidUpdate = ( prevProps: BrowserProps ) => {
        const currentProps = { ...this.props };
        handleNotifications( prevProps, currentProps );
    };

    render() {
        const { props } = this;
        const {
            // bookmarks
            bookmarks,
            addBookmark,
            removeBookmark,
            // tabs
            tabs,
            updateTab,
            tabForwards,
            selectAddressBar,
            deselectAddressBar,
            tabBackwards,
            focusWebview,
            blurAddressBar,
            // Notifications
            addNotification,
            updateNotification, // remove if not needed
            clearNotification, // remove if not needed
            // windows
            windows,
            addWindow, // remove if not needed
            setActiveTab,
            windowCloseTab,
            reopenTab, // remove if not needed
            closeWindow, // remove if not needed
            showSettingsMenu,
            hideSettingsMenu,
            // TODO extend tab to not need this
            safeBrowserApp
        } = props;

        const {
            activeTab,
            activeTabId,
            activeTabAddress,
            activeTabIsBookmarked,
            activeTabAddressIsSelected,
            shouldFocusWebview,
            settingsMenuIsVisible,
            windowId,
            openTabs,
            experimentsEnabled
        } = this.state;

        console.log( 'OPEN TABS AS WE SEEEEEE', openTabs );

        return (
            <div className={styles.container}>
                <TabBar
                    key={1}
                    updateTab={updateTab}
                    setActiveTab={setActiveTab}
                    selectAddressBar={selectAddressBar}
                    activeTabId={activeTabId}
                    activeTab={activeTab}
                    addTabNext={this.handleAddTabNext}
                    addTabEnd={this.handleAddTabEnd}
                    closeTab={this.handleCloseBrowserTab}
                    tabs={openTabs}
                    windows={windows}
                    windowId={windowId}
                />
                <AddressBar
                    key={2}
                    address={activeTabAddress}
                    activeTab={activeTab}
                    tabId={activeTabId}
                    onSelect={deselectAddressBar}
                    onFocus={selectAddressBar}
                    setActiveTab={setActiveTab}
                    onBlur={blurAddressBar}
                    addBookmark={addBookmark}
                    isBookmarked={activeTabIsBookmarked}
                    addTabNext={this.handleAddTabNext}
                    addTabEnd={this.handleAddTabEnd}
                    removeBookmark={removeBookmark}
                    hideSettingsMenu={hideSettingsMenu}
                    showSettingsMenu={showSettingsMenu}
                    settingsMenuIsVisible={settingsMenuIsVisible}
                    isSelected={activeTabAddressIsSelected}
                    tabBackwards={tabBackwards}
                    tabForwards={tabForwards}
                    updateTab={updateTab}
                    windowId={windowId}
                    focusWebview={focusWebview}
                    ref={( c ) => {
                        this.address = c;
                    }}
                />
                <TabContents
                    key={4}
                    tabBackwards={tabBackwards}
                    focusWebview={focusWebview}
                    shouldFocusWebview={shouldFocusWebview}
                    closeTab={windowCloseTab}
                    addTabNext={this.handleAddTabNext}
                    addTabEnd={this.handleAddTabEnd}
                    addNotification={addNotification}
                    activeTabId={activeTabId}
                    activeTab={activeTab}
                    updateTab={updateTab}
                    setActiveTab={setActiveTab}
                    tabs={openTabs}
                    allTabs={tabs}
                    bookmarks={bookmarks}
                    windowId={windowId}
                    safeExperimentsEnabled={experimentsEnabled}
                    ref={( c ) => {
                        this.tabContents = c;
                    }}
                />
            </div>
        );
    // TODO: if not, lets trigger close?
    }

    handleCloseBrowserTab = ( tab ) => {
        const { windows, windowCloseTab, windowId } = this.props;
        const openTabIds = windows.openWindows[windowId].tabs;
        if ( openTabIds.length === 1 ) {
            ipcRenderer.send( 'command:close-window' );
        } else {
            windowCloseTab( tab );
        }
    };

    handleAddTabEnd = ( tab ) => {
        const { addTabEnd, addTab, setActiveTab, windowId } = this.props;
        const { url, tabId } = tab;
        addTab( { url, tabId } );
        addTabEnd( { windowId, tabId } );
        setActiveTab( { windowId, tabId } );
    };

    handleAddTabNext = ( tab ) => {
        const { addTab, addTabEnd, setActiveTab, windowId } = this.props;
        const { tabId, url, tabIndex } = tab;
        addTab( { tabId, url } );
        if ( tabIndex !== undefined ) {
            addTabEnd( { tabId, tabIndex, windowId } );
        } else {
            addTabEnd( { tabId, windowId } );
        }
        setActiveTab( { tabId, windowId } );
    };
}
export const ExtendedBrowser = extendComponent( Browser, wrapBrowserComponent );
