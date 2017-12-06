// @flow
//
import { ipcRenderer } from 'electron';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AddressBar from 'components/AddressBar';
import TabBar from 'components/TabBar';
import Notifier from 'components/Notifier';
import TabContents from 'components/TabContents';
import styles from './browser.css';
import setupAuthHandling from 'extensions/safe/authIPCHandling';

const log = require( 'electron-log' );

export default class Browser extends Component
{
    static propTypes =
    {
        addTab : PropTypes.func.isRequired
    }


    static defaultProps =
    {
    }

    componentDidMount( )
    {
        const { addTab, closeTab, closeActiveTab, reopenTab, addNotification, clearNotification } = this.props;
        const addressBar = this.address.refs.addressBar;

        setupAuthHandling( addNotification, clearNotification );

        ipcRenderer.on( 'command', ( ...args ) =>
        {
            const event = args[0];
            const type = args[1];
            const { tabContents } = this;
            const activeTab = tabContents.getActiveTab();

            const extraArgs = args.slice( 2 );


            switch ( type )
            {
                // TODO: Should this actually be passed as an array of browser actions to be dealt with>?
                // TODO: to the store?
                // TODO: And then parsed/removed?
                case 'file:new-tab':
                {
                    addTab( { url: 'about:blank', isActiveTab: true } );
                    addressBar.focus();
                    return;
                }
                case 'file:close-tab':
                {
                    closeTab( { index: extraArgs[0] } );
                    return;
                }
                case 'file:close-active-tab':
                {
                    closeActiveTab( );
                    return;
                }
                // case 'file:reopen-tab':
                //     {
                //         // console.log( 'closing tabbb' )
                //         reopenTab();
                //         // addressBar.focus();
                //         return;
                //     }
                case 'file:focus-location':
                {
                    addressBar.focus();
                    return;
                }
                // case 'file:close-tab':         return pages.remove(page)
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
        const activeTab = tabs.find( tab => tab.isActiveTab );

        return !!activeTab;
    }

    handleCloseBrowserTab = ( tab ) =>
    {
        const { closeTab, tabs } = this.props;
        const openTabs = tabs.filter( tab => !tab.isClosed );

        if( openTabs.length == 1 )
        {
            ipcRenderer.send( 'command:close-window')
        }
        else {
            closeTab( tab );
        }
    }

    render()
    {
        const {
            addTab,
            closeTab,
            tabs,
            setActiveTab,
            updateActiveTab,
            updateTab,
            activeTabBackwards,
            activeTabForwards,
            notifications,
            clearNotification
        } = this.props;

        // only show the first notification
        const notification = notifications[0];

        const activeTab = tabs.find( tab => tab.isActiveTab );

        const activeTabAddress = activeTab.url;

        return (
            <div className={ styles.container }>
                <TabBar
                    updateActiveTab={ updateActiveTab }
                    updateTab={ updateTab }
                    setActiveTab={ setActiveTab }
                    addTab={ addTab }
                    closeTab={ this.handleCloseBrowserTab }
                    tabs={ tabs }
                />
                <AddressBar
                    address={ activeTabAddress }
                    updateActiveTab={ updateActiveTab }
                    activeTabBackwards={activeTabBackwards }
                    activeTabForwards={activeTabForwards }
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
                    tabs={ tabs }
                    ref={ ( c ) =>
                    {
                        this.tabContents = c;
                    } }
                />
            </div>
        );
    }
}
