
import React, { Component } from "react";
import { ipcRenderer, remote } from "electron";
import { parse } from "url";
import _ from "lodash";
import { Column, Page, PageHeader, H1, Row, Text } from "nessie-ui";
import UrlList from "@Components/UrlList";
import styles from "./history.css";
import { CLASSES } from "@Constants";
import { urlIsValid } from "@Extensions";

const log = require( "electron-log" );

interface HistoryProps {
    history: any[],
    addTab: ( ...args: any[] ) => any
}
export default class History extends Component<HistoryProps, {}> {
    static defaultProps = {
        history: []
    };

    isInFocussedWindow = () => {
        const BrowserWindow = remote.BrowserWindow;
        const focussedWindowId = BrowserWindow.getFocusedWindow().id;
        const currentWindowId = remote.getCurrentWindow().id;
        return focussedWindowId === currentWindowId;
    };

    render() {
        const { addTab, history, isActiveTab } = this.props;
        let historyList = [];
        history.forEach( ( tab, i ) => {
            if ( tab.history ) {
                tab.history.forEach( ( history, ii ) => {
                    const historyItem = history;
                    historyList.push( historyItem );
                } );
            }
        } );
        const ignoreProtocolList = ["safe-auth:"];
        const ignoreList = [
            "about:blank",
            "safe-browser://history",
            "safe-browser://bookmarks"
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
                        <UrlList list={historyList} addTab={addTab} />
                    </Page>
                </div>
            </div>
        );
    }
}
