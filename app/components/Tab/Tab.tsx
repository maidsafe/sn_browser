import { remote, WebviewTag } from 'electron';
import React, { Component } from 'react';
import ReactDOMServer from 'react-dom/server';
import _ from 'lodash';
import stdUrl, { parse as parseURL } from 'url';

import styles from './tab.css';

import {
    addTrailingSlashIfNeeded,
    removeTrailingSlash,
    urlHasChanged
} from '$Utils/urlHelpers';
import { Error } from '$Components/PerusePages/Error';
import { logger } from '$Logger';

// drawing on itch browser meat: https://github.com/itchio/itch/blob/3231a7f02a13ba2452616528a15f66670a8f088d/appsrc/components/browser-meat.js
const WILL_NAVIGATE_GRACE_PERIOD = 3000;
const SHOW_DEVTOOLS = parseInt( process.env.DEVTOOLS, 10 ) > 1;

interface TabProps {
    addNotification: ( ...args: Array<any> ) => any;
    webId: object;
    url: string;
    isActiveTab: boolean;
    closeTab: ( ...args: Array<any> ) => any;
    updateTabUrl: ( ...args: Array<any> ) => any;
    updateTabWebId: ( ...args: Array<any> ) => any;
    updateTabWebContentsId: ( ...args: Array<any> ) => any;
    toggleDevTools: ( ...args: Array<any> ) => any;
    tabShouldReload: ( ...args: Array<any> ) => any;
    updateTabTitle: ( ...args: Array<any> ) => any;
    updateTabFavicon: ( ...args: Array<any> ) => any;
    tabLoad: ( ...args: Array<any> ) => any;
    addTabNext: ( ...args: Array<any> ) => any;
    addTabEnd: ( ...args: Array<any> ) => any;
    setActiveTab: ( ...args: Array<any> ) => any;
    key?: string;
    tabId?: string;
    windowId: number;
    safeExperimentsEnabled: boolean;
    focusWebview: ( ...args: Array<any> ) => any;
    shouldFocusWebview: boolean;
    tabBackwards: ( ...args: Array<any> ) => any;
    shouldReload: boolean;
    shouldToggleDevTools: boolean;
}

interface TabState {
    hasError: boolean;
    theError: Error;
    browserState:
    | any
    | {
        canGoBack: boolean;
        canGoForward: boolean;
        loading: boolean;
        mountedAndReady: boolean;
        url: string;
        redirects: Array<undefined>;
    };
}

export class Tab extends Component<TabProps, TabState> {
    debouncedWebIdUpdateFunc: Function;

    webview: WebviewTag;

    lastNavigationUrl: string;

    lastNavigationTimeStamp: number;

    static defaultProps = {
        isActiveTab: false,
        url: 'http://start.com'
    };

    static getDerivedStateFromError( error ) {
    // Update state so the next render will show the fallback UI.
        return { hasError: true, theError: error };
    }

    constructor( properties ) {
        super( properties );

        this.state = {
            browserState: {
                canGoBack: false,
                canGoForward: false,
                loading: true,
                mountedAndReady: false,
                url: '',
                redirects: []
            }
        };
        // this.domReady = this.domReady.bind(this);
        this.goBack = this.goBack.bind( this );
        this.goForward = this.goForward.bind( this );
        this.reload = this.reload.bind( this );
        this.stop = this.stop.bind( this );
        this.openDevTools = this.openDevTools.bind( this );
        this.loadURL = this.loadURL.bind( this );
        this.debouncedWebIdUpdateFunc = _.debounce( this.updateTheIdInWebview, 300 );
    }

    isDevToolsOpened = () => {
        const { webview } = this;
        if ( webview ) {
            return webview.isDevToolsOpened();
        }
        return false;
    };

