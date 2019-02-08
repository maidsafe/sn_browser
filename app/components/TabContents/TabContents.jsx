// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import url from 'url';
import styles from './tabContents.css';
import Tab from '@Components/Tab';
import { INTERNAL_PAGES } from '@Constants';
import { isInternalPage } from '@Utils/urlHelpers';
import History from '@Components/PerusePages/History';
import Bookmarks from '@Components/PerusePages/Bookmarks';
import logger from 'logger';

export default class TabContents extends Component {
    constructor(props) {
        super(props);
        this.allTabComponents = [];
    }
    getActiveTab() {
        return this.activeTab;
    }

    render() {
        const {
            addTab,
            addNotification,
            closeTab,
            bookmarks,
            allTabs,
            tabs,
            updateActiveTab,
            updateTab,
            isActiveTabReloading,
            pageLoaded,
            windowId,
            safeExperimentsEnabled,
            focusWebview,
            shouldFocusWebview,
            activeTabBackwards
        } = this.props;

        const tabComponents = tabs.map((tab, i) => {
            if (!tab.isClosed) {
                const isActiveTab = tab.isActiveTab;
                if (isInternalPage(tab)) {
                    const urlObj = url.parse(tab.url);
                    switch (urlObj.host) {
                        case INTERNAL_PAGES.HISTORY: {
                            return (
                                <History
                                    addTab={addTab}
                                    history={allTabs}
                                    key={tab.index}
                                    isActiveTab={isActiveTab}
                                    ref={c => {
                                        if (isActiveTab) {
                                            this.activeTab = c;
                                        }
                                    }}
                                />
                            );
                        }
                        case INTERNAL_PAGES.BOOKMARKS: {
                            return (
                                <Bookmarks
                                    addTab={addTab}
                                    bookmarks={bookmarks}
                                    key={tab.index}
                                    isActiveTab={isActiveTab}
                                    ref={c => {
                                        if (isActiveTab) {
                                            this.activeTab = c;
                                        }
                                    }}
                                />
                            );
                        }

                        default: {
                            return <div key="sorry">Sorry what?</div>;
                        }
                    }
                }

                const TheTab = (
                    <Tab
                        addNotification={addNotification}
                        webId={tab.webId}
                        url={tab.url}
                        isActiveTab={isActiveTab}
                        isActiveTabReloading={isActiveTabReloading}
                        addTab={addTab}
                        closeTab={closeTab}
                        updateTab={updateTab}
                        updateActiveTab={updateActiveTab}
                        pageLoaded={pageLoaded}
                        key={tab.index}
                        index={tab.index}
                        windowId={windowId}
                        safeExperimentsEnabled={safeExperimentsEnabled}
                        focusWebview={focusWebview}
                        shouldFocusWebview={shouldFocusWebview}
                        activeTabBackwards={activeTabBackwards}
                        ref={c => {
                            if (isActiveTab) {
                                this.activeTab = c;
                            }
                        }}
                    />
                );
                return TheTab;
            }
        });

        return <div className={styles.container}>{tabComponents}</div>;
    }
}
