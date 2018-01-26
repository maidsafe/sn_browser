// @flow
import React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/App';
import BrowserWindow from './containers/BrowserWindow';


export default () => (
    <App>
        <Switch>
            <Route path="/" component={ BrowserWindow } />
        </Switch>
    </App>
);
