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
import logger from 'logger';

import { wrapBrowserComponent } from 'extensions';


class Browser extends Component
{
    static propTypes =
    {
        bookmarks          : PropTypes.array,
        notifications      : PropTypes.array,
        tabs               : PropTypes.array,
        addBookmark        : PropTypes.func.isRequired,
        removeBookmark     : PropTypes.func.isRequired,
        selectAddressBar   : PropTypes.func.isRequired,
        deselectAddressBar : PropTypes.func.isRequired,
        blurAddressBar     : PropTypes.func.isRequired,
        addTab             : PropTypes.func,
        closeTab           : PropTypes.func,
        closeActiveTab     : PropTypes.func,
        reopenTab          : PropTypes.func,
        updateNotification : PropTypes.func.isRequired,
        clearNotification  : PropTypes.func,
        ui                 : PropTypes.object.isRequired
    }

    static defaultProps =
    {
        addressBarIsSelected : false,
        tabs                 : [],
        bookmarks            : [],
        notifications        : []
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
            clearNotification
        } = this.props;
        const addressBar = this.address;

        const theBrowser = this;

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

            //bookmarks
            bookmarks,
            addBookmark,
            removeBookmark,

            //ui / addressbar
            ui,
            selectAddressBar,
            deselectAddressBar,
            blurAddressBar,

            //tabs
            tabs,
            addTab,
            closeTab,
            setActiveTab,
            updateActiveTab,
            updateTab,
            activeTabBackwards,
            activeTabForwards,
            updateNotification,
            notifications,
            clearNotification,

        } = this.props;

        // only show the first notification without a response.
        const notification = notifications.filter( n => !n.response )[0];


        const windowTabs = tabs.filter( tab => tab.windowId === this.state.windowId );
        const openTabs = windowTabs.filter( tab => !tab.isClosed );
        const activeTab = openTabs.find( tab => tab.isActiveTab );

        // TODO: if not, lets trigger close?
        if ( !activeTab )
        {
            return <div className="noTabsToShow" />;
        }

        const activeTabAddress = activeTab.url;

        const isBookmarked = !!bookmarks.find( bookmark => bookmark.url === activeTabAddress );

        return (
            <div className={ styles.container }>
                <TabBar
                    key={ 1 }
                    updateActiveTab={ updateActiveTab }
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
                    onSelect={ deselectAddressBar }
                    onFocus={ selectAddressBar }
                    onBlur={ blurAddressBar }
                    addBookmark={ addBookmark }
                    isBookmarked={ isBookmarked }
                    removeBookmark={ removeBookmark }
                    isSelected={ ui.addressBarIsSelected }
                    updateActiveTab={ updateActiveTab }
                    activeTabBackwards={ activeTabBackwards }
                    activeTabForwards={ activeTabForwards }
                    ref={ ( c ) =>
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
                    key={ 4 }
                    addTab={ addTab }
                    updateActiveTab={ updateActiveTab }
                    updateTab={ updateTab }
                    setActiveTab={ setActiveTab }
                    addTab={ addTab }
                    tabs={ openTabs }
                    allTabs={ tabs }
                    bookmarks={ bookmarks }
                    ref={ ( c ) =>
                    {
                        this.tabContents = c;
                    } }
                />
            </div>
        );
    }
}



const extendComponent = ( WrappedComponent ) =>
{
    return class extends Component {
        constructor(props) {
            super(props);

            this.EnWrappedComponent = wrapBrowserComponent( WrappedComponent );
      }
      render() {
          const { EnWrappedComponent } = this;
          return <EnWrappedComponent {...this.props} />;
      }
    }
}

export default Browser;
// export default extendComponent( Browser );
