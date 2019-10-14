import React, { Component } from 'react';
// import { logger } from '$Logger';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import styles from './urlList.css';

interface UrlListProps {
    list: Array<any>;
    onRemove?: ( ...args: Array<any> ) => any;
    addTabEnd: ( ...args: Array<any> ) => any;
    windowId: number;
}
export const UrlList = ( props: UrlListProps = { list: [] } ) => {
    const { addTabEnd, list, windowId } = props;
    const parsedList = [];
    list.forEach( ( item ) => {
        const handleClick = ( event ) => {
            // required to prevent the app navigating by default.
            event.preventDefault();
            const tabId = Math.random().toString( 36 );
            addTabEnd( {
                url: item,
                tabId,
                windowId
            } );
        };
        const listItem = (
            <TableRow key={item}>
                <TableCell align="left" aria-label="listItem">
                    <a onClick={handleClick} href={item}>
                        {item}
                    </a>
                </TableCell>
            </TableRow>
        );
        parsedList.push( listItem );
    } );
    return (
        <Table className={styles.table}>
            {parsedList}
            {!parsedList.length && (
                <TableRow>
                    <TableCell>Nothing to see here yet.</TableCell>
                </TableRow>
            )}
        </Table>
    );
};
