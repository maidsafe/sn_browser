// @flow
import React, { Component } from 'react';
import { ipcRenderer, remote } from 'electron';
import PropTypes from 'prop-types';

import { PageContent, Text, TableRow, TableCell, Table } from 'nessie-ui';

import styles from './urlList.css';

export default class UrlList extends Component
{
    static propTypes =
    {
        list     : PropTypes.array.isRequired,
        onRemove : PropTypes.func
    }

    static defaultProps =
    {
        list : []
    }


    render()
    {
        const { list } = this.props;

        const parsedList = [];

        list.forEach( ( item, i ) =>
        {
            const listItem = (
                <TableRow
                    align="left"
                    verticalAlign="middle"
                    gutters="S"
                    key={ i }
                >
                    <a href={ item } >
                        { item }
                    </a>
                </TableRow>
            );

            parsedList.push( listItem );
        } );


        return (
            <Table
                className={ styles.table }
            >
                { parsedList }
                { ! parsedList.length &&
                    <TableCell>{'Nothing to see here yet'}</TableCell>
                }
            </Table>
        );
    }
}
