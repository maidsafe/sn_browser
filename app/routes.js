// @flow
import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import BrowserWindow from './containers/BrowserWindow';


export default (
    <Route path="/" component={ App }>
        <IndexRoute component={ BrowserWindow } />
    </Route>
);
