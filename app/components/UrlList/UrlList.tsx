import React, { Component } from 'react';
// import { logger } from '$Logger';
import Grid from '@material-ui/core/Grid';
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
            <Grid container key={item} justify="flex-start">
                <Grid item aria-label="listItem">
                    <a onClick={handleClick} href={item}>
                        {item}
                    </a>
                </Grid>
            </Grid>
        );
        parsedList.push( listItem );
    } );
    return (
        <Grid container className={styles.table}>
            <Grid item>{parsedList}</Grid>
            {!parsedList.length && <Grid item>Nothing to see here yet.</Grid>}
        </Grid>
    );
};
