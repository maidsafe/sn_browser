// @flow
//
import { ipcRenderer, remote } from 'electron';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AddressBar from 'components/AddressBar';
import TabBar from 'components/TabBar';
import Notifier from 'components/Notifier';
import TabContents from 'components/TabContents';
import styles from './browser.css';
import setupAuthHandling from 'extensions/safe/authIPCHandling';
import logger from 'logger';

export default class Browser extends Component
{
    static propTypes =
    {
        addTab            : PropTypes.func.isRequired,
        closeTab          : PropTypes.func.isRequired,
        closeActiveTab    : PropTypes.func.isRequired,
        reopenTab         : PropTypes.func.isRequired,
        addNotification   : PropTypes.func,
        clearNotification : PropTypes.func,
        ui                : PropTypes.object.isRequired
    }

    static defaultProps =
    {
        addressBarIsFocussed : false
    }

    constructor( props )
    {
        super( props );
        this.state = {};
    }

    componentDidMount( )
    {
        const {
            addTab,
            closeTab,
            closeActiveTab,
            reopenTab,
            addNotification,
            clearNotification
        } = this.props;
        const addressBar = this.address;

        const theBrowser = this;
        setupAuthHandling( addNotification, clearNotification );

        // this is mounted but its not show?
        this.setState( { windowId: remote.getCurrentWebContents().id } );


        ipcRenderer.on( 'command', ( ...args ) =>
        {
            const event = args[0];
            const type = args[1];
            const { tabContents } = this;

            const activeTab = tabContents.getActiveTab();

            const extraArgs = args.slice( 2 );

            switch ( type )
            {
                case 'file:close-active-tab':
                {
                    closeActiveTab( );
                    return;
                }
                // case 'file:reopen-closed-tab': return pages.reopenLastRemoved()
                // case 'edit:find':              return navbar.showInpageFind(page)
                case 'view:reload': return activeTab.reload();
                case 'view:hard-reload': return activeTab.reloadIgnoringCache();
                // case 'view:zoom-in':           return zoom.zoomIn(page)
                // case 'view:zoom-out':          return zoom.zoomOut(page)
                // case 'view:zoom-reset':        return zoom.zoomReset(page)
                case 'view:toggle-dev-tools': return ( activeTab.isDevToolsOpened() ) ? activeTab.closeDevTools() : activeTab.openDevTools();
                case 'history:back': return activeTab.goBack();
                case 'history:forward': return activeTab.goForward();
                // case 'window:toggle-safe-mode':  return pages.toggleSafe();
                // case 'window:disable-web-security':  return pages.toggleWebSecurity();
                // case 'window:next-tab':        return pages.changeActiveBy(1)
                // case 'window:prev-tab':        return pages.changeActiveBy(-1)
                // case 'set-tab':                return pages.changeActiveTo(arg1)
                // case 'load-pinned-tabs':       return pages.loadPinnedFromDB()
                // case 'perms:prompt':           return permsPrompt(arg1, arg2, arg3)
                default : console.log( 'unhandled command: ', type );
            }
        } );
    }

    shouldComponentUpdate = ( nextProps ) =>
    {
        const { tabs } = nextProps;
        const currentTabs = this.props.tabs;

        const newWindowTabs = tabs.filter( tab => tab.windowId === this.state.windowId );
        const currentWindowTabs = currentTabs.filter( tab => tab.windowId === this.state.windowId );

        return newWindowTabs !== currentWindowTabs;
    }

    handleCloseBrowserTab = ( tab ) =>
    {
        const { closeTab, tabs } = this.props;
        const openTabs = tabs.filter( tab => !tab.isClosed );

        if ( openTabs.length === 1 )
        {
            ipcRenderer.send( 'command:close-window' );
        }
        else
        {
            closeTab( tab );
        }
    }

    render()
    {
        const {
            addTab,
            focusAddressBar,
            blurAddressBar,
            closeTab,
            tabs,
            setActiveTab,
            updateActiveTab,
            updateTab,
            activeTabBackwards,
            activeTabForwards,
            notifications,
            clearNotification,
            ui
        } = this.props;

        // TODO: Set focus only for this window if current
        // const thisAddressBarIsFocussed =

        // only show the first notification
        const notification = notifications[0];
        const windowTabs = tabs.filter( tab => tab.windowId === this.state.windowId );
        const activeTab = windowTabs.find( tab => tab.isActiveTab );

        // TODO: if not, lets trigger close?
        if ( !activeTab )
        {
            return <div />;
        }

        const activeTabAddress = activeTab.url;

        return (
            <div className={ styles.container }>
                <TabBar
                    updateActiveTab={ updateActiveTab }
                    updateTab={ updateTab }
                    setActiveTab={ setActiveTab }
                    addTab={ addTab }
                    closeTab={ this.handleCloseBrowserTab }
                    tabs={ windowTabs }
                />
                <AddressBar
                    address={ activeTabAddress }
                    onFocus={ focusAddressBar }
                    onBlur={ blurAddressBar }
                    isFocussed={ ui.addressBarIsFocussed }
                    updateActiveTab={ updateActiveTab }
                    activeTabBackwards={ activeTabBackwards }
                    activeTabForwards={ activeTabForwards }
                    ref={ ( c ) =>
                    {
                        this.address = c;
                    } }
                />
                <Notifier
                    { ...notification }
                    clearNotification={ clearNotification }
                />
                <TabContents
                    updateActiveTab={ updateActiveTab }
                    updateTab={ updateTab }
                    setActiveTab={ setActiveTab }
                    addTab={ addTab }
                    tabs={ windowTabs }
                    ref={ ( c ) =>
                    {
                        this.tabContents = c;
                    } }
                />
            </div>
        );
    }
}
