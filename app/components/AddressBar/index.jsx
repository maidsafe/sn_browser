// @flow
import url from 'url';
import React, { Component } from 'react';
import { ipcRenderer } from 'electron';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import appPackage from 'appPackage';

import MdNavigateBefore from 'react-icons/lib/md/navigate-before';
import MdNavigateNext from 'react-icons/lib/md/navigate-next';
import MdRefresh from 'react-icons/lib/md/refresh';
import MdMenu from 'react-icons/lib/md/menu';
import MdStarOutline from 'react-icons/lib/md/star-outline';
import MdStar from 'react-icons/lib/md/star';


import styles from './addressBar.css';


export default class AddressBar extends Component
{
    constructor( props )
    {
        super( props );
        this.handleChange = ::this.handleChange;
        this.handleFocus = ::this.handleFocus;
        this.handleKeyPress = ::this.handleKeyPress;
        this.handleBack = ::this.handleBack;
        this.handleForward = ::this.handleForward;
        this.handleRefresh = ::this.handleRefresh;

        this.state = {
            address : props.address
        };
    }

    static defaultProps =
    {
        address : ''
    }

    componentWillReceiveProps( props )
    {
        if ( props.address !== this.state.address )
        {
            this.setState( { address: props.address } );
        }
    }

    /**
     * Takes input and adds requisite url portions as needed, comparing to package.json defined
     * protocols, or defaulting to http
     * @param  {String} input address bar input
     * @return {String}       full url with protocol and any trailing (eg: http:// / .com)
     */
    makeValidUrl( input )
    {
        const validProtocols = appPackage.build.protocols.schemes || ['http'];

        const parser = document.createElement( 'a' );
        parser.href = input;

        const inputProtocol = parser.protocol;
        const inputHost = parser.host;

        let finalProtocol;
        let finalHost;
        let everythingAfterHost = '';

        if ( inputHost )
        {
            finalHost = inputHost.includes( '.' ) ? inputHost : `${inputHost}.com`;
            everythingAfterHost = input.substring(
                input.indexOf( inputHost ) + inputHost.length,
                input.length );
        }
        else
        {
            finalHost = input;
        }

        if ( validProtocols.includes( inputProtocol ) )
        {
            finalProtocol = inputProtocol;
        }
        else
        {
            finalProtocol = validProtocols[0];
        }

        return `${finalProtocol}://${finalHost}${everythingAfterHost}`;
    }

    handleBack( tabData, event )
    {
        event.stopPropagation();
        ipcRenderer.send( 'goBackActiveTab' );

    }

    handleForward( tabData, event )
    {
        event.stopPropagation();
        ipcRenderer.send( 'goForwardActiveTab' );
    }

    handleRefresh( tabData, event )
    {
        event.stopPropagation();
        ipcRenderer.send( 'refreshActiveTab' );
    }

    handleChange( event )
    {
        this.setState( { address: event.target.value } );
    }

    handleFocus( event )
    {
        this.refs.addressBar.select();
    }

    handleKeyPress( event )
    {
        if ( event.key !== 'Enter' )
        {
            return;
        }

        const input = event.target.value;

        const url = this.makeValidUrl( input );

        this.props.updateAddress( url );
        this.props.updateActiveTab( { url } );
    }

    render()
    {
        const { address } = this.state;

        return (
            <div className={ styles.container } >
                <div className={ styles.leftButtons }>
                    <div className={ styles.button }
                        onClick={ this.handleBack }>
                        <MdNavigateBefore className={ styles.buttonIcon }/>
                    </div>
                    <div className={ styles.button }
                            onClick={ this.handleForward }>
                        <MdNavigateNext className={ styles.buttonIcon }/>
                    </div>
                    <div className={ styles.button } onClick={ this.handleRefresh }>
                        <MdRefresh className={ styles.buttonIcon }/>
                    </div>
                </div>
                <input
                    className={ styles.input }
                    value={ this.state.address }
                    type="text"
                    ref="addressBar"
                    onFocus={ this.handleFocus }
                    onChange={ this.handleChange }
                    onKeyPress={ this.handleKeyPress }
                />
                <div className={ styles.button }>
                    <MdStarOutline className={ styles.buttonIcon }/>
                </div>
                <div className={ styles.rightButtons }>
                    <div className={ styles.button }>
                        <MdMenu className={ styles.buttonIcon }/>
                    </div>
                </div>
            </div>
        );
    }
}
