import { ipcRenderer, remote } from 'electron';
import React, { Component } from 'react';
import { AddressBar } from '$Components/AddressBar';
import { TabBar } from '$Components/TabBar';
import { TabContents } from '$Components/TabContents';
// import { logger } from '$Logger';
import { extendComponent } from '$Utils/extendComponent';
import { wrapBrowserComponent } from '$Extensions/components';
import styles from './browser.css';
import { handleNotifications, Notification } from '$Utils/handleNotificiations';

interface BrowserProps {
    bookmarks?: Array<any>;
    notifications: Array<Notification>;
    tabs: Array<any>;
    addBookmark: ( ...args: Array<any> ) => any;
    removeBookmark: ( ...args: Array<any> ) => any;
    selectAddressBar: ( ...args: Array<any> ) => any;
    deselectAddressBar: ( ...args: Array<any> ) => any;
    blurAddressBar: ( ...args: Array<any> ) => any;
    addTab: ( ...args: Array<any> ) => any;
    closeTab: ( ...args: Array<any> ) => any;
    reopenTab: ( ...args: Array<any> ) => any;
    updateNotification: ( ...args: Array<any> ) => any;
    clearNotification: ( ...args: Array<any> ) => any;
    ui: object;
    showSettingsMenu: ( ...args: Array<any> ) => any;
    hideSettingsMenu: ( ...args: Array<any> ) => any;
    focusWebview: ( ...args: Array<any> ) => any;
}
interface BrowserState {
    windowId: any;
}
class Browser extends Component<BrowserProps, BrowserState> {
    static defaultProps = {
        addressBarIsSelected: false,
        tabs: [],
        bookmarks: [],
        notifications: []
    };

    constructor( props ) {
        super( props );
        this.state = {};
        // jest/electron workaround as no remote in non-render process
        const currentWebContentsId = remote ? remote.getCurrentWebContents().id : 1;
        // this is mounted but its not show?
        this.state.windowId = currentWebContentsId;
    }

    componentWillMount() {
    // jest/electron workaround as no remote in non-render process
        const currentWebContentsId = remote ? remote.getCurrentWebContents().id : 1;
        // this is mounted but its not show?
        this.setState( { windowId: currentWebContentsId } );
    }

    componentDidMount() {
        const {
            addTab,
            closeTab,
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
        const { tabs } = nextProps;
        const currentTabs = this.props.tabs;
        const newWindowTabs = tabs.filter(
            tab => tab.windowId === this.state.windowId
        );
        const currentWindowTabs = currentTabs.filter(
            tab => tab.windowId === this.state.windowId
        );
        return newWindowTabs !== currentWindowTabs;
    };

    componentDidUpdate = ( prevProps: BrowserProps ) => {
        const currentProps = { ...this.props };
        handleNotifications( prevProps, currentProps );
    };

    handleCloseBrowserTab = tab => {
        const { closeTab, tabs } = this.props;
        const openTabs = tabs.filter(
            t => !t.isClosed && t.windowId === this.state.windowId
        );

        if ( openTabs.length === 1 ) {
            ipcRenderer.send( 'command:close-window' );
        } else {
            closeTab( tab );
        }
    };

    render() {
        const { props } = this;
        const {
            // bookmarks
            bookmarks,
            addBookmark,
            removeBookmark,
            // ui / addressbar
            ui,
            selectAddressBar,
            deselectAddressBar,
            blurAddressBar,
            focusWebview,
            // tabs
            tabs,
            addTab,
            closeTab,
            setActiveTab,
            updateTab,
            tabBackwards,
            tabForwards,
            addNotification,
            updateNotification,
            clearNotification,
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
        const windowTabs = tabs.filter( tab => tab.windowId === windowId );
        const openTabs = windowTabs.filter( tab => !tab.isClosed );
        const activeTab = openTabs.find( tab => tab.isActiveTab );
        // TODO: if not, lets trigger close?
        if ( !activeTab ) {
            return <div className="noTabsToShow" />;
        }
        const activeTabAddress = activeTab.url;
        const isBookmarked = !!bookmarks.find(
            bookmark => bookmark.url === activeTabAddress
        );

        const uiWindow = ui.windows;
        const windowObjForCurrentWindow = uiWindow.find( function( element ) {
            return element.windowId === windowId;
        } );
        const settingsMenuIsVisible = windowObjForCurrentWindow
            ? windowObjForCurrentWindow.settingsMenuIsVisible
            : false;

        return (
            <div className={styles.container}>
                <TabBar
                    key={1}
                    updateTab={updateTab}
                    setActiveTab={setActiveTab}
                    selectAddressBar={selectAddressBar}
                    addTab={addTab}
                    closeTab={this.handleCloseBrowserTab}
                    tabs={openTabs}
                    windowId={windowId}
                />
                <AddressBar
                    key={2}
                    address={activeTabAddress}
                    addTab={addTab}
                    activeTab={activeTab}
                    onSelect={deselectAddressBar}
                    onFocus={selectAddressBar}
                    onBlur={blurAddressBar}
                    addBookmark={addBookmark}
                    isBookmarked={isBookmarked}
                    removeBookmark={removeBookmark}
                    hideSettingsMenu={hideSettingsMenu}
                    showSettingsMenu={showSettingsMenu}
                    settingsMenuIsVisible={settingsMenuIsVisible}
                    isSelected={ui.addressBarIsSelected}
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
                    tabBackwards={tabBackwards}
                    focusWebview={focusWebview}
                    shouldFocusWebview={ui.shouldFocusWebview}
                    closeTab={closeTab}
                    key={4}
                    addTab={addTab}
                    addNotification={addNotification}
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
    }
}
export const ExtendedBrowser = extendComponent( Browser, wrapBrowserComponent );
