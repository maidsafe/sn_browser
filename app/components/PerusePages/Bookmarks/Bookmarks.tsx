import React, { Component } from 'react';
import { Page, H1, PageHeader } from 'nessie-ui';
import { UrlList } from '$Components/UrlList';
import styles from './bookmarks.css';

interface BookmarksProps {
    bookmarks: Array<any>;
    addTabEnd?: ( ...args: Array<any> ) => any;
}
export const Bookmarks = ( props: BookmarksProps = { bookmarks: [] } ) => {
    const { bookmarks, addTabEnd } = props;
    const bookmarkList = bookmarks.map( ( bookmark ) => bookmark.url );

    return (
        <React.Fragment>
            <PageHeader>
                <H1 title="Bookmarks" />
            </PageHeader>
            <UrlList list={bookmarkList} addTabEnd={addTabEnd} />
        </React.Fragment>
    );
};
