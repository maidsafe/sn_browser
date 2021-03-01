import React, { Component } from 'react';
import url, { Url } from 'url';
import { Page } from 'nessie-ui';

import styles from './tabContents.css';

import { Tab } from '$Components/Tab';
import { INTERNAL_PAGES, isRunningTestCafeProcess, CLASSES } from '$Constants';
import { isInternalPage } from '$Utils/urlHelpers';
import { History } from '$Components/PerusePages/History';
import { Bookmarks } from '$Components/PerusePages/Bookmarks';
import { logger } from '$Logger';
import { resolveExtensionInternalPages } from '$Extensions/renderProcess';

export class TabContents extends Component<
Record<string, unknown>,
Record<string, unknown>
> {
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
            history,
            addNotification,
            updateTabUrl,
            updateTabWebContentsId,
            updateTabWebId,
            toggleDevTools,
            tabShouldReload,
            updateTabTitle,
            updateTabFavicon,
            tabLoad,
            tabs,
            allTabs,
            bookmarks,
            windowId,
            safeExperimentsEnabled,
        } = this.props;

        if ( this.state && this.state.hasError ) {
            const error = this.state.theError;

            // You can render any custom fallback UI
            return (
                <div>
                    <h4>Something went wrong in TabContents.tsx</h4>
                    <span>
                        {JSON.stringify( error, ['message', 'arguments', 'type', 'name'] )}
                    </span>
                </div>
            );
        }

        const tabComponents = tabs.map( ( tab, i ) => {
            const isActiveTab = tab.tabId === activeTabId;

            if ( isInternalPage( tab ) ) {
                const parseQuery = true;
                const urlObject = url.parse( tab.url, parseQuery );
                const extensionPage = resolveExtensionInternalPages(
                    urlObject,
                    urlObject.query,
                    tab,
                    this.props
                );

                if ( extensionPage ) {
                    return extensionPage.pageComponent;
                }

                switch ( urlObject.host ) {
                    case INTERNAL_PAGES.HISTORY: {
                        return (
                            <History
                                addTabEnd={addTabEnd}
                                history={history}
                                windowId={windowId}
                            />
                        );
                    }
                    case INTERNAL_PAGES.BOOKMARKS: {
                        return (
                            <Bookmarks
                                addTabEnd={addTabEnd}
                                windowId={windowId}
                                bookmarks={bookmarks}
                            />
                        );
                    }
                    default: {
                        return (
                            <div key="sorry">{`Internal page "${urlObject.host}" does not exist.`}</div>
                        );
                    }
                }
            }

            if ( isRunningTestCafeProcess ) {
                return <div>No _real_ tab for testcafe, please</div>;
            }

            return (
                <Tab
                    key={tab.tabId}
                    addNotification={addNotification}
                    webId={tab.webId}
                    url={tab.url}
                    isActiveTab={isActiveTab}
                    closeTab={closeTab}
                    updateTabUrl={updateTabUrl}
                    updateTabWebId={updateTabWebId}
                    updateTabWebContentsId={updateTabWebContentsId}
                    toggleDevTools={toggleDevTools}
                    tabShouldReload={tabShouldReload}
                    updateTabTitle={updateTabTitle}
                    updateTabFavicon={updateTabFavicon}
                    tabLoad={tabLoad}
                    addTabNext={addTabNext}
                    addTabEnd={addTabEnd}
                    setActiveTab={setActiveTab}
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
        } );

        return (
            <div className={styles.container}>
                {tabs.map( ( tab, i ) => {
                    let moddedClass = styles.tab;
                    const isActiveTab = tab.tabId === activeTabId;

                    if ( isActiveTab ) {
                        moddedClass = styles.activeTab;
                    }

                    const ThisTab = tabComponents[i];

                    return (
                        <div className={moddedClass} key={tab.tabId}>
                            <Page className={`${styles.page}`} overflow="auto">
                                {tabComponents[i]}
                            </Page>
                        </div>
                    );
                } )}
            </div>
        );
    }
}
