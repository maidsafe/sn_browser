// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as NotificationActions from 'actions/notification_actions';
import * as UiActions from 'actions/ui_actions';

// TODO: Enable creation of windows via an api...? Or mvoe this into safe extension. Is that the way?
import * as AuthenticatorActions from 'extensions/safe/actions/authenticator_actions';
import { SAFE } from 'extensions/safe/constants';
import { TextInput } from 'nessie-ui';
import Notifier from 'components/Notifier';


class SAFEInfoWindow extends Component
{
    handleKeyPress = ( event ) =>
    {
        const { login } = this.props;
        if ( event.key !== 'Enter' )
        {
            return;
        }

        const secret = this.secret.value;
        const password = this.password.value;

        login( secret, password );
    }

    render()
    {
        const { safeBrowserApp, clearNotification, notifications } = this.props;
        const notification = notifications[0];

        const loggedIn = safeBrowserApp.appStatus === SAFE.NETWORK_STATE.LOGGED_IN;

        return (
            <div>
                <Notifier
                    { ...notification }
                    clearNotification={ clearNotification }
                />
                {
                    loggedIn &&
                        <h2> Logged in. Refresh your auth page. </h2>
                }
                {
                    !loggedIn &&
                        <div>
                            <TextInput
                                onKeyPress={ this.handleKeyPress }
                                label="secret"
                                inputRef={ ( input ) =>
                                {
                                    this.secret = input;
                                } }
                            />
                            <TextInput
                                onKeyPress={ this.handleKeyPress }
                                label="secret"
                                inputRef={ ( input ) =>
                                {
                                    this.password = input;
                                } }
                            />
                        </div>
                }
            </div>
        );
    }
}

function mapStateToProps( state )
{
    return {
        notifications : state.notifications,
        ui            : state.ui,
        safeBrowserApp     : state.safeBrowserApp,
    };
}

function mapDispatchToProps( dispatch )
{
    const actions =
        {
            ...NotificationActions,
            ...AuthenticatorActions,
            ...UiActions
        };
    return bindActionCreators( actions, dispatch );
}

export default connect( mapStateToProps, mapDispatchToProps )( SAFEInfoWindow );
