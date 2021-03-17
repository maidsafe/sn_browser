import React, { Component } from 'react';
import { Page, H1, PageHeader } from 'nessie-ui';

import styles from './bookmarks.css';

import { UrlList } from '$Components/UrlList';

interface BookmarksProperties {
    bookmarks: Array<any>;
    addTabEnd?: ( ...arguments_: Array<any> ) => any;
}
export const Bookmarks = ( props: BookmarksProperties = { bookmarks: [] } ) => {
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
