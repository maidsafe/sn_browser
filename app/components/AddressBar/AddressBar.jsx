// @flow
import React, { Component } from 'react';
import { ipcRenderer, remote } from 'electron';
import PropTypes from 'prop-types';

import { Column, IconButton, Row, InputField } from 'nessie-ui';

import styles from './addressBar.css';

const log = require( 'electron-log' );


export default class AddressBar extends Component
{
    static propTypes =
    {
        isBookmarked   : PropTypes.bool.isRequired,
        addBookmark    : PropTypes.func.isRequired,
        removeBookmark : PropTypes.func.isRequired,
        onBlur         : PropTypes.func.isRequired,
        onFocus        : PropTypes.func.isRequired
    }

    static defaultProps =
    {
        address    : '',
        isFocussed : false
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
        if ( nextProps.address !== this.state.address )
        {
            this.setState( { address: nextProps.address } );
        }
    }

    isInFocussedWindow = ( ) =>
    {
        const BrowserWindow = remote.BrowserWindow;
        const focussedWindowId = BrowserWindow.getFocusedWindow().id;
        const currentWindowId = remote.getCurrentWindow().id;

        return focussedWindowId === currentWindowId;
    }

    handleBookmarking = ( tabData, event ) =>
    {
        const { address, addBookmark, removeBookmark, isBookmarked } = this.props;

        if ( isBookmarked )
        {
            removeBookmark( { url: address } );
        }
        else
        {
            addBookmark( { url: address } );
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
        if ( event.key !== 'Enter' )
        {
            return;
        }

        const input = event.target.value;

        this.props.updateActiveTab( { url: input } );
    }

    render()
    {
        const { address } = this.state;
        const { isFocussed, isBookmarked } = this.props;

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
                            inputRef={ ( input ) =>
                            {
                                this.addressInput = input;

                                if ( this.props.isFocussed &&
                                    this.isInFocussedWindow() && input )
                                {
                                    input.focus();
                                }
                            } }
                            onFocus={ this.handleFocus }
                            onBlur={ this.handleBlur }
                            onChange={ this.handleChange }
                            onKeyPress={ this.handleKeyPress }
                        />
                    </Column>
                    <Column size="content">
                        <Row gutters="S">
                            <Column>
                                <IconButton
                                    iconTheme={ isBookmarked ? 'control' : 'navigation' }
                                    iconType="preview"
                                    iconSize="L"
                                    onClick={ this.handleBookmarking }
                                />
                            </Column>
                        </Row>
                    </Column>
                </Row>
            </div>
        );
    }
}
