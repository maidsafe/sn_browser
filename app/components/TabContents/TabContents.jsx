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
        const { addTab, bookmarks, allTabs, tabs, updateActiveTab,
                updateTab, pageIsLoading, pageLoaded } = this.props;

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
                                key={ i }
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
                                key={ i }
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
                    url={ tab.url }
                    isActiveTab={ isActiveTab }
                    pageIsLoading= { pageIsLoading }
                    addTab={ addTab }
                    updateTab={ updateTab }
                    updateActiveTab={ updateActiveTab }
                    pageLoaded={ pageLoaded }
                    key={ i }
                    index={ tab.index }
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
