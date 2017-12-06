// @flow
import url from 'url';
import React, { Component } from 'react';
import { ipcRenderer } from 'electron';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import appPackage from 'appPackage';
import { removeTrailingSlash } from 'utils/urlHelpers';

import { Column, IconButton, Row, InputField } from 'nessie-ui';

import styles from './addressBar.css';

const log = require( 'electron-log' );

/**
 * Takes input and adds requisite url portions as needed, comparing to package.json defined
 * protocols, or defaulting to http
 * @param  {String} input address bar input
 * @return {String}       full url with protocol and any trailing (eg: http:// / .com)
 */
const makeValidUrl = ( input ) =>
{
    const validProtocols = appPackage.build.protocols.schemes || ['http'];

    const parser = document.createElement( 'a' );
    parser.href = input;

    const inputProtocol = parser.protocol.replace( ':', '' );
    let finalProtocol;
    let everythingAfterProtocol = '';

    if ( validProtocols.includes( inputProtocol ) )
    {
        const fullProto = '://';
        const shortProto = ':';

        finalProtocol = inputProtocol;

        let protocolPos;

        if ( input.indexOf( fullProto ) > -1 )
        {
            protocolPos = input.indexOf( fullProto ) + 3;
        }
        else
        {
            protocolPos = input.indexOf( shortProto );
        }

        everythingAfterProtocol = input.substring(
            protocolPos,
            input.length );
    }
    else
    {
        finalProtocol = validProtocols[0];
        everythingAfterProtocol = input;
    }

    const endUrl = `${finalProtocol}://${everythingAfterProtocol}`;

    return removeTrailingSlash( endUrl );
};

export default class AddressBar extends Component
{
    static defaultProps =
    {
        address : ''
    }

    constructor( props )
    {
        super( props );
        this.handleChange = ::this.handleChange;
        this.handleKeyPress = ::this.handleKeyPress;

        this.state = {
            address : props.address
        };
    }


    componentWillReceiveProps( props )
    {
        if ( props.address !== this.state.address )
        {
            this.setState( { address: props.address } );
        }
    }

    handleBack = ( tabData, event ) =>
    {
        const { activeTabBackwards } = this.props;
        activeTabBackwards();
    }

    handleForward = ( tabData, event ) =>
    {
        const { activeTabForwards } = this.props;
        activeTabForwards();
    }

    handleRefresh = ( event ) =>
    {
        // TODO: if cmd or so clicked, hard.
        event.stopPropagation();
        ipcRenderer.send( 'command', 'view:reload' );
    }

    handleChange( event )
    {
        this.setState( { address: event.target.value } );
    }

    handleFocus = ( event ) =>
    {
        event.target.select();
    }

    handleKeyPress( event )
    {
        if ( event.key !== 'Enter' )
        {
            return;
        }

        const input = event.target.value;

        const url = makeValidUrl( input );

        this.props.updateActiveTab( { url } );
    }

    render()
    {
        const { address } = this.state;

        return (
            <div className={ `${styles.container} js-address` } >
                <Row align="left" verticalAlign="middle" gutters="S">
                    <Column size="content">
                        <Row gutters="S">
                            <Column>
                                <IconButton
                                    iconTheme="light"
                                    iconType="left"
                                    iconSize="L"
                                    onClick={ this.handleBack }
                                />
                            </Column>
                            <Column>
                                <IconButton
                                    iconTheme="light"
                                    iconSize="L"
                                    iconType="right"
                                    onClick={ this.handleForward }
                                />
                            </Column>
                            <Column>
                                <IconButton
                                    iconTheme="light"
                                    iconSize="L"
                                    iconType="reset"
                                    onClick={ this.handleRefresh }
                                />
                            </Column>
                        </Row>
                    </Column>
                    <Column className={ styles.addressBarColumn }>
                        <InputField
                            className={ 'js-address__input' }
                            value={ this.state.address }
                            type="text"
                            ref={ ( c ) =>
                            {
                                this.addressBar = c;
                            } }
                            onFocus={ this.handleFocus }
                            onChange={ this.handleChange }
                            onKeyPress={ this.handleKeyPress }
                        />
                    </Column>
                </Row>
            </div>
        );
    }
}
