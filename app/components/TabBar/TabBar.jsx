
// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './tabBar.css';
import MdClose from 'react-icons/lib/md/close';
import MdAdd from 'react-icons/lib/md/add';

export default class TabBar extends Component
{
    static defaultProps =
    {
        tabInFocus : 0
    }


    constructor( props )
    {
        super( props );
        this.state =
        {
            tabInFocus : 0 // to update when many tabs can exist
        };

        this.handleAddTabClick = ::this.handleAddTabClick;

    }


    handleTabClick( tabData, event )
    {
        event.stopPropagation();

        this.props.setActiveTab( { index: tabData.key, url: event.target.value } );
    }

    handleTabClose( tabData, event )
    {
        event.stopPropagation();

        const { closeTab } = this.props;

        closeTab( { index: tabData.key } );
    }

    handleAddTabClick( event )
    {
        event.stopPropagation();

        const { addTab } = this.props;
        const newTabUrl = 'about:blank';

        event.preventDefault();
        addTab( { url: newTabUrl, isActiveTab: true } );
    }

    render()
    {
        const { tabs } = this.props;

        return (
            <div className={ styles.container }>
                <div className={ styles.tabBar }>
                    {
                        tabs.map( ( tab, i ) =>
                        {
                            if ( tab.isClosed )
                            {
                                return;
                            }

                            const isActiveTab = tab.isActiveTab;
                            let tabStyleClass = styles.tab;
                            const tabData = { key: i, url: tab.url };
                            if ( isActiveTab )
                            {
                                tabStyleClass = `${styles.activeTab} js-tabBar__active-tab`;
                            }
                            return ( <div
                                key={ i }
                                className={ `${tabStyleClass} js-tab` }
                                onClick={ this.handleTabClick.bind( this, tabData ) }
                            >
                                <span className={ styles.tabText }>{ tab.title || 'New Tab' }</span>
                                <MdClose
                                    className={ `${styles.tabCloseButton} js-tabBar__close-tab` }
                                    onClick={ this.handleTabClose.bind( this, tabData ) }
                                    title="Close"
                                />
                            </div> );
                        } )
                    }
                    <div className={ `${styles.addTab} js-tabBar__add-tab` } onClick={ this.handleAddTabClick.bind( this ) }>
                            <MdAdd  className={ styles.tabAddButton }
                                    title="New Tab"
                            />
                    </div>
                </div>
            </div>
        );
    }
}
