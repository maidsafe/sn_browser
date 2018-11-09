
// @flow
import { remote } from 'electron';
import url from 'url';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './tabBar.css';
import MdClose from 'react-icons/lib/md/close';
import MdAdd from 'react-icons/lib/md/add';
import logger from 'logger';
import { isInternalPage } from 'utils/urlHelpers';
import { CLASSES, INTERNAL_PAGES } from 'appConstants';
import { Column, Spinner, Row } from 'nessie-ui';

export default class TabBar extends Component
{
    static propTypes =
    {
        tabInFocus       : PropTypes.number.isRequired,
        tabs             : PropTypes.array.isRequired,
        setActiveTab     : PropTypes.func.isRequired,
        addTab           : PropTypes.func.isRequired,
        closeTab         : PropTypes.func.isRequired,
        selectAddressBar : PropTypes.func.isRequired
    }

    static defaultProps =
    {
        tabInFocus : 0,
        tabs       : []
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

        this.props.setActiveTab( { index: tabData.tabIndex, url: event.target.value } );
    }

    handleTabClose( tabData, event )
    {
        event.stopPropagation();

        const { closeTab } = this.props;

        closeTab( { index: tabData.tabIndex } );
    }

    handleAddTabClick( event )
    {
        event.stopPropagation();

        const { addTab, selectAddressBar } = this.props;
        const newTabUrl = 'about:blank';
        event.preventDefault();
        addTab( { url: newTabUrl, isActiveTab: true, windowId: remote.getCurrentWindow().webContents.id } );
        selectAddressBar();
    }

    getTabs = ( ) =>
    {
        const { tabs } = this.props;

        return tabs.map( ( tab, i ) =>
        {
            let title = tab.title;

            if ( isInternalPage( tab ) )
            {
                // TODO: DRY this out with TabContents.jsx
                const urlObj = url.parse( tab.url );
                switch ( urlObj.host )
                {
                    case INTERNAL_PAGES.HISTORY :
                    {
                        title = 'History';
                        break;
                    }
                    case INTERNAL_PAGES.BOOKMARKS :
                    {
                        title = 'Bookmarks';
                        break;
                    }
                    default :
                    {
                        title = null;
                        break;
                    }
                }
            }

            if ( tab.isClosed )
            {
                return;
            }

            const isActiveTab = tab.isActiveTab;
            let tabStyleClass = styles.tab;
            const tabData = { key: tab.index, tabIndex: tab.index, url: tab.url };

            if ( isActiveTab )
            {
                tabStyleClass = `${styles.activeTab} ${CLASSES.ACTIVE_TAB}`;
            }


            return ( <div
                key={ tab.index }
                className={ `${tabStyleClass} ${CLASSES.TAB}` }
                onClick={ this.handleTabClick.bind( this, tabData ) }
            >

                <Row verticalAlign="middle" gutters="S">
                    <Column align="left" className={ styles.favicon }>
                        {tab.isLoading &&
                            <Spinner size="small" />
                        }
                        {!tab.isLoading && tab.favicon &&
                            <img alt="" id="favicon-img" src={ tab.favicon } />
                        }
                    </Column>
                    <Column className={ styles.tabText } align="left">
                        { title || 'New Tab' }
                    </Column>
                    <Column align="right" className={ styles.favicon }>
                        <MdClose
                            className={ `${styles.tabCloseButton} ${CLASSES.CLOSE_TAB}` }
                            onClick={ this.handleTabClose.bind( this, tabData ) }
                            title="Close"
                        />
                    </Column>
                </Row>
            </div> );
        } );
    }

    render()
    {
        return (
            <div className={ styles.container }>
                <div className={ styles.tabBar }>
                    {
                        this.getTabs()
                    }
                    <div className={ `${styles.addTab} ${CLASSES.ADD_TAB}` } onClick={ this.handleAddTabClick.bind( this ) }>
                        <MdAdd
                            className={ styles.tabAddButton }
                            title="New Tab"
                        />
                    </div>
                </div>
            </div>
        );
    }
}
