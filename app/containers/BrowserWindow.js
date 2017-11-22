// @flow
import React, { Component } from 'react';
// import logger from 'logger';
// import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as TabActions from '../actions/tabs_actions';
import * as AddressActions from '../actions/address_actions';
import * as NotificationActions from '../actions/notification_actions';
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
        address : state.address,
        notifications : state.notifications,
        tabs    : state.tabs
    };
}

function mapDispatchToProps( dispatch )
{
    const actions =
        {
            ...AddressActions,
            ...NotificationActions,
            ...TabActions
        };
    return bindActionCreators( actions, dispatch );
}

export default connect( mapStateToProps, mapDispatchToProps )( BrowserWindow );
