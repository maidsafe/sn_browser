import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import { Provider } from 'react-redux';
import { logger } from '$Logger';

import { configureStore } from './store/configureStore';
import { BrowserWindow } from './containers/BrowserWindow';
import { App } from './containers/App';
import './app.global.css';

logger.info( 'Starting render process' );

window.addEventListener( 'error', function( error ) {
    console.error( 'error in UI:', error );
    logger.error(
        'errorInUI',
        JSON.stringify( error, [
            'message',
            'arguments',
            'type',
            'name',
            'file',
            'line'
        ] )
    );
} );

const store = configureStore();

// for execution via BrowserWindow later
window.peruseStore = store;

// if ( window.perusePendingNavigation && window.perusePendingNavigation.length !== 0 ) {
//     store.dispatch( push( window.perusePendingNavigation ) );
// }

render(
    <AppContainer>
        <Provider store={store}>
            <App>
                <BrowserWindow />
            </App>
        </Provider>
    </AppContainer>,
    document.getElementById( 'root' )
);

if ( module.hot ) {
    module.hot.accept( './containers/App', () => {
    // eslint-disable-next-line global-require
        const NextRoot = require( './containers/App' ).default;
        render(
            <AppContainer>
                <NextRoot store={store} />
            </AppContainer>,
            document.getElementById( 'root' )
        );
    } );
}
