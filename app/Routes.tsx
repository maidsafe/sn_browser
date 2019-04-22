import React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes';
import { App } from './containers/App';
import { BrowserWindow } from './containers/BrowserWindow';

export const Routes = () => (
    <App>
        <Switch>
            <Route path={routes.HOME} component={BrowserWindow} />
        </Switch>
    </App>
);