    buildMenu = ( webview ) => {
        if ( !webview.getWebContents ) return; // 'not now, as you're running jest;
        const { windowId, toggleDevTools, tabId, addTabNext } = this.props;
        // require here to avoid jest/electron remote issues
        // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
        const contextMenu = require( 'electron-context-menu' );

        contextMenu( {
            window: webview,
            append: ( _event, parameters ) => [
                {
                    label: 'Inspect element',
                    accelerator:
            process.platform === 'darwin'
                ? 'Alt+CommandOrControl+I'
                : 'Control+Shift+I',
                    click() {
                        toggleDevTools( { tabId, shouldToggleDevTools: true } );
                    }
                },
                { type: 'separator' },
                {
                    label: 'Reload',
                    accelerator:
            process.platform === 'darwin' ? 'CommandOrControl+R' : 'F5',
                    click() {
                        webview.reload();
                    }
                },
                {
                    label: 'Hard Reload',
                    // accelerator: 'CommandOrControl+Shift+R',
                    click() {
                        webview.reloadIgnoringCache();
                    }
                },
                {
                    label: 'Forward',
                    accelerator: 'CommandOrControl + ]',
                    click() {
                        webview.goForward();
                    }
                },
                {
                    label: 'Backward',
                    accelerator: 'CommandOrControl + [',
                    click() {
                        webview.goBack();
                    }
                },
                // { type': seperator' },
                {
                    label: 'Select All',
                    selector: 'selectAll:'
                },
                {
                    type: 'separator',
                    visible: !!( parameters.linkURL && parameters.linkURL.length > 0 )
                },
                {
                    label: 'Open Link in New Tab',
                    visible: parameters.linkURL && parameters.linkURL.length > 0,
                    click() {
                        addTabNext( {
                            url: parameters.linkURL,
                            windowId,
                            tabId: Math.random().toString( 36 )
                        } );
                    }
                }
            ],
            saveImage: false,
            saveImageAs: false,
            showInspectElement: false,
            showCopyImageAddress: true
        } );
    };

    // eslint-disable-next-line class-methods-use-this
    webviewFocussed() {
        logger.info( 'Webview focussed: Triggering click event on browser window' );
        const fakeClick = new MouseEvent( 'click', {
            view: window,
            bubbles: true,
            cancelable: true
        } );
        window.dispatchEvent( fakeClick );
    }

    componentDidMount() {
        const { webview } = this;
        const { tabId, updateTabWebContentsId } = this.props;
        const callbackSetup = () => {
            if ( !webview ) {
                logger.info(
                    'No webview found so not doing: callback setup on window webview'
                );
                return;
            }

            // We set the webContents here, and add it to the user agent
            // to be able to modify _all_ requests from a domain to pull
            // the correct version of site...
            const webContents = webview.getWebContents();
            const userAgent = webContents.getUserAgent();

            const webContentsId = webContents.id;

            webContents.setUserAgent( `${userAgent}; webContentsId:${webContentsId}` );
            updateTabWebContentsId( { tabId, webContentsId } );

            webview.addEventListener(
                'did-start-loading',
                this.didStartLoading.bind( this )
            );
            webview.addEventListener(
                'did-stop-loading',
                this.didStopLoading.bind( this )
            );
            webview.addEventListener(
                'did-finish-load',
                this.didFinishLoading.bind( this )
            );
            webview.addEventListener( 'crashed', this.onCrash.bind( this ) );
            webview.addEventListener( 'gpu-crashed', this.onGpuCrash.bind( this ) );
            webview.addEventListener( 'will-navigate', this.willNavigate.bind( this ) );
            webview.addEventListener( 'did-navigate', this.didNavigate.bind( this ) );
            webview.addEventListener(
                'did-navigate-in-page',
                this.didNavigateInPage.bind( this )
            );
            webview.addEventListener(
                'did-get-redirect-request',
                this.didGetRedirectRequest.bind( this )
            );
            webview.addEventListener(
                'page-title-updated',
                this.pageTitleUpdated.bind( this )
            );
            webview.addEventListener(
                'page-favicon-updated',
                this.pageFaviconUpdated.bind( this )
            );
            webview.addEventListener( 'new-window', this.newWindow.bind( this ) );
            webview.addEventListener( 'did-fail-load', this.didFailLoad.bind( this ) );
            webview.addEventListener(
                'update-target-url',
                this.updateTargetUrl.bind( this )
            );
            webview.addEventListener( 'focus', this.webviewFocussed.bind( this ) );
            this.domReady();
            webview.removeEventListener( 'dom-ready', callbackSetup );
        };
        this.buildMenu( webview );
        webview.src = 'about:blank';
        webview.addEventListener( 'dom-ready', callbackSetup );
        webview.addEventListener( 'dom-ready', () => {
            this.didStopLoading();
        } );
    }

