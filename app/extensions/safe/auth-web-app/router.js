import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { checkAuthorised } from './utils';
import App from './containers/app';
import AppDetails from './containers/app_details';
import Login from './containers/login';
import CreateAccount from './containers/create_account';
import Home from './containers/app_list';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Home} onEnter={checkAuthorised} />
    <Route path="/app_details" component={AppDetails} onEnter={checkAuthorised} />
    <Route path="/login" component={Login} />
    <Route path="/create-account" component={CreateAccount} />
  </Route>
);
