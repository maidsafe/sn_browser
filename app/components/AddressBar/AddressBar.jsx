// @flow
import url from 'url';
import React, { Component } from 'react';
import { ipcRenderer } from 'electron';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import appPackage from 'appPackage';
import { removeTrailingSlash } from 'utils/urlHelpers';

import MdNavigateBefore from 'react-icons/lib/md/navigate-before';
import MdNavigateNext from 'react-icons/lib/md/navigate-next';
import MdRefresh from 'react-icons/lib/md/refresh';
import MdMenu from 'react-icons/lib/md/menu';
import MdStarOutline from 'react-icons/lib/md/star-outline';
// import MdStar from 'react-icons/lib/md/star';

import styles from './addressBar.css';

const log = require('electron-log');

/**
 * Takes input and adds requisite url portions as needed, comparing to package.json defined
 * protocols, or defaulting to http
 * @param  {String} input address bar input
 * @return {String}       full url with protocol and any trailing (eg: http:// / .com)
 */
const makeValidUrl = ( input )=>
{
    const validProtocols = appPackage.build.protocols.schemes || ['http'];

    const parser = document.createElement( 'a' );
    parser.href = input;

    const inputProtocol =  parser.protocol.replace( ':', '' );
    let finalProtocol;
    let everythingAfterProtocol = '';

    if ( validProtocols.includes( inputProtocol ) )
    {
        let fullProto = '://';
        let shortProto = ':';

        finalProtocol = inputProtocol;

        let protocolPos;

        if( input.indexOf( fullProto ) > -1 )
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

    const endUrl = `${finalProtocol}://${everythingAfterProtocol}`

    return removeTrailingSlash( endUrl );
}

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
        this.handleFocus = ::this.handleFocus;
        this.handleKeyPress = ::this.handleKeyPress;
        this.handleRefresh = ::this.handleRefresh;

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

    handleRefresh( tabData, event )
    {
        // TODO: if cmd or so clicked, hard.
        event.stopPropagation();
        ipcRenderer.send( 'command', 'view:reload' );
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

        const url = makeValidUrl( input );

        this.props.updateAddress( url );
        this.props.updateActiveTab( { url } );
    }

    render()
    {
        const { address } = this.state;

        return (
            <div className={ `${styles.container} js-address` } >
                <div className={ styles.leftButtons }>
                    <div
                        className={ `${styles.button} js-address__backwards` }
                        onClick={ this.handleBack }
                    >
                        <MdNavigateBefore className={ styles.buttonIcon } />
                    </div>
                    <div
                        className={ `${styles.button} js-address__forwards` }
                        onClick={ this.handleForward }
                    >
                        <MdNavigateNext className={ styles.buttonIcon } />
                    </div>
                    <div className={ `${styles.button} js-address__refresh` } onClick={ this.handleRefresh }>
                        <MdRefresh className={ styles.buttonIcon } />
                    </div>
                </div>
                <input
                    className={ `${styles.input} js-address__input` }
                    value={ this.state.address }
                    type="text"
                    ref="addressBar"
                    onFocus={ this.handleFocus }
                    onChange={ this.handleChange }
                    onKeyPress={ this.handleKeyPress }
                />
                {/* <div className={ `${styles.button} js-address__favourite` }>
                    <MdStarOutline className={ styles.buttonIcon } />
                </div>
                <div className={ styles.rightButtons }>
                    <div className={ `${styles.button} js-address__menu` }>
                        <MdMenu className={ styles.buttonIcon } />
                    </div>
                </div> */}
            </div>
        );
    }
}
