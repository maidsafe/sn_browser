// @flow
import React, { Component } from 'react';
import { remote } from 'electron';
import PropTypes from 'prop-types';
// import { Column, Grid } from 'nessie-ui';

import logger from 'logger';

import extendComponent from 'utils/extendComponent';
import { wrapAddressBarInput } from 'extensions/components';

import { Input } from 'antd';
import 'antd/lib/input/style'

/**
 * Left hand side buttons for the Address Bar
 * @extends Component
 */
class AddressBarInput extends Component
{
    static propTypes =
    {
        address         : PropTypes.string,
        isSelected      : PropTypes.bool,
        windowId        : PropTypes.number.isRequired,
        onBlur          : PropTypes.func.isRequired,
        onSelect        : PropTypes.func.isRequired,
        onFocus         : PropTypes.func.isRequired,
        updateActiveTab : PropTypes.func.isRequired
    }
    static defaultProps =
    {
        address    : '',
        isSelected : false,
        editingUrl : false
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


    componentWillReceiveProps( nextProps )
    {
        if ( nextProps.address !== this.props.address && nextProps.address !== this.state.address )
        {
            this.setState( { address: nextProps.address, editingUrl: false } );
        }

        if ( nextProps.isSelected && !this.props.isSelected &&
                !this.state.editingUrl && this.addressInput )
        {
            this.addressInput.select();
        }
    }


    isInFocussedWindow = ( ) =>
    {
        const BrowserWindow = remote.BrowserWindow;
        const focusedWindow = BrowserWindow.getFocusedWindow();
        if ( !focusedWindow )
        {
            return false;
        }

        const focussedWindowId = BrowserWindow.getFocusedWindow().id;
        const currentWindowId = remote.getCurrentWindow().id;

        return focussedWindowId === currentWindowId;
    }


    handleChange( event )
    {
        const { onSelect } = this.props;

        logger.info('CHANGE OF THE INPUTTTT', this.state )
        this.setState( { editingUrl: true, address: event.target.value } );
        logger.info('CHANGE OF THE INPUTTTT', this.state )

        if ( onSelect )
        {
            onSelect();
        }
    }

    handleFocus = ( event ) =>
    {
        const { onFocus } = this.props;

        onFocus();
        event.target.select();
    }

    handleBlur = ( ) =>
    {
        const { onBlur } = this.props;
        onBlur();
    }

    handleKeyPress( event )
    {
        console.log('KEYPRESSSS', event.key)
        const { windowId } = this.props;
        if ( event.key !== 'Enter' )
        {
            return;
        }

        const input = event.target.value;

        this.props.updateActiveTab( { url: input, windowId } );
    }

    handleClick = ( ) =>
    {
        const { onSelect, isSelected } = this.props;

        if ( isSelected )
        {
            this.setState( { editingUrl: true } );
            onSelect();
        }
    }

    render()
    {
        const { isSelected, addonBefore } = this.props;
        const { address } = this.state;

        return (
            <Input
                // className={ 'js-address__input' }
                addonBefore={addonBefore}
                size={'large'}
                value={ address }
                type="text"
                ref={ ( input ) =>
                {
                    this.addressInput = input;

                    if ( isSelected && !this.state.editingUrl &&
                            this.isInFocussedWindow() && input )
                    {
                        input.select();
                    }
                } }
                onFocus={ this.handleFocus }
                onBlur={ this.handleBlur }
                onChange={ this.handleChange }
                onKeyPress={ this.handleKeyPress }
            />
        );
    }
}

export default extendComponent( AddressBarInput, wrapAddressBarInput );
