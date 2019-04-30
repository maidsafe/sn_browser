import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Root } from './containers/Root';
import { configureStore } from './store/configureStore';
import './app.global.css';

import { logger } from '$Logger';

const log = require( 'electron-log' );

log.info( 'Starting render process' );

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

if ( window.perusePendingNavigation && window.perusePendingNavigation.length ) {
    store.dispatch( push( window.perusePendingNavigation ) );
}

render(
    <AppContainer>
        <Root store={store} />
    </AppContainer>,
    document.getElementById( 'root' )
);

if ( module.hot ) {
    module.hot.accept( './containers/Root', () => {
    // eslint-disable-next-line global-require
        const NextRoot = require( './containers/Root' ).default;
        render(
            <AppContainer>
                <NextRoot store={store} />
            </AppContainer>,
            document.getElementById( 'root' )
        );
    } );
}
