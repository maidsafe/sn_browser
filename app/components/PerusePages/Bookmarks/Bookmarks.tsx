import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import Box from '@material-ui/core/Box';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { UrlList } from '$Components/UrlList';
import styles from './bookmarks.css';

const useStyles = makeStyles( ( theme: Theme ) =>
    createStyles( {
        bookmarkRoot: {
            flex: 1
        },
        titleBar: {
            backgroundColor: '#1976d2'
        },
        title: {
            flexGrow: 1,
            color: 'white'
        }
    } )
);

interface BookmarksProps {
    bookmarks: Array<any>;
    addTabEnd?: ( ...args: Array<any> ) => any;
}
export const Bookmarks = ( props: BookmarksProps = { bookmarks: [] } ) => {
    const { bookmarks, addTabEnd } = props;
    const bookmarkList = bookmarks.map( ( bookmark ) => bookmark.url );
    const classes = useStyles();

    return (
        <React.Fragment>
            <Box className={classes.bookmarkRoot}>
                <Grid item xs={12} className={classes.titleBar}>
                    <Toolbar>
                        <Typography variant="h6" className={classes.title}>
              Bookmarks
                        </Typography>
                    </Toolbar>
                </Grid>
            </Box>
            <UrlList list={bookmarkList} addTabEnd={addTabEnd} />
        </React.Fragment>
    );
};
