import React, { Component } from 'react';
import url from 'url';
import { Tab } from '$Components/Tab';
import { INTERNAL_PAGES, isRunningTestCafeProcess } from '$Constants';
import { isInternalPage } from '$Utils/urlHelpers';
import { History } from '$Components/PerusePages/History';
import { Bookmarks } from '$Components/PerusePages/Bookmarks';
import { logger } from '$Logger';
import styles from './tabContents.css';

export class TabContents extends Component<{}, {}> {
    static getDerivedStateFromError( error ) {
    // Update state so the next render will show the fallback UI.
        return { hasError: true, theError: error };
    }

    render() {
        const {
            tabBackwards,
            focusWebview,
            shouldFocusWebview,
            closeTab,
            addTabNext,
            addTabEnd,
            activeTabId,
            setActiveTab,
            activeTab,
            addNotification,
            updateTab,
            tabs,
            allTabs,
            bookmarks,
            windowId,
            safeExperimentsEnabled
        } = this.props;

        if ( this.state && this.state.hasError ) {
            const err = this.state.theError;

            // You can render any custom fallback UI
            return (
                <div>
                    <h4>Something went wrong in TabContents.tsx</h4>
                    <span>
                        {JSON.stringify( err, ['message', 'arguments', 'type', 'name'] )}
                    </span>
                </div>
            );
        }

        const tabComponents = tabs.map( ( tab, i ) => {
            const isActiveTab = tab.tabId === activeTabId;
            if ( isInternalPage( tab ) ) {
                const urlObj = url.parse( tab.url );
                switch ( urlObj.host ) {
                    case INTERNAL_PAGES.HISTORY: {
                        return (
                            <History
                                addTabEnd={addTabEnd}
                                history={allTabs}
                                key={tab.tabId}
                                isActiveTab={isActiveTab}
                                windowId={windowId}
                                ref={( c ) => {
                                    if ( isActiveTab ) {
                                        this.activeTab = c;
                                    }
                                }}
                            />
                        );
                    }
                    case INTERNAL_PAGES.BOOKMARKS: {
                        return (
                            <Bookmarks
                                addTabEnd={addTabEnd}
                                windowId={windowId}
                                bookmarks={bookmarks}
                                key={tab.tabId}
                                isActiveTab={isActiveTab}
                                ref={( c ) => {
                                    if ( isActiveTab ) {
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

            if ( isRunningTestCafeProcess ) {
                // tab contents cant be parsed atm.
                return <div>no tab for testcafe UI tests.</div>;
            }

            const TheTab = (
                <Tab
                    addNotification={addNotification}
                    webId={tab.webId}
                    url={tab.url}
                    isActiveTab={isActiveTab}
                    closeTab={closeTab}
                    updateTab={updateTab}
                    addTabNext={addTabNext}
                    addTabEnd={addTabEnd}
                    setActiveTab={setActiveTab}
                    key={tab.tabId}
                    tabId={tab.tabId}
                    windowId={windowId}
                    safeExperimentsEnabled={safeExperimentsEnabled}
                    focusWebview={focusWebview}
                    shouldFocusWebview={shouldFocusWebview}
                    tabBackwards={tabBackwards}
                    shouldReload={tab.shouldReload}
                    shouldToggleDevTools={tab.shouldToggleDevTools}
                    ref={( c ) => {
                        if ( isActiveTab ) {
                            this.activeTab = c;
                        }
                    }}
                />
            );
            return TheTab;
        } );
        return <div className={styles.container}>{tabComponents}</div>;
    }
}
