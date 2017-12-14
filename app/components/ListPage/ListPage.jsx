// @flow
import React, { Component } from 'react';
// import { Link } from 'react-router';
import { ipcRenderer, remote } from 'electron';
import PropTypes from 'prop-types';

import { Column, Page, H1, Row, Text } from 'nessie-ui';

import styles from './listPage.css';

const log = require( 'electron-log' );

// TODO: Link list?
export default class ListPage extends Component
{
    static propTypes =
    {
        list : PropTypes.array.isRequired,
        title: PropTypes.string,
        onRemove: PropTypes.func
    }

    static defaultProps =
    {
        list : []
    }


    render()
    {
        const { list, title, isActiveTab } = this.props;

        let moddedClass = styles.tab;
        if ( isActiveTab )
        {
            moddedClass = styles.activeTab;
        }
        const parsedList = [];

        list.forEach( ( item, i ) =>
        {
            console.log('an ittemmmmmmmmmm', item)
            const listItem = (
                <Row
                    align="left"
                    verticalAlign="middle"
                    gutters="S"
                    key={ i }
                >
                    <Column>
                        <Text>
                            <a href={ item.url } >
                                { item.url }
                            </a>
                        </Text>
                    </Column>
                </Row>
            );

            parsedList.push( listItem );
        } );


        return (
            <div className={ moddedClass } >
                <div className={ `${styles.container} js-history` } >
                    <Page>
                        <H1>{title}</H1>
                        { parsedList }
                    </Page>

                </div>
            </div>
        );
    }
}
