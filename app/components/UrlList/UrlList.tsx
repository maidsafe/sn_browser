/* eslint-disable */
import React, { Component } from 'react';
// import { logger } from '$Logger';
import { TableRow, TableCell, Table } from 'nessie-ui';
import styles from './urlList.css';

interface UrlListProps {
    list: Array<any>;
    onRemove?: ( ...args: Array<any> ) => any;
    addTabEnd: ( ...args: Array<any> ) => any;
    windowId: number;
}
export default class UrlList extends Component<UrlListProps, {}> {
    static defaultProps = {
        list: []
    };

    render = () => {
        const { list, addTabEnd, windowId } = this.props;
        const parsedList = [];
        list.forEach( ( item, i ) => {
            const handleClick = e => {
                // required to prevent the app navigating by default.
                e.preventDefault();
                const tabId = Math.random().toString( 36 );
                addTabEnd( {
                    url: item,
                    tabId,
                    windowId
                } );
            };
            const listItem = (
                <TableRow align="left" verticalAlign="middle" gutters="S" key={i}>
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
