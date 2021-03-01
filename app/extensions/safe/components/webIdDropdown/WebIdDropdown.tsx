import React, { Component } from 'react';
// import styles from './browser.css';
import { IconButton } from 'nessie-ui';
import _ from 'lodash';
// import { logger } from '$Logger';
import { Icon } from 'antd';

import styles from './webIdButtons.css';

import { SAFE } from '$Extensions/safe/constants';
import { startedRunningMock } from '$Constants';
import 'antd/lib/icon/style';

const hideDropdownTimeout = 0.15; // seconds
const webIdManagerUri = startedRunningMock
    ? 'http://localhost:1234'
    : 'safe://webidmgr.dapp';

interface WebIdDropdownProperties {
    safeBrowserApp: {
        webIds: Array<any>;
        showingWebIdDropdown: boolean;
        experimentsEnabled: boolean;
        appStatus: string;
        networkStatus: number;
        isFetchingWebIds: boolean;
    };
    activeTab: {
        webId: number;
        tabId: string;
    };
    addTabEnd: () => void;
    getAvailableWebIds: () => void;
    updateTabWebId: () => void;
    showWebIdDropdown: () => void;
    windowId: number;
}
export class WebIdDropdown extends Component<
WebIdDropdownProperties,
Record<string, unknown>
> {
    static defaultProps = {
        safeBrowserApp: {
            webIds: [],
        },
    };

    private debouncedGetWebIds: () => void;

    private hoverTime: number;

    private isMouseOverIdButton: boolean;

    constructor( props ) {
        super( props );
        const { getAvailableWebIds } = props;
        if ( !getAvailableWebIds ) return;
        this.debouncedGetWebIds = _.debounce( getAvailableWebIds, 2000 );
    }

    handleIdClick = ( webId ) => {
        const {
            updateTabWebId,
            windowId,
            showWebIdDropdown,
            activeTab,
        } = this.props;
        const { tabId } = activeTab;
        // also if only 1 webID? mark as defualt?
        updateTabWebId( { tabId, webId } );
    };

    handleIdButtonClick = () => {
        const { showWebIdDropdown } = this.props;
        this.hoverTime = new Date().getTime();
        showWebIdDropdown( true );
    };

    handleMouseEnter = () => {
        this.hoverTime = new Date().getTime();
        this.isMouseOverIdButton = true;
        const { getAvailableWebIds, safeBrowserApp } = this.props;
        const { isFetchingWebIds } = safeBrowserApp;
        if (
            safeBrowserApp.appStatus === SAFE.APP_STATUS.AUTHORISED &&
      !isFetchingWebIds
        ) {
            this.debouncedGetWebIds();
        }
    };

    launchWebIdManager = () => {
        const { addTabEnd } = this.props;
        const tabId = Math.random().toString( 36 );
        addTabEnd( { tabId, url: webIdManagerUri } );
    };

    authorisePeruse = () => {
        const { setAppStatus } = this.props;
        setAppStatus( SAFE.APP_STATUS.TO_AUTH );
    };

    handleMouseLeave = () => {
        this.isMouseOverIdButton = false;
        setTimeout( this.closeIfNotOver, hideDropdownTimeout * 1000 );
    };

    closeIfNotOver = () => {
        const { showWebIdDropdown } = this.props;
        const now = new Date().getTime();
        const diff = ( now - this.hoverTime ) / 1000;
        if ( diff > hideDropdownTimeout ) {
            showWebIdDropdown( false );
        }
    };

    render() {
        const { safeBrowserApp, activeTab } = this.props;
        const {
            showingWebIdDropdown,
            webIds,
            experimentsEnabled,
            appStatus,
            networkStatus,
            isFetchingWebIds,
        } = safeBrowserApp;
        let activeWebId;
        const { handleIdClick } = this;
        let webIdsList;
        if ( activeTab !== undefined ) {
            activeWebId = activeTab.webId || {};
            webIdsList = webIds.map( ( webId ) => {
                const nickname = webId['#me'].nick || webId['#me'].name;
                const isSelected = webId['@id'] === activeWebId['@id'];
                if ( isSelected ) {
                    return (
                        <li
                            onClick={handleIdClick.bind( this, webId )}
                            key={webId['@id']}
                            className={styles.selectedWebId}
                            role="presentation"
                        >
                            {nickname}
                        </li>
                    );
                }
                return (
                    <li
                        onClick={handleIdClick.bind( this, webId )}
                        key={webId['@id']}
                        className={styles.webId}
                        role="presentation"
                    >
                        {nickname}
                    </li>
                );
            } );
        }
        let webIdDropdownContents = [];
        if ( appStatus !== SAFE.APP_STATUS.AUTHORISED ) {
            webIdDropdownContents.push(
                <li
                    onClick={this.authorisePeruse}
                    onKeyUp={this.authorisePeruse}
                    className={styles.webIdInfo}
                    key="noAuth"
                    role="presentation"
                >
                    {/* esllint-disable-next-line  jsx-a11y/anchor-is-valid */}
                    <a href="#">Authorise to display your WebIds.</a>
                </li>
            );
        } else if ( webIdsList !== undefined && webIdsList.length > 0 ) {
            webIdDropdownContents = webIdsList;
        } else {
            webIdDropdownContents.push(
                <li className={styles.webIdInfo} key="noId">
          No WebIds Found.
                </li>
            );
        }
        // This will be quite fast on mock.
        // TODO: Add transition.
        if ( isFetchingWebIds ) {
            webIdDropdownContents = webIdDropdownContents || [];
            webIdDropdownContents.push(
                <li className={styles.openAuth} key="fetching">
          Updating webIds &nbsp;
                    <Icon type="loading" className={styles.loadingIcon} />
                </li>
            );
        }
        return (
            <div
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
            >
                <IconButton
                    onClick={this.handleIdButtonClick}
                    iconTheme="navigation"
                    iconType="account"
                    size="S"
                    style={{ cursor: 'pointer' }}
                />
                {showingWebIdDropdown && (
                    <ul className={styles.webIdList}>
                        {webIdDropdownContents}
                        <li
                            onClick={this.launchWebIdManager}
                            className={styles.webIdManager}
                            role="presentation"
                        >
                            {/* esllint-disable-next-line  jsx-a11y/anchor-is-valid */}
                            <a href="#">Launch WebIdManager</a>
                        </li>
                    </ul>
                )}
            </div>
        );
    }
}