    componentDidUpdate( previousProperties ) {
        if ( JSON.stringify( previousProperties ) === JSON.stringify( this.props ) )
            return;
        if ( !this.state.browserState.mountedAndReady ) return;
        const {
            focusWebview,
            isActiveTab,
            url,
            tabShouldReload,
            toggleDevTools,
            tabId,
            shouldToggleDevTools,
            shouldReload,
            webId
        } = this.props;
        const { webview } = this;
        logger.info( 'Tab: did receive updated props' );

        // focus webview
        if ( this.props.shouldFocusWebview && isActiveTab ) {
            this.with( ( theWebview: WebviewTag, webContents ) => {
                theWebview.focus();
                webContents.focus();
            } );
            focusWebview( { tabId, shouldFocus: false } );
        }

        // if activeTab and not prefocussed webview, focus
        if (
            !this.props.shouldFocusWebview &&
      !previousProperties.shouldFocusWebview &&
      this.props.isActiveTab
        ) {
            focusWebview( { tabId, shouldFocus: true } );
        }

        // update webId if needed
        const currentId = previousProperties.webId || {};
        const nextId = webId || {};
        if ( nextId['@id'] !== currentId['@id'] ) {
            if ( !webview ) return;
            logger.info( 'New WebID set for ', this.props.url );
            this.setCurrentWebId( nextId );
        }

        // update url in tab if new
        if ( previousProperties.url && previousProperties.url !== url ) {
            console.log( 'seeing', previousProperties.url, url );
            if ( !webview ) return;
            const webviewSource = parseURL( webview.src );
            if (
                webviewSource.href === '' ||
        `${webviewSource.protocol}${webviewSource.hostname}` ===
          'about:blank' ||
        urlHasChanged( webview.src, url )
            ) {
                this.loadURL( url );
            }
        }

        // reload if needed
        if ( shouldReload && !previousProperties.shouldReload ) {
            logger.verbose( 'Should reload URL: ', url );
            this.reload();
            const tabUpdate = {
                tabId,
                shouldReload: false
            };
            tabShouldReload( tabUpdate );
        }

        // toggle devtools
        if ( shouldToggleDevTools && !previousProperties.shouldToggleDevTools ) {
            if ( this.isDevToolsOpened() ) {
                this.closeDevTools();
            } else {
                this.openDevTools();
            }

            const tabUpdate = {
                tabId,
                shouldToggleDevTools: false
            };
            toggleDevTools( tabUpdate );
        }
    }

    updateBrowserState( properties = {} ) {
        const { webview } = this;
        if ( !webview ) {
            return;
        }
        if ( !webview.partition || webview.partition === '' ) {
            logger.warn( `${this.props.tabId}: webview has empty partition` );
        }

        const currentState = this.state.browserState;

        const browserState = {
            ...currentState,
            canGoBack: webview.canGoBack(),
            canGoForward: webview.canGoForward(),
            ...properties
        };
        this.setState( { browserState } );
    }

    domReady() {
        const { url } = this.props;
        const { webview } = this;
        const webContents = webview.getWebContents();
        if ( !webContents || webContents.isDestroyed() ) return;
        if ( SHOW_DEVTOOLS ) {
            webContents.openDevTools( { mode: 'detach' } );
        }
        this.updateBrowserState( { loading: false, mountedAndReady: true } );
        if ( url && url !== 'about:blank' ) {
            this.loadURL( url ).catch( ( error ) => logger.error( 'err in loadurl', error ) );
            this.setCurrentWebId( null );
            this.addWindowIdToTab();
        }
    }

