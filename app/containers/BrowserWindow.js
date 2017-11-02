// @flow
import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as TabActions from '../actions/tabs_actions';
import * as AddressActions from '../reducers/address';
import Browser from '../components/Browser';

class BrowserWindow extends Component
{
    render()
{
        return (
            <Browser { ...this.props } />
        );
    }
}

function mapStateToProps( state )
{
    return {
        tabs    : state.tabs,
        address : state.address
    };
}

function mapDispatchToProps( dispatch )
{
    const actions =
        {
            ...AddressActions,
            ...TabActions
        };
    return bindActionCreators( actions, dispatch );
}

export default connect( mapStateToProps, mapDispatchToProps )( BrowserWindow );
