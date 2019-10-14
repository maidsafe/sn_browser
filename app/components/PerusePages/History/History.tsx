import React, { Component } from 'react';
import moment from 'moment';
import { remote } from 'electron';
import { parse } from 'url';
import _ from 'lodash';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import Box from '@material-ui/core/Box';
import { logger } from '$Logger';
import styles from './history.css';
import { CLASSES } from '$Constants';
import { urlIsValid } from '$Extensions';

interface HistoryProps {
    history: Record<string, any>;
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
        const { history, windowId, addTabEnd } = this.props;

        const ignoreList = [
            'about:blank',
            'safe-browser://history',
            'safe-browser://bookmarks'
        ];
        const dates = Object.keys( history );
        let list = [];
        const parsedList = [];
        dates.forEach( ( date ) => {
            list = [...history[date]];
            list = _.uniq( list );
            list = list.filter( ( listObj ) => {
                const { url } = listObj;
                const urlObj = parse( url );
                if ( ignoreList.includes( url ) ) {
                    return false;
                }
                return urlIsValid( url );
            } );

            if ( list.length >= 1 ) {
                const dateHeader = (
                    <TableRow align="left" verticalAlign="middle" gutters="S" key={date}>
                        <TableCell className={styles.date}>
                            <h1>{date}</h1>
                        </TableCell>
                    </TableRow>
                );
                parsedList.push( dateHeader );
                list.forEach( ( item ) => {
                    const timeStamp = new Date( item.timeStamp );
                    const newTimeStamp = moment
                        .utc( timeStamp )
                        .local()
                        .format( 'LT' );
                    const handleClick = ( event ) => {
                        // required to prevent the app navigating by default.
                        event.preventDefault();
                        const tabId = Math.random().toString( 36 );
                        addTabEnd( {
                            url: item.url,
                            tabId,
                            windowId
                        } );
                    };
                    const listItem = (
                        <TableRow key={Math.random().toString( 10 )}>
                            <TableCell
                                className={styles.item}
                                align="left"
                                aria-label="historyListItem"
                            >
                                <span className={styles.timeStamp}>{newTimeStamp}</span>
                                <a onClick={handleClick} href={item.url} className={styles.url}>
                                    {item.url}
                                </a>
                            </TableCell>
                        </TableRow>
                    );
                    parsedList.push( listItem );
                } );
            }
        } );

        return (
            <React.Fragment>
                <Box className={styles.historyHeader}>
                    <Grid item xs={12} className={styles.titleBar}>
                        <Toolbar>
                            <Typography variant="h6" className={styles.title}>
                History
                            </Typography>
                        </Toolbar>
                    </Grid>
                </Box>
                <Table className={styles.table}>
                    {parsedList}
                    {!parsedList.length && (
                        <TableRow>
                            <TableCell aria-label="no-history">
                Nothing to see here yet.
                            </TableCell>
                        </TableRow>
                    )}
                </Table>
            </React.Fragment>
        );
    }
}
