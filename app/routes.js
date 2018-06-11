// @flow
import React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/App';
import BrowserWindow from './containers/BrowserWindow';
// import SAFEInfoWindow from './containers/SAFEInfoWindow';

// default route must come last
export default () => (
    <App>
        <Switch>
            {/* <Route path="/safeInfoWindow" component={ SAFEInfoWindow } /> */}
            <Route path="/" component={ BrowserWindow } />
        </Switch>
    </App>
);
