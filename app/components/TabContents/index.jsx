// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import styles from './tabContents.css';
import Tab from 'components/Tab';

export default class TabContents extends Component
{
    // constructor( props )
    // {
    //     super( props );
    //     this.state = {
    //         tabInFocus : 0 //to update when many tabs can exist
    //     }
    // }
    //
    // static defaultProps =
    // {
    //     tabInFocus : 0
    // }
    getActiveTab()
    {
        return this.activeTab;
    }

    render()
    {
        const { addTab, tabs, updateActiveTab, updateTab, updateAddress } = this.props;

        // console.log( "props in TabContainer component", this.props );
        const tabComponents = tabs.map( ( tab, i ) =>
        {
            if ( !tab.get( 'isClosed' ) )
            {
                const isActiveTab = tab.get( 'isActiveTab' );
                const TheTab = ( <Tab
                    url={ tab.get( 'url' ) }
                    isActiveTab={ isActiveTab }
                    addTab={ addTab }
                    updateTab={ updateTab }
                    updateActiveTab={ updateActiveTab }
                    updateAddress={ updateAddress }
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
