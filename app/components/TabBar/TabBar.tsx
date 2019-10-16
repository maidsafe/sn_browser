import { remote } from 'electron';
import url from 'url';
import React, { Component } from 'react';
import { Grid, IconButton, Icon, Typography, Button } from '@material-ui/core';
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import ClearRoundedIcon from '@material-ui/icons/ClearRounded';
import { I18n } from 'react-redux-i18n';
import styles from './tabBar.css';
import { resolveExtensionInternalPages } from '$Extensions/renderProcess';

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
                let additionalStyles = {};
                let showIcon = true;
                const { tabId } = tab;
                if ( isInternalPage( tab ) ) {
                    const parseQuery = true;
                    const urlObj: Url = url.parse( tab.url, parseQuery );
                    const extensionPage = resolveExtensionInternalPages(
                        urlObj,
                        urlObj.query,
                        tab,
                        this.props
                    );

                    // TODO: DRY this out with TabContents.jsx
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

                    if ( extensionPage ) {
                        showIcon = false;
                        // eslint-disable-next-line prefer-destructuring
                        title = extensionPage.title;
                        additionalStyles = extensionPage.tabButtonStyles;
                    }
                }
                if ( tab.isClosed ) {
                    return null;
                }

                let tabStyleClass = styles.aTabBox;

                if ( tabId === activeTabId ) {
                    tabStyleClass = `${styles.aTabBox} ${styles.aTabBoxSelected} ${CLASSES.ACTIVE_TAB}`;
                }
                return (
                    <Grid item className={`${tabStyleClass}`}>
                        <Button
                            fullWidth
                            type="button"
                            role="tab"
                            key={tab.tabId}
                            className={`${styles.atab} ${CLASSES.TAB}`}
                            style={additionalStyles}
                            onClick={( event ) => {
                                this.handleTabClick( tabId, event );
                            }}
                            onKeyPress={( event ) => {
                                this.handleTabClick( tabId, event );
                            }}
                        >
                            {showIcon && (
                                <div className={styles.faviconContainer}>
                                    {tab.isLoading && <Icon className={styles.loadingIcon} />}
                                    {!tab.isLoading && tab.favicon && (
                                        <img
                                            alt=""
                                            className={styles.afavicon}
                                            id="favicon-img"
                                            src={tab.favicon}
                                        />
                                    )}
                                </div>
                            )}
                            <Typography className={styles.tabText} id={styles.tabFont}>
                                {title || 'New Tab'}
                            </Typography>
                            <IconButton
                                size="small"
                                className={`${CLASSES.CLOSE_TAB} ${styles.closeTab}`}
                                title={I18n.t( 'close-tab' )}
                                aria-label={I18n.t( 'aria.close-tab' )}
                                onClick={( event ) => {
                                    this.handleTabClose( tabId, event );
                                }}
                            >
                                <ClearRoundedIcon />
                            </IconButton>
                        </Button>
                    </Grid>
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
            <Grid
                container
                className={[
                    styles.container,
                    process.platform === 'darwin' ? styles.containerMac : ''
                ].join( ' ' )}
                wrap="nowrap"
            >
                {this.getTabs()}
                <Grid item>
                    <IconButton
                        size="small"
                        className={`${CLASSES.ADD_TAB} ${styles.addTab}`}
                        title={I18n.t( 'add-tab' )}
                        aria-label={I18n.t( 'aria.add-tab' )}
                        onClick={this.handleAddTabClick}
                    >
                        <AddRoundedIcon />
                    </IconButton>
                </Grid>
            </Grid>
        );
    }
}
