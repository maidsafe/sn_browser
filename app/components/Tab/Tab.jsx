// @flow
import { remote, ipcRenderer } from 'electron';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { removeTrailingSlash } from 'utils/urlHelpers';
import path from 'path';
import { parse as parseURL } from 'url';
import styles from './tab.css';

import logger from 'logger';

// OKAY. those refs here are problematic. hmmmm

const { Menu, MenuItem } = remote;

// drawing on itch browser meat: https://github.com/itchio/itch/blob/3231a7f02a13ba2452616528a15f66670a8f088d/appsrc/components/browser-meat.js
const WILL_NAVIGATE_GRACE_PERIOD = 3000;
const SHOW_DEVTOOLS = parseInt( process.env.DEVTOOLS, 10 ) > 1;

export default class Tab extends Component
{
    static propTypes =
    {
        isActiveTab : PropTypes.bool.isRequired,
        url         : PropTypes.string.isRequired,
        index       : PropTypes.number.isRequired,
        // className   : PropTypes.string,
        updateTab   : PropTypes.func.isRequired,
        addTab      : PropTypes.func.isRequired
    }

    static defaultProps =
    {
        isActiveTab : false,
        url         : 'http://nowhere.com',

    }


    constructor( props )
    {
        super( props );

        this.state = {
            browserState : {
                canGoBack       : false,
                canGoForward    : false,
                loading         : true,
                mountedAndReady : false,
                url             : '',
                redirects       : []
            }
        };

        // this.domReady = ::this.domReady;
        this.goBack = ::this.goBack;
        this.goForward = ::this.goForward;
        this.reload = ::this.reload;
        this.stop = ::this.stop;
        this.openDevTools = ::this.openDevTools;
        this.loadURL = ::this.loadURL;
        this.reloadIfActive = ::this.reloadIfActive;
    }

    listenToCommands()
    {
        ipcRenderer.on( 'refreshActiveTab', this.reloadIfActive );
    }

    isDevToolsOpened = () =>
    {
        const { webview } = this;

        if ( webview )
        {
            return webview.isDevToolsOpened();
        }
    }

    reloadIfActive()
    {
        const { isActiveTab } = this.props;

        if ( !isActiveTab )
        {
            return;
        }

        this.reload();
    }

    componentDidMount()
    {
        const { webview } = this;
        let rightClickPosition;

        const partition = 'persist:safe-tab';

        webview.partition = partition;
        webview.src = 'about:blank';

        const menu = Menu.buildFromTemplate( [
            { label: 'Cut', accelerator: 'Command+X', selector: 'cut:' },
            { label: 'Copy', accelerator: 'Command+C', selector: 'copy:' },
            { label: 'Paste', accelerator: 'Command+V', selector: 'paste:' },
            { type: 'separator' },
            { label: 'Select All', accelerator: 'Command+A', selector: 'selectAll:' },
            {
                label : 'Inspect element',
                click : ( e ) =>
                {
                    webview.inspectElement( rightClickPosition.x, rightClickPosition.y );
                }
            }
        ] );


        const callbackSetup = () =>
        {
            webview.addEventListener( 'did-start-loading', ::this.didStartLoading );
            webview.addEventListener( 'did-stop-loading', ::this.didStopLoading );
            webview.addEventListener( 'will-navigate', ::this.willNavigate );
            webview.addEventListener( 'did-navigate', ::this.didNavigate );
            webview.addEventListener( 'did-navigate-in-page', ::this.didNavigateInPage );
            webview.addEventListener( 'did-get-redirect-request', ::this.didGetRedirectRequest );
            webview.addEventListener( 'page-title-updated', ::this.pageTitleUpdated );
            webview.addEventListener( 'page-favicon-updated', ::this.pageFaviconUpdated );
            webview.addEventListener( 'new-window', ::this.newWindow );

            webview.addEventListener( 'contextmenu', ( e ) =>
            {
                e.preventDefault();
                rightClickPosition = { x: e.x, y: e.y };
                menu.popup( remote.getCurrentWindow() );
            }, false );

            this.domReady();

            webview.removeEventListener( 'dom-ready', callbackSetup );
        };
        webview.addEventListener( 'dom-ready', callbackSetup );

        webview.addEventListener( 'dom-ready', () =>
        {
            this.didStopLoading();
        } );

    }

