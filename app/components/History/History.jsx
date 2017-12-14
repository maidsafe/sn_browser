// @flow
import React, { Component } from 'react';
// import { Link } from 'react-router';
import { ipcRenderer, remote } from 'electron';
import PropTypes from 'prop-types';

import { Column, Page, H1, Row, Text } from 'nessie-ui';

import styles from './history.css';

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

        const tabsHistory = [];

        tabs.forEach( ( tab, i ) =>
        {
            tab.history.forEach( ( history, ii ) =>
            {
                const historyItem = (
                    <Row
                        align="left"
                        verticalAlign="middle"
                        gutters="S"
                        key={ i + ii }
                    >
                        <Column>
                            <Text>
                                <a href={ history } >
                                    { history }
                                </a>
                            </Text>
                        </Column>
                    </Row>
                );

                tabsHistory.push( historyItem );
            } );
        } );


        let moddedClass = styles.tab;
        if ( isActiveTab )
        {
            moddedClass = styles.activeTab;
        }


        return (
            <div className={ moddedClass } >
                <div className={ `${styles.container} js-history` } >
                    <Page>
                        <H1>History</H1>
                        { tabsHistory }
                    </Page>

                </div>
            </div>
        );
    }
}
