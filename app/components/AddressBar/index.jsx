// @flow
import React, { Component }     from 'react';
import PropTypes                from 'prop-types';
import { Link }                 from 'react-router';
import styles                   from './addressBar.css';

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

    handleChange( event )
    {
        this.setState({address: event.target.value});
    }

    handleFocus( event )
    {
        this.refs.addressBar.select()
        console.log( "onFocus of addressbar", this.refs.addressBar );
        return;
    }

    handleKeyPress ( event )
    {
        console.log( 'action check in on Keypress in address bar' );
        if( event.key !== 'Enter' )
        {
            return;
        }

        this.props.updateAddress( event.target.value );
        this.props.updateActiveTab( { url: event.target.value } );
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
