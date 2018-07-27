// @flow
import React, { Component } from 'react';
import { ipcRenderer, remote } from 'electron';
import PropTypes from 'prop-types';
import logger from 'logger';
import { PageContent, Text, TableRow, TableCell, Table } from 'nessie-ui';

import styles from './urlList.css';

export default class UrlList extends Component
{
    static propTypes =
    {
        list     : PropTypes.array.isRequired,
        onRemove : PropTypes.func,
        addTab   : PropTypes.func
    }

    static defaultProps =
    {
        list : []
    }

    render = () =>
    {
        const { addTab, list } = this.props;
        const parsedList = [];

        list.forEach( ( item, i ) =>
        {
            const handleClick = ( e ) =>
            {
                // required to prevent the app navigating by default.
                e.preventDefault();
                addTab( {
                    url         : item,
                    isActiveTab : true
                } );
            };

            const listItem = (
                <TableRow
                    align="left"
                    verticalAlign="middle"
                    gutters="S"
                    key={ i }
                >
                    <a
                        onClick={ handleClick }
                        href={ item }
                    >
                        { item }
                    </a>
                </TableRow>
            );

            parsedList.push( listItem );
        } );

        // splitting this up to avoid nessie issue re: Table children parsing:
        // https://github.com/sociomantic-tsunami/nessie-ui/issues/483
        return (
            <div style={{textAlign: 'center', width: '100%'}}>
                {
                    ! parsedList.length &&
                        <TableCell >{'Nothing to see here yet'}</TableCell>
                }
                {
                    !!parsedList.length &&
                        <Table
                            className={ styles.table }
                            >
                                { parsedList }
                        </Table>
                }

            </div>
        );
    }
}
