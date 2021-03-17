import React, { Component } from 'react';
import moment from 'moment';
import { remote } from 'electron';
import { parse } from 'url';
import _ from 'lodash';
import { PageHeader, H1, TableRow, TableCell, Table } from 'nessie-ui';

import styles from './history.css';

import { logger } from '$Logger';
import { CLASSES } from '$Constants';
import { urlIsValid } from '$Extensions';

interface HistoryProperties {
    history: Record<string, any>;
    addTabEnd: ( ...arguments_: Array<any> ) => any;
    windowId: number;
}
export class History extends Component<
HistoryProperties,
Record<string, unknown>
> {
    static defaultProps = {
        history: [],
    };

    isInFocussedWindow = () => {
        const { BrowserWindow } = remote;
        const focussedWindowId = BrowserWindow.getFocusedWindow().id;
        const currentWindowId = remote.getCurrentWindow().id;
        return focussedWindowId === currentWindowId;
    };

    render() {
        const { history, windowId, addTabEnd } = this.props;

        const ignoreList = new Set( [
            'about:blank',
            'safe-browser://history',
            'safe-browser://bookmarks',
        ] );
        const dates = Object.keys( history );
        let list = [];
        const parsedList = [];
        for ( const date of dates ) {
            list = [...history[date]];
            list = _.uniq( list );
            list = list.filter( ( listObject ) => {
                const { url } = listObject;
                const urlObject = parse( url );
                if ( ignoreList.has( url ) ) {
                    return false;
                }
                return urlIsValid( url );
            } );

            if ( list.length > 0 ) {
                const dateHeader = (
                    <TableRow align="left" verticalAlign="middle" gutters="S" key={date}>
                        <TableCell className={styles.date}>
                            <h1>{date}</h1>
                        </TableCell>
                    </TableRow>
                );
                parsedList.push( dateHeader );
                for ( const item of list ) {
                    const timeStamp = new Date( item.timeStamp );
                    const newTimeStamp = moment.utc( timeStamp ).local().format( 'LT' );
                    const handleClick = ( event ) => {
                        // required to prevent the app navigating by default.
                        event.preventDefault();
                        const tabId = Math.random().toString( 36 );
                        addTabEnd( {
                            url: item.url,
                            tabId,
                            windowId,
                        } );
                    };
                    const listItem = (
                        <TableRow
                            align="left"
                            verticalAlign="middle"
                            gutters="S"
                            key={Math.random().toString( 10 )}
                        >
                            <TableCell className={styles.item}>
                                <span className={styles.timeStamp}>{newTimeStamp}</span>
                                <a onClick={handleClick} href={item.url} className={styles.url}>
                                    {item.url}
                                </a>
                            </TableCell>
                        </TableRow>
                    );
                    parsedList.push( listItem );
                }
            }
        }

        return (
            <React.Fragment>
                <PageHeader className="js-history">
                    <H1 title="History" />
                </PageHeader>
                <Table className={styles.table}>
                    {parsedList}
                    {parsedList.length === 0 && (
                        <TableRow>
                            <TableCell>Nothing to see here yet.</TableCell>
                        </TableRow>
                    )}
                </Table>
            </React.Fragment>
        );
    }
}
