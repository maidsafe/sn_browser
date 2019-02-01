import React, { Component } from 'react';
// import styles from './browser.css';
import {
    CLASSES,
    isRunningSpectronTestProcess,
    startedRunningMock
} from '@Constants';
import { SAFE } from '@Extensions/safe/constants';
import { Column, IconButton, Grid } from 'nessie-ui';
import _ from 'lodash';
import logger from 'logger';
import styles from './webIdButtons.css';

const hideDropdownTimeout = 0.15; // seconds
const webIdManagerUri = startedRunningMock
    ? 'http://localhost:1234'
    : 'safe://webidmgr.dapp';
const authHomeUri = 'safe-auth://home';

export default class WebIdDropdown extends Component {
    static defaultProps = {
        safeBrowserApp: {
            webIds: []
        }
    };

    constructor(props) {
        super(props);

        const { getAvailableWebIds } = props;

        if (!getAvailableWebIds) return;

        this.debouncedGetWebIds = _.debounce(getAvailableWebIds, 2000);
    }

    handleIdClick = webId => {
        const { updateActiveTab, windowId, showWebIdDropdown } = this.props;
        // also if only 1 webID? mark as defualt?
        updateActiveTab({ windowId, webId });
    };

    handleIdButtonClick = () => {
        const { showWebIdDropdown } = this.props;
        this.hoverTime = new Date();
        showWebIdDropdown(true);
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
        const { addTab } = this.props;

        addTab({ url: webIdManagerUri, isActiveTab: true });
    };

    launchAuthenticator = () => {
        const { addTab } = this.props;

        addTab({ url: authHomeUri, isActiveTab: true });
    };

    authorisePeruse = () => {
        const { setAppStatus } = this.props;

        setAppStatus(SAFE.APP_STATUS.TO_AUTH);
    };

    handleMouseLeave = () => {
        this.isMouseOverIdButton = false;

        setTimeout(this.closeIfNotOver, hideDropdownTimeout * 1000);
    };

    closeIfNotOver = () => {
        const { showWebIdDropdown } = this.props;

        const now = new Date().getTime();
        const diff = (now - this.hoverTime) / 1000;

        if (diff > hideDropdownTimeout) {
            showWebIdDropdown(false);
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
            isFetchingWebIds
        } = safeBrowserApp;

        const activeWebId = activeTab.webId || {};

        const handleIdClick = this.handleIdClick;
        const webIdsList = webIds.map(webId => {
            const nickname = webId['#me'].nick || webId['#me'].name;

            const isSelected = webId['@id'] === activeWebId['@id'];

            if (isSelected) {
                return (
                    <li
                        onClick={handleIdClick.bind(this, webId)}
                        key={webId['@id']}
                        className={styles.selectedWebId}
                    >
                        {nickname}
                    </li>
                );
            }

            return (
                <li
                    onClick={handleIdClick.bind(this, webId)}
                    key={webId['@id']}
                    className={styles.webId}
                >
                    {nickname}
                </li>
            );
        });

        let webIdDropdownContents = [];

        if (appStatus !== SAFE.APP_STATUS.AUTHORISED) {
            webIdDropdownContents.push(
                <li
                    className={styles.webIdInfo}
                    onClick={this.authorisePeruse}
                    className={styles.openAuth}
                    key="noAuth"
                >
                    <a href="#">Authorise to display your WebIds.</a>
                </li>
            );
        } else if (webIdsList.length > 0) {
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
        if (isFetchingWebIds) {
            webIdDropdownContents = webIdDropdownContents || [];

            webIdDropdownContents.push(
                <li
                    className={styles.webIdInfo}
                    className={styles.openAuth}
                    key="fetching"
                >
                    Updating webIds.
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
                        >
                            <a href="#">Launch WebIdManager</a>
                        </li>
                    </ul>
                )}
            </div>
        );
    }
}
