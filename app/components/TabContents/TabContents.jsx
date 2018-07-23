// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import url from 'url';
import styles from './tabContents.css';
import Tab from 'components/Tab';
import { INTERNAL_PAGES } from 'appConstants';
import { isInternalPage } from 'utils/urlHelpers';
import History from 'components/PerusePages/History';
import Bookmarks from 'components/PerusePages/Bookmarks';

export default class TabContents extends Component
{
    getActiveTab()
    {
        return this.activeTab;
    }

    render()
    {
        const { addTab, closeTab, bookmarks, allTabs, tabs, updateActiveTab,
                updateTab, isActiveTabReloading, pageLoaded, windowId } = this.props;

        const tabComponents = tabs.map( ( tab, i ) =>
        {
            if ( !tab.isClosed )
            {
                if ( isInternalPage( tab ) )
                {
                    const urlObj = url.parse( tab.url );
                    const isActiveTab = tab.isActiveTab;

                    switch ( urlObj.host )
                    {
                        case INTERNAL_PAGES.HISTORY :
                        {
                            return ( <History
                                addTab={ addTab }
                                history={ allTabs }
                                key={ tab.index }
                                isActiveTab={ isActiveTab }
                                ref={ ( c ) =>
                                {
                                    if ( isActiveTab )
                                    {
                                        this.activeTab = c;
                                    }
                                } }
                            /> );
                        }
                        case INTERNAL_PAGES.BOOKMARKS :
                        {
                            return ( <Bookmarks
                                addTab={ addTab }
                                bookmarks={ bookmarks }
                                key={ tab.index }
                                isActiveTab={ isActiveTab }
                                ref={ ( c ) =>
                                {
                                    if ( isActiveTab )
                                    {
                                        this.activeTab = c;
                                    }
                                } }
                            /> );
                        }

                        default :
                        {
                            return <div key="sorry">Sorry what?</div>;
                        }
                    }
                }

                const isActiveTab = tab.isActiveTab;
                const TheTab = ( <Tab
                    webId={ tab.webId }
                    url={ tab.url }
                    isActiveTab={ isActiveTab }
                    isActiveTabReloading={ isActiveTabReloading }
                    addTab={ addTab }
                    closeTab={  closeTab }
                    updateTab={ updateTab }
                    updateActiveTab={ updateActiveTab }
                    pageLoaded={ pageLoaded }
                    key={ tab.index }
                    index={ tab.index }
                    windowId={ windowId }
                    ref={ ( c ) =>
                    {
                        if ( isActiveTab )
                        {
                            this.activeTab = c;
                        }
                    } }
                /> );
                return TheTab;
            }
        } );

        return (
            <div className={ styles.container }>
                { tabComponents }
            </div>
        );
    }
}