    onCrash = ( event ) => {
        logger.error( 'The webview crashed', event );
    };

    onGpuCrash = ( event ) => {
        logger.error( 'The webview GPU crashed', event );
    };

    didStartLoading() {
        logger.info( 'webview started loading' );
        const { tabLoad, tabId } = this.props;
        const tabUpdate = {
            tabId,
            isLoading: true
        };
        tabLoad( tabUpdate );
        this.updateBrowserState( { loading: true } );
        window.addEventListener( 'focus', () => {
            this.with( ( webview, webContents ) => {
                webContents.focus();
            } );
        } );
    }

    didFailLoad( error ) {
        const {
            url,
            tabId,
            addTabEnd,
            closeTab,
            addNotification,
            tabBackwards,
            windowId
        } = this.props;
        const { webview } = this;
        const urlObject = stdUrl.parse( url );
        const errorUrl = error.validatedURL;

        logger.info( 'didfail load', error );
        const renderError = ( header, subHeader? ) => {
            const errorAsHtml = ReactDOMServer.renderToStaticMarkup(
                <Error error={{ header, subHeader }} />
            );
            webview.executeJavaScript( `
        try
        {
          const body = document.querySelector('body');
          body.innerHTML = '${errorAsHtml}';
        }
        catch ( err )
        {
          console.error(err);
        }
      ` );
        };
        if (
            urlObject.hostname === '127.0.0.1' ||
      urlObject.hostname === 'localhost'
        ) {
            try {
                renderError( 'Page Load Failed' );
            } catch ( scriptError ) {
                logger.error( scriptError );
            }
            return;
        }
        if ( error && error.errorDescription === 'ERR_INVALID_URL' ) {
            try {
                renderError( `Invalid URL: ${url}` );
            } catch ( scriptError ) {
                logger.error( scriptError );
            }
            return;
        }
        if ( error && error.errorDescription === 'ERR_BLOCKED_BY_CLIENT' ) {
            const notification = {
                title: 'Blocked URL',
                body: errorUrl
            };

            addNotification( notification );

            // check its the same link incase of double click
            if ( this.state.browserState.canGoBack && !urlHasChanged( errorUrl, url ) ) {
                const timeStamp = new Date().getTime();
                tabBackwards( { tabId, windowId, timeStamp } );
            } else if ( !this.state.browserState.canGoBack ) {
                closeTab( { tabId, windowId } );
                // add a fresh tab (should be only if no more tabs present)
                const newTabId = Math.random().toString( 36 );
                addTabEnd( { tabId: newTabId, url: 'about:blank', windowId } );
            }
        }
    }

    didStopLoading() {
        logger.info( 'Tab did stop loading' );
        const { tabLoad, tabId } = this.props;
        const tabUpdate = {
            tabId,
            isLoading: false
        };
        this.updateBrowserState( { loading: false } );
        tabLoad( tabUpdate );
        this.addWindowIdToTab();
        this.setCurrentWebId( null );
    }

    didFinishLoading() {
        const { tabLoad, tabId, url } = this.props;
        logger.info( 'Tab did finish loading' );
        const tabUpdate = {
            tabId,
            isLoading: false
        };
        if ( url === 'about:blank' ) {
            tabUpdate.title = '';
        }
        this.updateBrowserState( { loading: false } );
        tabLoad( tabUpdate );
        this.addWindowIdToTab();
        this.setCurrentWebId( null );
    }

    // eslint-disable-next-line class-methods-use-this
    updateTargetUrl( url ) {
        const linkRevealer = document.getElementById( 'link_revealer' );
        if ( url.url ) {
            linkRevealer.setAttribute( 'class', 'reveal_link' );
            linkRevealer.innerText = url.url;
        } else {
            linkRevealer.setAttribute( 'class', 'no_display' );
            linkRevealer.innerText = '';
        }
    }

