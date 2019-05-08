import { ipcRenderer, remote } from 'electron';
import React, { Component } from 'react';
import { AddressBar } from '$Components/AddressBar';
import TabBar from '$Components/TabBar';
import TabContents  from '$Components/TabContents';
// import { logger } from '$Logger';
import { extendComponent } from '$Utils/extendComponent';
import { wrapBrowserComponent } from '$Extensions/components';
import styles from './browser.css';
import { handleNotifications, Notification } from '$Utils/handleNotificiations';

interface BrowserProps {
    bookmarks?: Array<any>;
    notifications: Array<Notification>;
    tabs: object;
    windows: object;
    addBookmark: ( ...args: Array<any> ) => any;
    removeBookmark: ( ...args: Array<any> ) => any;
    addWindow : ( ...args: Array<any> ) => any,
    addTabNext : ( ...args: Array<any> ) => any,
    addTabEnd : ( ...args: Array<any> ) => any,
    setActiveTab : ( ...args: Array<any> ) => any,
    windowCloseTab : ( ...args: Array<any> ) => any,
    reopenTab : ( ...args: Array<any> ) => any,
    closeWindow : ( ...args: Array<any> ) => any,
    showSettingsMenu : ( ...args: Array<any> ) => any,
    hideSettingsMenu : ( ...args: Array<any> ) => any,
    addTab : ( ...args: Array<any> ) => any,
    updateTab : ( ...args: Array<any> ) => any,
    tabForwards : ( ...args: Array<any> ) => any,
    tabBackwards : ( ...args: Array<any> ) => any,
    focusWebview : ( ...args: Array<any> ) => any,
    blurAddressBar : ( ...args: Array<any> ) => any,
    selectAddressBar : ( ...args: Array<any> ) => any,
    deselectAddressBar : ( ...args: Array<any> ) => any,
    updateNotification: ( ...args: Array<any> ) => any;
    clearNotification: ( ...args: Array<any> ) => any;
}
interface BrowserState {
    windowId: any;
}
class Browser extends Component<BrowserProps, BrowserState> {
    static defaultProps = {
        addressBarIsSelected: false,
        tabs: {},
        windows : {},
        bookmarks: [],
        notifications: []
    };

    constructor( props ) {
        super( props );
        this.state = {};
        const getCurrentWindowId = remote ? remote.getCurrentWindow().id: 1;
        // this is mounted but its not show?
        this.state.windowId = getCurrentWindowId;
    }

