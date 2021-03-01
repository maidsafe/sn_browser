import React, { Component } from 'react';
// import { logger } from '$Logger';
import { TableRow, TableCell, Table } from 'nessie-ui';

import styles from './urlList.css';

interface UrlListProperties {
    list: Array<any>;
    onRemove?: ( ...arguments_: Array<any> ) => any;
    addTabEnd: ( ...arguments_: Array<any> ) => any;
    windowId: number;
}
export const UrlList = ( props: UrlListProperties = { list: [] } ) => {
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
                windowId,
            } );
        };
        const listItem = (
            <TableRow align="left" verticalAlign="middle" gutters="S" key={item}>
                <TableCell>
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
