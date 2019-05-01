import React, { Component } from 'react';
// import { logger } from '$Logger';
import { TableRow, TableCell, Table } from 'nessie-ui';
import styles from './urlList.css';

interface UrlListProps {
    list: Array<any>;
    onRemove?: ( ...args: Array<any> ) => any;
    addTab?: ( ...args: Array<any> ) => any;
}
export const UrlList = ( props: UrlListProps = { list: [] } ) => {
    const { addTab, list } = props;
    const parsedList = [];
    list.forEach( ( item ) => {
        const handleClick = ( event ) => {
            // required to prevent the app navigating by default.
            event.preventDefault();
            addTab( {
                url: item,
                isActiveTab: true
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
