import { remote } from 'electron';
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
    activeTab: any;
    activeTabId: any;
    setActiveTab: ( ...args: Array<any> ) => any;
    selectAddressBar: ( ...args: Array<any> ) => any;
    addTabNext: ( ...args: Array<any> ) => any;
    addTabEnd: ( ...args: Array<any> ) => any;
    closeTab: ( ...args: Array<any> ) => any;
    windowId: any;
    windows: {};
    tabs: Array<any>;
}

interface TabBarState {
    tabInFocus: number;
}
export class TabBar extends Component<TabBarProps, TabBarState> {
    static defaultProps = {
        tabInFocus: 0,
        tabs: [],
        activeTab: {}
    };

    constructor( props ) {
        super( props );

        this.handleAddTabClick = this.handleAddTabClick.bind( this );
    }

    getTabs = (): Array<React.ReactNode> => {
        const { tabs, activeTabId } = this.props;

        return tabs.map(
            ( tab ): React.ReactNode => {
                let { title } = tab;
                const { tabId } = tab;
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
                    return null;
                }

                let tabStyleClass = styles.tab;

                if ( tabId === activeTabId ) {
                    tabStyleClass = `${styles.activeTab} ${CLASSES.ACTIVE_TAB}`;
                }

                return (
                    <button
                        type="button"
                        role="tab"
                        key={tab.tabId}
                        className={`${tabStyleClass} ${CLASSES.TAB}`}
                        onClick={( event ) => {
                            this.handleTabClick( tabId, event );
                        }}
                        onKeyPress={( event ) => {
                            this.handleTabClick( tabId, event );
                        }}
                    >
                        <Row
                            className={styles.tabRow}
                            align="middle"
                            justify="space-between"
                            type="flex"
                        >
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
                                        this.handleTabClose( tabId, event );
                                    }}
                                />
                            </Col>
                        </Row>
                    </button>
                );
            }
        );
    };

    handleAddTabClick( event ) {
        event.stopPropagation();
        const { windowId, addTabEnd, selectAddressBar } = this.props;
        event.stopPropagation();
        const tabId = Math.random().toString( 36 );
        addTabEnd( {
            tabId,
            windowId
        } );
        selectAddressBar( {
            tabId
        } );
    }

    handleTabClose( tabId, event ) {
        event.stopPropagation();
        const { closeTab, windowId } = this.props;
        closeTab( { tabId, windowId } );
    }

    handleTabClick( tabId, event ) {
        event.stopPropagation();
        const { setActiveTab, windowId } = this.props;
        setActiveTab( {
            tabId,
            windowId
        } );
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
