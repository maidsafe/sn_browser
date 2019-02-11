// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as TabActions from '@Actions/tabs_actions';
import * as NotificationActions from '@Actions/notification_actions';
import * as UiActions from '@Actions/ui_actions';
import * as BookmarksActions from '@Actions/bookmarks_actions';
import Browser from '@Components/Browser';
import { getActionsForBrowser } from '@Extensions';

function mapStateToProps( state )
{
    return {
        bookmarks      : state.bookmarks,
        notifications  : state.notifications,
        tabs           : state.tabs,
        ui             : state.ui,
        safeBrowserApp : state.safeBrowserApp
    };
}

function mapDispatchToProps( dispatch )
{
    const extensionActions = getActionsForBrowser();
    const actions = {
        ...BookmarksActions,
        ...NotificationActions,
        ...TabActions,
        ...UiActions,

        ...extensionActions
    };
    return bindActionCreators( actions, dispatch );
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)( Browser );
