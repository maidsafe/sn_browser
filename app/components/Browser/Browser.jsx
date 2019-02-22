// @flow
//
import { ipcRenderer, remote } from 'electron';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AddressBar from '@Components/AddressBar';
import TabBar from '@Components/TabBar';
import Notifier from '@Components/Notifier';
import TabContents from '@Components/TabContents';
import logger from 'logger';

import extendComponent from '@Utils/extendComponent';
import { wrapBrowserComponent } from '@Extensions/components';
import styles from './browser.css';

class Browser extends Component
{
    static propTypes = {
        bookmarks          : PropTypes.array,
        notifications      : PropTypes.array,
        tabs               : PropTypes.array,
        addBookmark        : PropTypes.func.isRequired,
        removeBookmark     : PropTypes.func.isRequired,
        selectAddressBar   : PropTypes.func.isRequired,
        deselectAddressBar : PropTypes.func.isRequired,
        blurAddressBar     : PropTypes.func.isRequired,
        addTab             : PropTypes.func.isRequired,
        closeTab           : PropTypes.func.isRequired,
        reopenTab          : PropTypes.func.isRequired,
        updateNotification : PropTypes.func.isRequired,
        clearNotification  : PropTypes.func.isRequired,
        ui                 : PropTypes.object.isRequired,
        showSettingsMenu   : PropTypes.func.isRequired,
        hideSettingsMenu   : PropTypes.func.isRequired,
        focusWebview       : PropTypes.func.isRequired
    };

    static defaultProps = {
        addressBarIsSelected : false,
        tabs                 : [],
        bookmarks            : [],
        notifications        : []
    };

    constructor( props )
    {
        super( props );
        this.state = {};

        // jest/electron workaround as no remote in non-render process
        const currentWebContentsId = remote
            ? remote.getCurrentWebContents().id
            : 1;

        // this is mounted but its not show?
        this.state.windowId = currentWebContentsId;
    }

    componentWillMount()
    {
        // jest/electron workaround as no remote in non-render process
        const currentWebContentsId = remote
            ? remote.getCurrentWebContents().id
            : 1;

        // this is mounted but its not show?
        this.setState( { windowId: currentWebContentsId } );
    }

    componentDidMount()
    {
        const {
            addTab,
            closeTab,
            reopenTab,
            clearNotification,
            tabForwards,
            tabBackwards,
        } = this.props;
        const addressBar = this.address;

        const theBrowser = this;

        const body = document.querySelector( 'body' );
        const div = document.createElement( 'div' );
        div.setAttribute( 'class', 'no_display' );
        div.setAttribute( 'id', 'link_revealer' );
        body.appendChild( div );
    }

    shouldComponentUpdate = nextProps =>
    {
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

    handleCloseBrowserTab = tab =>
    {
        const { closeTab, tabs } = this.props;

        const openTabs = tabs.filter(
            tab => !tab.isClosed && tab.windowId === this.state.windowId
        );

        if ( openTabs.length === 1 )
        {
            ipcRenderer.send( 'command:close-window' );
        }
        else
        {
            closeTab( tab );
        }
    };

    render()
    {
        const props = this.props;

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
        const notification = notifications.filter( n => !n.response )[0];

        const windowId = this.state.windowId;
        // TODO: Move windowId from state to store.
        const windowTabs = tabs.filter( tab =>
            tab.windowId === windowId );

        const openTabs = windowTabs.filter( tab => !tab.isClosed );
        const activeTab = openTabs.find( tab => tab.isActiveTab );

        // TODO: if not, lets trigger close?
        if ( !activeTab )
        {
            return <div className="noTabsToShow" />;
        }

        const activeTabAddress = activeTab.url;
        const isBookmarked = !!bookmarks.find(
            bookmark => bookmark.url === activeTabAddress
        );
        const uiWindow = ui.windows;
        const windowObjForCurrentWindow = uiWindow.find( function ( element ) {
            return element.windowId === windowId;
          });
        const settingsMenuIsVisible = windowObjForCurrentWindow ? windowObjForCurrentWindow.settingsMenuIsVisible : false;
        return (
            <div className={ styles.container }>
                <TabBar
                    key={ 1 }
                    updateTab={ updateTab }
                    setActiveTab={ setActiveTab }
                    selectAddressBar={ selectAddressBar }
                    addTab={ addTab }
                    closeTab={ this.handleCloseBrowserTab }
                    tabs={ openTabs }
                />
                <AddressBar
                    key={ 2 }
                    address={ activeTabAddress }
                    addTab={ addTab }
                    activeTab={ activeTab }
                    onSelect={ deselectAddressBar }
                    onFocus={ selectAddressBar }
                    onBlur={ blurAddressBar }
                    addBookmark={ addBookmark }
                    isBookmarked={ isBookmarked }
                    removeBookmark={ removeBookmark }
                    hideSettingsMenu={ hideSettingsMenu }
                    showSettingsMenu={ showSettingsMenu }
                    settingsMenuIsVisible={ settingsMenuIsVisible }
                    isSelected={ ui.addressBarIsSelected }
                    tabBackwards={ tabBackwards }
                    tabForwards={ tabForwards }
                    updateTab={ updateTab }
                    windowId={ windowId }
                    focusWebview={ focusWebview }
                    ref={ c =>
                    {
                        this.address = c;
                    } }
                />
                <Notifier
                    key={ 3 }
                    updateNotification={ updateNotification }
                    { ...notification }
                    clearNotification={ clearNotification }
                />
                <TabContents
                    tabBackwards={ tabBackwards }
                    focusWebview={ focusWebview }
                    shouldFocusWebview={ ui.shouldFocusWebview }
                    closeTab={ closeTab }
                    key={ 4 }
                    addTab={ addTab }
                    addNotification={ addNotification }
                    updateTab={ updateTab }
                    setActiveTab={ setActiveTab }
                    tabs={ openTabs }
                    allTabs={ tabs }
                    bookmarks={ bookmarks }
                    windowId={ windowId }
                    safeExperimentsEnabled={ experimentsEnabled }
                    ref={ c =>
                    {
                        this.tabContents = c;
                    } }
                />
            </div>
        );
    }
}

export default extendComponent( Browser, wrapBrowserComponent );
