import url from 'url';
import React, { Component } from 'react';
import styles from './tabBar.css';
import { Row, Col, Icon } from 'antd';
import 'antd/lib/icon/style';
import 'antd/lib/button/style';
import 'antd/lib/row/style';
import 'antd/lib/col/style';
import { I18n } from 'react-redux-i18n';

// import { logger } from '$Logger';
import { isInternalPage } from '$Utils/urlHelpers';
import { CLASSES, INTERNAL_PAGES } from '$Constants';

interface TabBarProps {
    tabInFocus: number;
    tabs: Array<any>;
    setActiveTab: ( ...args: Array<any> ) => any;
    addTab: ( ...args: Array<any> ) => any;
    closeTab: ( ...args: Array<any> ) => any;
    selectAddressBar: ( ...args: Array<any> ) => any;
    windowId: number;
}
// interface TabBarState {
//     tabInFocus: number;
// }
export class TabBar extends Component<TabBarProps> {
    static defaultProps = {
        tabInFocus: 0,
        tabs: []
    };

    constructor( props ) {
        super( props );
        // this.state = {
        //     // tabInFocus: 0 // to update when many tabs can exist
        // };
        this.handleAddTabClick = this.handleAddTabClick.bind( this );
    }

    getTabs = () => {
        const { tabs } = this.props;
        return tabs.map( ( tab ) : React.ReactNode => {
            let { title } = tab;
            if ( isInternalPage( tab ) ) {
                // TODO: DRY this out with TabContents.jsx
                const urlObj = url.parse( tab.url );
                switch ( urlObj.host ) {
                    case INTERNAL_PAGES.HISTORY: {
                        title = 'History';
                        break;
                    }
                    case INTERNAL_PAGES.BOOKMARKS: {
                        title = 'Bookmarks';
                        break;
                    }
                    default: {
                        title = null;
                        break;
                    }
                }
            }
            if ( tab.isClosed ) {
                return;
            }
            const { isActiveTab } = tab;
            let tabStyleClass = styles.tab;
            const tabData = {
                key: tab.index,
                tabIndex: tab.index,
                url: tab.url
            };
            if ( isActiveTab ) {
                tabStyleClass = `${styles.activeTab} ${CLASSES.ACTIVE_TAB}`;
            }
            return (
                <div
                    key={tab.index}
                    className={`${tabStyleClass} ${CLASSES.TAB}`}
                    onClick={(event) => {
                        this.handleTabClick( tabData, event );
                    }}
                >
                    <Row align="middle" justify="space-between" type="flex">
                        <Col>
                            <div className={styles.faviconContainer}>
                                {tab.isLoading && (
                                    <Icon type="loading" className={styles.loadingIcon} />
                                )}
                                {!tab.isLoading && tab.favicon && (
                                    <img
                                        alt=""
                                        className={styles.favicon}
                                        id="favicon-img"
                                        src={tab.favicon}
                                    />
                                )}
                            </div>
                        </Col>
                        <Col className={styles.tabText}>{title || 'New Tab'}</Col>
                        <Col>
                            <Icon
                                className={`${CLASSES.CLOSE_TAB} ${styles.closeTab}`}
                                type="close"
                                title={I18n.t( 'close-tab' )}
                                aria-label={I18n.t( 'aria.close-tab' )}
                                onClick={( event ) => {
                                    this.handleTabClose( tabData , event );
                                }}
                            />
                        </Col>
                    </Row>
                </div>
            );
        } );
    };

    handleAddTabClick( event ) {
        const { windowId } = this.props;
        event.stopPropagation();
        const { addTab, selectAddressBar } = this.props;
        const newTabUrl = 'about:blank';
        event.preventDefault();
        addTab( {
            url: newTabUrl,
            isActiveTab: true,
            windowId
        } );
        selectAddressBar();
    }

    handleTabClick( tabData, event ) {
        event.stopPropagation();
        this.props.setActiveTab( {
            index: tabData.tabIndex,
            url: event.target.value
        } );
    }

    handleTabClose( tabData, event ) {
        event.stopPropagation();
        const { closeTab, windowId } = this.props;
        closeTab( { index: tabData.tabIndex, windowId } );
    }

    render() {
        return (
            <div
                className={[
                    styles.container,
                    process.platform === 'darwin' ? styles.containerMac : ''
                ].join( ' ' )}
            >
                <div className={styles.tabBar}>
                    {this.getTabs()}
                    <Icon
                        className={`${CLASSES.ADD_TAB} ${styles.addTab}`}
                        type="plus"
                        title={I18n.t( 'add-tab' )}
                        aria-label={I18n.t( 'aria.add-tab' )}
                        onClick={this.handleAddTabClick}
                    />
                </div>
            </div>
        );
    }
}