    pageTitleUpdated( event ) {
        logger.info( 'Webview: page title updated' );
        const { title } = event;
        const { updateTabTitle, tabId } = this.props;
        const tabUpdate = {
            title,
            tabId
        };
        updateTabTitle( tabUpdate );
    }

    pageFaviconUpdated( event ) {
        logger.info( 'Webview: page favicon updated: ', event );
        const { updateTabFavicon, tabId } = this.props;
        const tabUpdate = {
            tabId,
            favicon: event.favicons[0]
        };
        updateTabFavicon( tabUpdate );
    }

    didNavigate( event ) {
        const { updateTabUrl, tabId } = this.props;
        const { url } = event;
        logger.info( 'webview did navigate' );
        // TODO: Actually overwrite history for redirect
        if ( !this.state.browserState.redirects.includes( url ) ) {
            this.updateBrowserState( { url, redirects: [url] } );
            const timeStamp = new Date().getTime();
            updateTabUrl( { tabId, url, timeStamp } );
            this.addWindowIdToTab();
            this.setCurrentWebId( null );
        }
    }

    didNavigateInPage( event ) {
        const { updateTabUrl, tabId } = this.props;
        const { url } = event;
        logger.info(
            'Webview: did navigate in page',
            url,
            this.state.browserState.url
        );
        // TODO: Actually overwrite history for redirect
        if ( !this.state.browserState.redirects.includes( url ) ) {
            if ( urlHasChanged( url, this.state.browserState.url ) ) {
                this.updateBrowserState( { url, redirects: [url] } );
                const timeStamp = new Date().getTime();
                updateTabUrl( { tabId, url, timeStamp } );
                this.addWindowIdToTab();
                this.setCurrentWebId( null );
            }
        }
    }

    didGetRedirectRequest( event ) {
        const { oldURL, newURL } = event;
        const previous = oldURL;
        const next = newURL;
        logger.info( 'Webview: did get redirect request' );
        if ( previous === this.state.browserState.url ) {
            this.updateBrowserState( { redirects: [next] } );
        }
    }

    willNavigate( event ) {
        logger.info( 'webview will navigate', event );
        if ( this.isFrozen() ) {
            logger.verbose( 'Webview is frozen.' );
            return;
        }
        const { url } = event;
        const { webview } = this;
        const { windowId } = this.props;
        if (
            this.lastNavigationUrl === url &&
      event.timeStamp - this.lastNavigationTimeStamp <
        WILL_NAVIGATE_GRACE_PERIOD
        ) {
            this.with( () => {
                webview.stop();
                this.loadURL( url );
            } );
            return;
        }
        this.lastNavigationUrl = url;
        this.lastNavigationTimeStamp = event.timeStamp;
        const { tabId } = this.props;
        const timeStamp = new Date().getTime();
        this.props.updateTabUrl( { tabId, url, timeStamp } );
        if ( this.props.isActiveTab ) {
            this.props.updateTabUrl( { tabId, url, timeStamp } );
        }
    }

    addWindowIdToTab = () => {
        const { windowId } = this.props;
        const { webview } = this;

        const setWindowId = `
              window.currentWindowId = ${windowId};
              `;
        webview.executeJavaScript( setWindowId );
    };

    // TODO Move this functinoality to extensions
    updateTheIdInWebview = ( newWebId ) => {
        const { tabId, webId } = this.props;
        const { webview } = this;
        const theWebId = newWebId || webId;
        logger.info( 'Setting currentWebid in tab' );
        // if ( !webview || !theWebId ) return;
        const setupEventEmitter = `
          webIdUpdater = () =>
          {
              // check for experiments set...
              if( ! safeExperimentsEnabled )
                  return;
              console.warn(
                  \`%cSAFE Browser Experimental Feature
%cThe webIdEventEmitter and window.currentWebId are experimental features.
They may be deprecated or change in future.
For updates or to submit ideas and suggestions, visit https://github.com/maidsafe/safe_browser\`,
              'font-weight: bold',
              'font-weight: normal'
              );
              var oldWebId_Id = '';
              var currentIdDefined = typeof window.currentWebId !== 'undefined';
              if( currentIdDefined )
              {
                oldWebId_Id = window.currentWebId["@id"];
              }
              window.currentWebId = ${JSON.stringify( theWebId )};
              if(
                    typeof webIdEventEmitter !== 'undefined' &&
                    window.currentWebId !== undefined &&
                    oldWebId_Id !== window.currentWebId["@id"] )
                  {
                      webIdEventEmitter.emit('update', currentWebId );
                  }
          }
          webIdUpdater();
      `;
        if ( webview !== null ) webview.executeJavaScript( setupEventEmitter );
    };

