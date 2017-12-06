// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { remote, ipcRenderer } from 'electron';
import { removeTrailingSlash } from 'utils/urlHelpers';
import path from 'path';
import { parse as parseURL } from 'url';
import styles from './tab.css';

const log = require( 'electron-log' );

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
        const { webviewShell } = this.refs;
        const { index } = this.props;
        const preloadFile = remote.getGlobal( 'preloadFile' );

        const injectPath = `file://${preloadFile}` ; // js we'll be chucking in

        let rightClickPosition;

        // cf. https://github.com/electron/electron/issues/6046
        webviewShell.innerHTML = '<webview style="height: 100%; display: flex; flex: 1 1;"/>';
        const wv = webviewShell.querySelector( 'webview' );
        this.webview = wv;

        const { meId } = this.props;

        // TODO: Setup up render constants
        const partition = 'persist:safe-tab';

        wv.partition = partition;
        // wv.useragent = useragent
        wv.plugins = true;
        wv.preload = injectPath
        //

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
                    wv.inspectElement( rightClickPosition.x, rightClickPosition.y );
                }
            }
        ] );


        const callbackSetup = () =>
        {
            wv.addEventListener( 'did-start-loading', ::this.didStartLoading );
            wv.addEventListener( 'did-stop-loading', ::this.didStopLoading );
            wv.addEventListener( 'will-navigate', ::this.willNavigate );
            wv.addEventListener( 'did-navigate', ::this.didNavigate );
            wv.addEventListener( 'did-navigate-in-page', ::this.didNavigateInPage );
            wv.addEventListener( 'did-get-redirect-request', ::this.didGetRedirectRequest );
            wv.addEventListener( 'page-title-updated', ::this.pageTitleUpdated );
            wv.addEventListener( 'page-favicon-updated', ::this.pageFaviconUpdated );
            wv.addEventListener( 'new-window', ::this.newWindow );

            wv.addEventListener( 'contextmenu', ( e ) =>
            {
                e.preventDefault();
                rightClickPosition = { x: e.x, y: e.y };
                menu.popup( remote.getCurrentWindow() );
            }, false );

            this.domReady();

            wv.removeEventListener( 'dom-ready', callbackSetup );
        };
        wv.addEventListener( 'dom-ready', callbackSetup );

        wv.addEventListener( 'dom-ready', () =>
        {
            // wv.executeJavaScript(`window.__itchInit && window.__itchInit(${JSON.stringify(index)})`)
            this.didStopLoading();
        } );

        wv.src = 'about:blank';
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

            if ( webview.src === '' || webview.src === 'about:blank' ||
            webview.src !== nextProps.url )
            {
                // we didn't have a proper url but now do
                this.loadURL( nextProps.url );
            }
        }
    }


    //
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
        const { url, updateTab, index } = this.props;
        const { webview } = this;

        const webContents = webview.getWebContents();
        if ( !webContents || webContents.isDestroyed() ) return;

        if ( SHOW_DEVTOOLS )
        {
            webContents.openDevTools( { detach: true } );
        }

        this.updateBrowserState( { loading: false, mountedAndReady: true } );

        const webContentsId = webview.getWebContents().id;
        // lets add the webContents id for easy manipulation
        updateTab( { index, webContentsId } );

        // if (currentSession !== webContents.session) {
        //     this.setupItchInternal(webContents.session)
        // }

        if ( url && url !== 'about:blank' )
        {
            this.loadURL( url )
                .catch( err => console.log( 'err in loadurl', err ) );
        }
    }

    didStartLoading( )
    {
        const { updateTab, index } = this.props;

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
        // const { navigate, addTab } = this.props;
        // const { url } = e;
        // navigate('url/' + url)
        // addTab( { url, isActiveTab: true } );

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
        const { isActiveTab, tabData, tabPath, controls } = this.props;
        const { browserState } = this.state;

        let moddedClass = styles.tab;
        if ( isActiveTab )
        {
            moddedClass = styles.activeTab;
        }

        const context = '';

        return <div className={ moddedClass } ref="webviewShell" />;
    }
}