    componentWillReceiveProps( nextProps )
    {
        if ( JSON.stringify( nextProps ) === JSON.stringify( this.props ) )
        {
            return;
        }

        if ( !this.state.browserState.mountedAndReady )
        {
            return;
        }

        if ( nextProps.url )
        {
            const { webview } = this;
            if ( !webview )
            {
                return;
            }

            // we need to strip trailing slash of webview for comparison.
            const strippedWebviewUrl = removeTrailingSlash( webview.src );

            if ( webview.src === '' || webview.src === 'about:blank' ||
                strippedWebviewUrl !== nextProps.url )
            {
                this.loadURL( nextProps.url );
            }
        }
    }


    updateBrowserState( props = {} )
    {
        const { webview } = this;
        if ( !webview )
        {
            return;
        }
        if ( !webview.partition || webview.partition === '' )
        {
            console.warn( `${this.props.index}: webview has empty partition` );
        }

        const browserState = {
            ...this.state.browserState,
            canGoBack    : webview.canGoBack(),
            canGoForward : webview.canGoForward(),
            ...props
        };

        this.setState( { browserState } );
    }

    domReady()
    {
        const { url } = this.props;
        const { webview } = this;

        const webContents = webview.getWebContents();
        if ( !webContents || webContents.isDestroyed() ) return;

        if ( SHOW_DEVTOOLS )
        {
            webContents.openDevTools( { detach: true } );
        }

        this.updateBrowserState( { loading: false, mountedAndReady: true } );

        if ( url && url !== 'about:blank' )
        {
            this.loadURL( url )
                .catch( err => console.log( 'err in loadurl', err ) );
        }
    }

    didStartLoading( )
    {
        const { updateTab, index } = this.props;
        logger.silly('webview started loading');

        this.updateBrowserState( { loading: true } );
    }

    didStopLoading( )
    {
        this.updateBrowserState( { loading: false } );
    }

    pageTitleUpdated( e )
    {
        const title = e.title;
        const { updateTab, index, isActiveTab } = this.props;

        const tabUpdate = {
            title, index
        };

        updateTab( tabUpdate );
    }

    pageFaviconUpdated( e )
    {
        // const {index, tabDataFetched} = this.props
        // tabDataFetched(index, {webFavicon: e.favicons[0]})
    }

    didNavigate( e )
    {
        const { updateTab, index } = this.props;
        const { url } = e;
        const noTrailingSlashUrl = removeTrailingSlash( url );

        // TODO: Actually overwrite history for redirect
        if ( !this.state.browserState.redirects.includes( url ) )
        {
            this.updateBrowserState( { url } );
            updateTab( { index, url } );
        }
    }

    didNavigateInPage( e )
    {
        const { updateTab, index } = this.props;
        const { url } = e;
        const noTrailingSlashUrl = removeTrailingSlash( url );

        // TODO: Actually overwrite history for redirect
        if ( !this.state.browserState.redirects.includes( url ) )
        {
            this.updateBrowserState( { url, redirects: [url] } );
            updateTab( { index, url } );
        }
    }

    didGetRedirectRequest( e )
    {
        const { oldURL, newURL } = e;

        const prev = oldURL;
        const next = newURL;

        if ( prev === this.state.browserState.url )
        {
            this.updateBrowserState( { redirects: [next] } );
        }
    }

