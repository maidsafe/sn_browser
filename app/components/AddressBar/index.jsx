// @flow
import url                      from 'url';
import React, { Component }     from 'react';
import PropTypes                from 'prop-types';
import { Link }                 from 'react-router';
import styles                   from './addressBar.css';
import appPackage               from 'appPackage';

export default class AddressBar extends Component {

    constructor( props )
    {
        super( props );
        this.handleChange   = ::this.handleChange;
        this.handleFocus    = ::this.handleFocus;
        this.handleKeyPress = ::this.handleKeyPress;

        this.state = {
            address : props.address
        }
    }

    static defaultProps =
    {
        address : ''
    }

    componentWillReceiveProps( props )
    {
        if( props.address !== this.state.address )
        {
            this.setState( { address: props.address } )
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

        const parser = document.createElement('a');
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

    handleChange( event )
    {

        this.setState({address: event.target.value});
    }

    handleFocus( event )
    {
        this.refs.addressBar.select();
        return;
    }

    handleKeyPress ( event )
    {
        if( event.key !== 'Enter' )
        {
            return;
        }

        const input = event.target.value;

        const url = this.makeValidUrl( input );

        this.props.updateAddress( url );
        this.props.updateActiveTab( { url } );
    }

    render() {

        const { address } = this.state;

        return (
            <div className={styles.container} >
                <input
                className={styles.input}
                value={ this.state.address } type="text" ref="addressBar"
                onFocus={ this.handleFocus }
                onChange={ this.handleChange }
                onKeyPress={ this.handleKeyPress }
                />
            </div>
        );
    }
}
