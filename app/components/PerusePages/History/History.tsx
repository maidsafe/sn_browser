import React, { Component } from 'react';
import { remote } from 'electron';
import { parse } from 'url';
import _ from 'lodash';
import { Page, PageHeader, H1 } from 'nessie-ui';
import { UrlList } from '$Components/UrlList';
import styles from './history.css';
import { CLASSES } from '$Constants';
import { urlIsValid } from '$Extensions';
import { addTabEnd, setActiveTab } from '$Actions/windows_actions';

interface HistoryProps {
    history: Array<any>;
    isActiveTab: boolean;
    addTabEnd: ( ...args: Array<any> ) => any;
    windowId: number;
}
export class History extends Component<HistoryProps, {}> {
    static defaultProps = {
        history: []
    };

    isInFocussedWindow = () => {
        const { BrowserWindow } = remote;
        const focussedWindowId = BrowserWindow.getFocusedWindow().id;
        const currentWindowId = remote.getCurrentWindow().id;
        return focussedWindowId === currentWindowId;
    };

    render() {
        const { history, isActiveTab, windowId, addTabEnd } = this.props;
        let historyList = [];
        const historyArray = [];
        Object.keys( history ).map( function( key ) {
            historyArray.push( history[key] );
        } );
        historyArray.forEach( ( tab, i ) => {
            if ( tab.history ) {
                tab.history.forEach( tabsHistory => {
                    const historyItem = tabsHistory;
                    historyList.push( historyItem );
                } );
            }
        } );
        const ignoreProtocolList = ['safe-auth:'];
        const ignoreList = [
            'about:blank',
            'safe-browser://history',
            'safe-browser://bookmarks'
        ];
        // TODO: uniq by object props, so will be less harsh once we have title etc.
        historyList = _.uniq( historyList );
        historyList = historyList.filter( url => {
            const urlObj = parse( url );
            if (
                ignoreList.includes( url ) ||
        ignoreProtocolList.includes( urlObj.protocol )
            ) {
                return false;
            }
            return urlIsValid( url );
        } );
        let moddedClass = styles.tab;
        if ( isActiveTab ) {
            moddedClass = styles.activeTab;
        }
        return (
            <div className={moddedClass}>
                <div className={`${styles.container} js-history`}>
                    <Page
                        className={`${CLASSES.SAFE_BROWSER_PAGE} ${styles.page}`}
                        overflow="auto"
                    >
                        <PageHeader>
                            <H1 title="History" />
                        </PageHeader>
                        <UrlList
                            list={historyList}
                            addTabEnd={addTabEnd}
                            windowId={windowId}
                        />
                    </Page>
                </div>
            </div>
        );
    }
}