    willNavigate( e )
    {
        logger.silly('webview will navigate');
        if ( !this.isFrozen() )
        {
            return;
        }

        const { url } = e;

        if ( this.lastNavigationUrl === url && e.timeStamp - this.lastNavigationTimeStamp < WILL_NAVIGATE_GRACE_PERIOD )
        {
            this.with( ( wv ) =>
            {
                wv.stop();
                wv.loadURL( this.props.url );
            } );
            return;
        }
        this.lastNavigationUrl = url;
        this.lastNavigationTimeStamp = e.timeStamp;

        const index = this.props.index;

        this.props.updateTab( { index, url } );

        if ( this.props.isActiveTab )
        {
            // TODO ensure url structure in reducer, as opposed to here/everywhere
            this.props.updateActiveTab( { url: removeTrailingSlash( url ) } );
        }

        // our own little preventDefault
        // cf. https://github.com/electron/electron/issues/1378
        this.with( ( wv ) =>
        {
            wv.stop();
            wv.loadURL( url );
        } );
    }

    newWindow( e )
    {
        const { addTab } = this.props;
        const { url } = e;
        // navigate('url/' + url)
        const activateTab = e.disposition == 'foreground-tab';

        addTab( { url, isActiveTab: activateTab } );

        this.goForward();
    }

    isFrozen( e )
    {
        const { index } = this.props;
        const frozen = !index;
        // const frozen = staticTabData[index] || !index
        return frozen;
    }

    with( cb, opts = { insist: false } )
    {
        const { webview } = this;
        if ( !webview ) return;

        const webContents = webview.getWebContents();
        if ( !webContents )
        {
            return;
        }

        if ( webContents.isDestroyed() ) return;

        cb( webview, webContents );
    }

    openDevTools()
    {
        this.with( ( wv, wc ) => wc.openDevTools( { detach: true } ) );
    }

    stop()
    {
        this.with( ( wv ) => wv.stop() );
    }

    reload()
    {
        logger.silly('webview reloading');

        this.with( ( wv ) =>
        {
            wv.reload();
        } );
    }

    goBack( e )
    {
        this.with( ( wv ) => wv.goBack() );
    }

    goForward()
    {
        console.warn( 'Electron bug preventing goForward: https://github.com/electron/electron/issues/9999' );
        this.with( ( wv ) => wv.goForward() );
    }

    loadURL = async ( input ) =>
    {
        logger.info('webview loadURL being triggered');
        const url = input;
        let parsedURL = parseURL( url );

        let currentParsedURL  = parseURL( this.state.browserState.url );


        // TODO: Move to should loadURL func?
        if( parsedURL.protocol === currentParsedURL.protocol &&
            parsedURL.host === currentParsedURL.host &&
            parsedURL.path === currentParsedURL.path )
        {
            // dont load cos it's the saaaaame
            return;
        }

        const browserState = { ...this.state.browserState, url };
        this.setState( { browserState } );


        const { webview } = this;

        // prevent looping over attempted url loading
        if ( webview && url !== 'about:blank' )
        {
            // webview.src = url;
            webview.loadURL( url );
        }
        // }
    }

    shouldComponentUpdate( newProps )
    {
        if ( newProps.isActiveTab !== this.props.isActiveTab )
        {
            return true;
        }

        return false;
    }


    render()
    {
        const { index, isActiveTab, tabData, tabPath, controls } = this.props;
        const { browserState } = this.state;

        const preloadFile = remote.getGlobal( 'preloadFile' );
        const injectPath = `file://${preloadFile}` ; // js we'll be chucking in

        let moddedClass = styles.tab;
        if ( isActiveTab )
        {
            moddedClass = styles.activeTab;
        }

        return (
            <div className={ moddedClass } >
                <webview
                    style={{ height: '100%', display: 'flex', flex: '1 1' }}
                    // partition={partition}
                    // plugins={true}
                    preload={injectPath}
                    // src="about:blank"
                    ref={ ( c ) =>
                    {
                        this.webview = c;
                    } }/>
            </div>
        );
    }

}
