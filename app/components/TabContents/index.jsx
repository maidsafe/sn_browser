// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import styles from './tabContents.css';
import Tab from 'components/Tab';

export default class TabContents extends Component
{

    getActiveTab()
    {
        return this.activeTab;
    }

    render()
    {
        const { addTab, tabs, updateActiveTab, updateTab } = this.props;

        const tabComponents = tabs.map( ( tab, i ) =>
        {
            if ( !tab.isClosed )
            {
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
                <div className={ styles.tabWindow }>
                    { tabComponents }
                </div>
            </div>
        );
    }
}
