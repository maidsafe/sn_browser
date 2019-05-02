import React, { Component } from 'react';
import url from 'url';
import { Tab } from '$Components/Tab';
import { INTERNAL_PAGES, isRunningTestCafeProcess } from '$Constants';
import { isInternalPage } from '$Utils/urlHelpers';
import { History } from '$Components/PerusePages/History';
import { Bookmarks } from '$Components/PerusePages/Bookmarks';
// import { logger } from '$Logger';
import styles from './tabContents.css';

interface TabContentsProps {
    addTab: Function;
    addNotification: Function;
    closeTab: Function;
    bookmarks: Array<any>;
    allTabs: Array<any>;
    tabs: Array<any>;
    updateTab: Function;
    windowId: number;
    safeExperimentsEnabled: boolean;
    focusWebview: Function;
    shouldFocusWebview: boolean;
    tabBackwards: Function;
}

interface TabState {
    hasError: boolean;
    theError: Error;
}

export class TabContents extends Component<TabContentsProps, TabState> {
    static getDerivedStateFromError( error ) {
    // Update state so the next render will show the fallback UI.
        return { hasError: true, theError: error };
    }

    allTabComponents: Array<any>;

    constructor( props ) {
        super( props );
        this.allTabComponents = [];
    }

    render() {
        const {
            addTab,
            addNotification,
            closeTab,
            bookmarks,
            allTabs,
            tabs,
            updateTab,
            windowId,
            safeExperimentsEnabled,
            focusWebview,
            shouldFocusWebview,
            tabBackwards
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

        const tabComponents = tabs.map(
            ( tab, i ): React.ReactNode => {
                if ( !tab.isClosed ) {
                    const { isActiveTab } = tab;
                    if ( isInternalPage( tab ) ) {
                        const urlObj = url.parse( tab.url );
                        switch ( urlObj.host ) {
                            case INTERNAL_PAGES.HISTORY: {
                                return (
                                    <History
                                        addTab={addTab}
                                        history={allTabs}
                                        key={tab.index}
                                        isActiveTab={isActiveTab}
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
                                        addTab={addTab}
                                        bookmarks={bookmarks}
                                        key={tab.index}
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
                        return <div>no tab for testcafe </div>;
                    }
                    const TheTab = (
                        <Tab
                            addNotification={addNotification}
                            webId={tab.webId}
                            url={tab.url}
                            isActiveTab={isActiveTab}
                            addTab={addTab}
                            closeTab={closeTab}
                            updateTab={updateTab}
                            key={tab.index}
                            index={tab.index}
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
                }

                return null;
            }
        );
        return <div className={styles.container}>{tabComponents}</div>;
    }
}
