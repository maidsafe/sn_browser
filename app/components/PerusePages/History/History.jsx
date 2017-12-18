// @flow
import React, { Component } from 'react';
// import { Link } from 'react-router';
import { ipcRenderer, remote } from 'electron';
import PropTypes from 'prop-types';

import { Column, Page, PageHeader, H1, Row, Text } from 'nessie-ui';
import UrlList from 'components/UrlList';
import styles from './history.css';
import { CLASSES } from 'appConstants';

const log = require( 'electron-log' );


export default class History extends Component
{
    static propTypes =
    {
        tabs : PropTypes.array.isRequired
    }

    static defaultProps =
    {
        tabs : []
    }

    isInFocussedWindow = ( ) =>
    {
        const BrowserWindow = remote.BrowserWindow;
        const focussedWindowId = BrowserWindow.getFocusedWindow().id;
        const currentWindowId = remote.getCurrentWindow().id;

        return focussedWindowId === currentWindowId;
    }

    // TODO: uniq. the array. Then, we need sort. for sort, we need time for each url....


    render()
    {
        const { tabs, isActiveTab } = this.props;

        const historyList = [];

        tabs.forEach( ( tab, i ) =>
        {
            tab.history.forEach( ( history, ii ) =>
            {
                const historyItem = history;

                historyList.push( historyItem );
            } );
        } );

        const urlList = ( <UrlList list={ historyList } /> );

        let moddedClass = styles.tab;
        if ( isActiveTab )
        {
            moddedClass = styles.activeTab;
        }


        return (
            <div className={ moddedClass } >
                <div className={ `${styles.container} js-history` } >
                    <Page
                        className={ `${CLASSES.PERUSE_PAGE} ${styles.page}` }
                    >
                        <PageHeader>
                            <H1 title="History" />
                        </PageHeader>
                        { urlList }
                    </Page>

                </div>
            </div>
        );
    }
}
