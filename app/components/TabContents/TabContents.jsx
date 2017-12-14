// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import url from 'url';
import { Link } from 'react-router';
import styles from './tabContents.css';
import Tab from 'components/Tab';
import { PROTOCOLS, INTERNAL_PAGES } from 'appConstants';
import History from 'components/History';
import ListPage from 'components/ListPage';

export default class TabContents extends Component
{
    getActiveTab()
    {
        return this.activeTab;
    }

    isInternalPage = ( tab ) =>
    {
        const urlObj = url.parse( tab.url );

        return urlObj.protocol === `${PROTOCOLS.INTERNAL_PAGES}:`;
    }

    render()
    {
        const { addTab, bookmarks, tabs, updateActiveTab, updateTab } = this.props;

        const tabComponents = tabs.map( ( tab, i ) =>
        {
            if ( !tab.isClosed )
            {
                if ( this.isInternalPage( tab ) )
                {
                    const urlObj = url.parse( tab.url );
                    const isActiveTab = tab.isActiveTab;

                    switch ( urlObj.host )
                    {
                        case INTERNAL_PAGES.HISTORY :
                        {
                            return ( <History
                                tabs={ tabs }
                                key={ i }
                                isActiveTab={ isActiveTab }
                                ref={ ( c ) => {
                                    if ( isActiveTab )
                                    {
                                        this.activeTab = c;
                                    }
                                } }
                            /> );
                        }
                        case INTERNAL_PAGES.BOOKMARKS :
                        {
                            return ( <ListPage
                                list={ bookmarks }
                                key={ i }
                                title="Bookmarks"
                                isActiveTab={ isActiveTab }
                                ref={ ( c ) => {
                                    if ( isActiveTab )
                                    {
                                        this.activeTab = c;
                                    }
                                } }
                            /> );
                        }

                        default :
                        {
                            return <div>Sorry what?</div>;
                        }
                    }
                }

                const isActiveTab = tab.isActiveTab;
                const TheTab = ( <Tab
                    url={ tab.url }
                    isActiveTab={ isActiveTab }
                    addTab={ addTab }
                    updateTab={ updateTab }
                    updateActiveTab={ updateActiveTab }
                    key={ i }
                    index={ i }
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
