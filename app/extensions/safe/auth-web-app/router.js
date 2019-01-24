import React from 'react';
import { Route, Switch } from 'react-router';
import App from './containers/app';
import AppDetails from './containers/app_details';
import Login from './containers/login';
import CreateAccount from './containers/create_account';
import Home from './containers/app_list';

export default (

    <App>
        <Switch>
            <Route exact path="/" component={ Home } />
            <Route path="/app_details" component={ AppDetails } />
            <Route path="/login" component={ Login } />
            <Route path="/create-account" component={ CreateAccount } />
        </Switch>
    </App>
);