    setCurrentWebId( newWebId ) {
    // TODO: move webId func into extensions
        const { safeExperimentsEnabled } = this.props;
        // if ( safeExperimentsEnabled ) {
        this.debouncedWebIdUpdateFunc( newWebId );
    // }
    }

    newWindow( event ) {
        const { addTabEnd, windowId } = this.props;
        const { url } = event;
        logger.info( 'Tab: NewWindow event triggered for url: ', url );
        const tabId = Math.random().toString( 36 );
        addTabEnd( { url, windowId, tabId } );
        this.goForward();
    }

    isFrozen( event ) {
        logger.info( 'Webview is frozen...' );
        const { tabId } = this.props;
        const frozen = !tabId;
        // const frozen = staticTabData[index] || !index
        return frozen;
    }

    with( callback, options = { insist: false } ) {
        const { webview } = this;
        if ( !webview ) return;
        const webContents = webview.getWebContents();
        if ( !webContents ) {
            return;
        }
        if ( webContents.isDestroyed() ) return;
        callback( webview, webContents );
    }

    openDevTools() {
        this.with( ( wv, wc ) => wc.openDevTools( { mode: 'detach' } ) );
    }

    closeDevTools() {
        this.with( ( wv, wc ) => wc.closeDevTools() );
    }

    stop() {
        this.with( ( wv ) => wv.stop() );
    }

    reload() {
        logger.info( 'webview reloading' );
        this.with( ( wv ) => {
            wv.reload();
        } );
    }

    goBack() {
        this.with( ( wv ) => wv.goBack() );
    }

    goForward() {
        this.with( ( wv ) => wv.goForward() );
    }

    loadURL = async ( input ) => {
        const { webview } = this;
        const url = addTrailingSlashIfNeeded( input );
        logger.info( 'Webview: loading url:', url );
        // if ( !urlHasChanged( this.state.browserState.url, url) )
        // {
        //     logger.info( 'not loading URL as it has not changed');
        //     return;
        // }
        const currentState = this.state.browserState;
        const browserState = { ...currentState, url };
        this.setState( { browserState } );
        // prevent looping over attempted url loading
        if ( webview ) {
            webview.loadURL( url );
        }
    };

    render() {
        const { isActiveTab } = this.props;
        const preloadFile = remote ? remote.getGlobal( 'preloadFile' ) : '';
        const injectPath = preloadFile; // js we'll be chucking in
        let moddedClass = styles.tab;
        if ( isActiveTab ) {
            moddedClass = styles.activeTab;
        }

        if ( this.state && this.state.hasError ) {
            const error = this.state.theError;
            const stringError = JSON.stringify( error, [
                'message',
                'arguments',
                'type',
                'name'
            ] );
            logger.error( 'Error from Tab.jsx', error );
            logger.error( stringError );
            // You can render any custom fallback UI
            return (
                <div className={moddedClass}>
                    <h4>Something went wrong with this tab.</h4>
                    <span>
                        {JSON.stringify( error, ['message', 'arguments', 'type', 'name'] )}
                    </span>
                </div>
            );
        }

        return (
            <div className={moddedClass}>
                <webview
                    style={{ height: '100%', display: 'flex', flex: '1 1' }}
                    tabIndex={0}
                    webpreferences="nodeIntegration=true, contextIsolation=false"
                    preload={injectPath}
                    partition="persist:safe-tab"
                    ref={( c ) => {
                        this.webview = c;
                    }}
                />
            </div>
        );
    }
}
