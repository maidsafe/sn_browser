// @flow
//
import { ipcRenderer, remote } from 'electron';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AddressBar from '@Components/AddressBar';
import TabBar from '@Components/TabBar';
import Notifier from '@Components/Notifier';
import TabContents from '@Components/TabContents';
import styles from './browser.css';
import logger from 'logger';

import extendComponent from '@Utils/extendComponent';
import { wrapBrowserComponent } from '@Extensions/components';

class Browser extends Component {
    static propTypes = {
        bookmarks: PropTypes.array,
        notifications: PropTypes.array,
        tabs: PropTypes.array,
        addBookmark: PropTypes.func.isRequired,
        removeBookmark: PropTypes.func.isRequired,
        selectAddressBar: PropTypes.func.isRequired,
        deselectAddressBar: PropTypes.func.isRequired,
        blurAddressBar: PropTypes.func.isRequired,
        reloadPage: PropTypes.func.isRequired,
        pageLoaded: PropTypes.func.isRequired,
        addTab: PropTypes.func.isRequired,
        closeTab: PropTypes.func.isRequired,
        closeActiveTab: PropTypes.func.isRequired,
        reopenTab: PropTypes.func.isRequired,
        updateNotification: PropTypes.func.isRequired,
        clearNotification: PropTypes.func.isRequired,
        ui: PropTypes.object.isRequired,
        showSettingsMenu: PropTypes.func.isRequired,
        hideSettingsMenu: PropTypes.func.isRequired,
        focusWebview: PropTypes.func.isRequired
    };

    static defaultProps = {
        addressBarIsSelected: false,
        tabs: [],
        bookmarks: [],
        notifications: []
    };

    constructor(props) {
        super(props);
        this.state = {};

        //jest/electron workaround as no remote in non-render process
        const currentWebContentsId = remote
            ? remote.getCurrentWebContents().id
            : 1;

        // this is mounted but its not show?
        this.state.windowId = currentWebContentsId;
    }

    componentWillMount() {
        //jest/electron workaround as no remote in non-render process
        const currentWebContentsId = remote
            ? remote.getCurrentWebContents().id
            : 1;

        // this is mounted but its not show?
        this.setState({ windowId: currentWebContentsId });
    }

    componentDidMount() {
        const {
            addTab,
            closeTab,
            closeActiveTab,
            reopenTab,
            clearNotification
        } = this.props;
        const addressBar = this.address;

        const theBrowser = this;

        if (!ipcRenderer) return; //avoid for jest/Electron where we're not in renderer process

        ipcRenderer.on('command', (...args) => {
            const event = args[0];
            const type = args[1];
            const { tabContents } = this;

            const activeTab = tabContents.getActiveTab();

            const extraArgs = args.slice(2);

            switch (type) {
                case 'file:close-active-tab': {
                    closeActiveTab();
                    return;
                }
                // case 'file:reopen-closed-tab': return pages.reopenLastRemoved()
                // case 'edit:find':              return navbar.showInpageFind(page)
                case 'view:reload':
                    return activeTab.reload();
                case 'view:hard-reload':
                    return activeTab.reloadIgnoringCache();
                // case 'view:zoom-in':           return zoom.zoomIn(page)
                // case 'view:zoom-out':          return zoom.zoomOut(page)
                // case 'view:zoom-reset':        return zoom.zoomReset(page)
                case 'view:toggle-dev-tools':
                    return activeTab.isDevToolsOpened()
                        ? activeTab.closeDevTools()
                        : activeTab.openDevTools();
                case 'history:back':
                    return activeTab.goBack();
                case 'history:forward':
                    return activeTab.goForward();
                // case 'window:toggle-safe-mode':  return pages.toggleSafe();
                // case 'window:disable-web-security':  return pages.toggleWebSecurity();
                // case 'window:next-tab':        return pages.changeActiveBy(1)
                // case 'window:prev-tab':        return pages.changeActiveBy(-1)
                // case 'set-tab':                return pages.changeActiveTo(arg1)
                // case 'load-pinned-tabs':       return pages.loadPinnedFromDB()
                // case 'perms:prompt':           return permsPrompt(arg1, arg2, arg3)
                default:
                    console.log('unhandled command: ', type);
            }
        });
    }

    shouldComponentUpdate = nextProps => {
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

    handleCloseBrowserTab = tab => {
        const { closeTab, tabs } = this.props;

        const openTabs = tabs.filter(
            tab => !tab.isClosed && tab.windowId === this.state.windowId
        );

        if (openTabs.length === 1) {
            ipcRenderer.send('command:close-window');
        } else {
            closeTab(tab);
        }
    };

    render() {
        const props = this.props;

        const {
            //bookmarks
            bookmarks,
            addBookmark,
            removeBookmark,

            //ui / addressbar
            ui,
            selectAddressBar,
            deselectAddressBar,
            blurAddressBar,
            reloadPage,
            pageLoaded,
            focusWebview,

            //tabs
            tabs,
            addTab,
            closeTab,
            setActiveTab,
            updateActiveTab,
            updateTab,
            activeTabBackwards,
            activeTabForwards,

            // notifications
            addNotification,
            updateNotification,
            notifications,
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
        const notification = notifications.filter(n => !n.response)[0];

        const windowId = this.state.windowId;
        // TODO: Move windowId from state to store.
        const windowTabs = tabs.filter(tab => {
            return tab.windowId === windowId;
        });

        const openTabs = windowTabs.filter(tab => !tab.isClosed);
        const activeTab = openTabs.find(tab => tab.isActiveTab);

        // TODO: if not, lets trigger close?
        if (!activeTab) {
            return <div className="noTabsToShow" />;
        }

        const activeTabAddress = activeTab.url;

        const isBookmarked = !!bookmarks.find(
            bookmark => bookmark.url === activeTabAddress
        );

        return (
            <div className={styles.container}>
                <TabBar
                    key={1}
                    updateActiveTab={updateActiveTab}
                    updateTab={updateTab}
                    setActiveTab={setActiveTab}
                    selectAddressBar={selectAddressBar}
                    addTab={addTab}
                    closeTab={this.handleCloseBrowserTab}
                    tabs={openTabs}
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
                    reloadPage={reloadPage}
                    hideSettingsMenu={hideSettingsMenu}
                    showSettingsMenu={showSettingsMenu}
                    settingsMenuIsVisible={ui.settingsMenuIsVisible}
                    isSelected={ui.addressBarIsSelected}
                    updateActiveTab={updateActiveTab}
                    activeTabBackwards={activeTabBackwards}
                    activeTabForwards={activeTabForwards}
                    activeTab={activeTab}
                    windowId={windowId}
                    focusWebview={focusWebview}
                    ref={c => {
                        this.address = c;
                    }}
                />
                <Notifier
                    key={3}
                    updateNotification={updateNotification}
                    {...notification}
                    clearNotification={clearNotification}
                />
                <TabContents
                    isActiveTabReloading={ui.isActiveTabReloading}
                    activeTabBackwards={activeTabBackwards}
                    focusWebview={focusWebview}
                    shouldFocusWebview={ui.shouldFocusWebview}
                    closeTab={closeTab}
                    key={4}
                    addTab={addTab}
                    addNotification={addNotification}
                    updateActiveTab={updateActiveTab}
                    updateTab={updateTab}
                    setActiveTab={setActiveTab}
                    pageLoaded={pageLoaded}
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

export default extendComponent(Browser, wrapBrowserComponent);