    componentWillMount() {
    // jest/electron workaround as no remote in non-render process
        const getCurrentWindowId = remote ? remote.getCurrentWindow().id: 1;
        // this is mounted but its not show?
        this.setState( { windowId: getCurrentWindowId } );
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

    shouldComponentUpdate = ( nextProps: BrowserProps ) => {
        //Have to check this about pafge rendering
        const { windows, tabs, Bookmarks } = nextProps;
        const { windowId } = this.state;
        const currentTabs = this.props.tabs;
        const currentBookmarks = this.props.bookmarks;
        const newWindow = Object.keys(windows.openWindows).length>=1 ? windows.openWindows[windowId] :{}; 
        const currentWindow = Object.keys(this.props.windows.openWindows).length>=1 ? this.props.windows.openWindows[windowId] : {}; 
        return newWindow !== currentWindow || tabs !== currentTabs || Bookmarks!== currentBookmarks;
    };

    componentDidUpdate = ( prevProps: BrowserProps ) => {
        const currentProps = { ...this.props };
        handleNotifications( prevProps, currentProps );
    };

    handleCloseBrowserTab = tab => {
        const { windows, windowCloseTab } = this.props;
        const { windowId } = this.state;
        const openTabs = windows.openWindows[windowId].tabs;
        if ( openTabs.length === 1 ) {
            ipcRenderer.send( 'command:close-window' );
        } else {
            windowCloseTab( tab );
        }
    };

    handleAddTabEnd = tab => {
        const { addTabEnd, addTab, setActiveTab } = this.props;
        const { windowId } = this.state;
        const { url, tabId } = tab;
        addTab( {url, tabId} );
        addTabEnd( {windowId, tabId} );
        setActiveTab( {windowId, tabId} );
    };

    handleAddTabNext = tab => {
        const { addTab, addTabEnd, setActiveTab } = this.props;
        const { windowId } = this.state;
        const { tabId, url, tabIndex } = tab;
        addTab( {tabId, url} );
        if( tabIndex!== undefined )
        {
            addTabEnd( { tabId, tabIndex, windowId } );
        }
        else
        {
            addTabEnd( { tabId, windowId } );
        }
        setActiveTab( {tabId , windowId} );
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
            addWindow,// remove if not needed 
            setActiveTab,
            windowCloseTab,
            reopenTab,// remove if not needed 
            closeWindow,// remove if not needed
            showSettingsMenu,
            hideSettingsMenu,
            // TODO extend tab to not need this
            safeBrowserApp
        } = props;
        const experimentsEnabled = safeBrowserApp
            ? safeBrowserApp.experimentsEnabled
            : false;
        // only show the first notification without a response.
        const { windowId } = this.state;
        // TODO: Move windowId from state to store.
        if(windows.openWindows[windowId]!== undefined)
        {
            const windowsTabs = windows.openWindows[windowId].tabs;
            console.log('The current Tabs WindowIds', windowId)
            const openTabs = [];
            windowsTabs.forEach( element => {
                openTabs.push( tabs[element] )
            } );
            const activeTabId = windows.openWindows[windowId].activeTab;
            const activeTab = activeTabId!== undefined ? tabs[activeTabId]: undefined;
            if ( !activeTab ) {
                return <div className="noTabsToShow" />;
            }
            const activeTabAddress = activeTab.url;
            const isBookmarked = !!bookmarks.find(
                bookmark => bookmark.url === activeTabAddress
            );
            const isSelected = tabs[activeTabId].ui.addressBarIsSelected ;
            const { shouldFocusWebview } = tabs[activeTabId].ui.shouldFocusWebview;
            const { settingsMenuIsVisible } = windows.openWindows[windowId].ui;
            return (
                <div className={styles.container}>
                    <TabBar
                        key={1}
                        updateTab={updateTab}
                        setActiveTab={setActiveTab}
                        selectAddressBar={selectAddressBar}
                        activeTabId = {activeTabId}
                        activeTab = {activeTab}
                        addTabNext = {this.handleAddTabNext}
                        addTabEnd =  {this.handleAddTabEnd}
                        closeTab={this.handleCloseBrowserTab}
                        tabs={openTabs}
                        windows = {windows}
                        windowId={windowId}
                    />
                    <AddressBar
                        key={2}
                        address={activeTabAddress}
                        activeTab={activeTab}
                        tabId = {activeTabId}
                        onSelect={deselectAddressBar}
                        onFocus={selectAddressBar}
                        setActiveTab={setActiveTab}
                        onBlur={blurAddressBar}
                        addBookmark={addBookmark}
                        isBookmarked={isBookmarked}
                        addTabNext = {this.handleAddTabNext}
                        addTabEnd =  {this.handleAddTabEnd}
                        removeBookmark={removeBookmark}
                        hideSettingsMenu={hideSettingsMenu}
                        showSettingsMenu={showSettingsMenu}
                        settingsMenuIsVisible={settingsMenuIsVisible}
                        isSelected = { isSelected }
                        tabBackwards={tabBackwards}
                        tabForwards={tabForwards}
                        updateTab={updateTab}
                        windowId={windowId}
                        focusWebview={focusWebview}
                        ref={c => {
                            this.address = c;
                        }}
                    />
                    <TabContents
                        key={4}
                        tabBackwards={tabBackwards}
                        focusWebview={focusWebview}
                        shouldFocusWebview={ shouldFocusWebview }
                        closeTab={windowCloseTab}
                        addTabNext = {this.handleAddTabNext}
                        addTabEnd =  {this.handleAddTabEnd}
                        addNotification={addNotification}
                        activeTabId = {activeTabId}
                        activeTab = {activeTab}
                        updateTab={updateTab}
                        setActiveTab={setActiveTab}
                        tabs={openTabs}
                        allTabs={tabs}
                        bookmarks={bookmarks}
                        windowId={windowId}
                        safeExperimentsEnabled={experimentsEnabled}
                        ref={c => {
                            this.tabContents = c;
                        }}
                    />
                </div>
            );
        };
        return <div />
        // TODO: if not, lets trigger close?
    }
}
export const ExtendedBrowser = extendComponent( Browser, wrapBrowserComponent );
