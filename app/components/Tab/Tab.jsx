// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { remote, ipcRenderer } from 'electron';
import styles from './tab.css';


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
        // navigate    : PropTypes.any,
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
                url             : ''
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

    reloadIfActive()
    {
        const { isActiveTab } = this.props;

        if ( !isActiveTab )
        {
            return;
        }

        this.reload();
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

    componentDidMount()
    {
        const { webviewShell } = this.refs;
        const { index } = this.props;

        const injectPath = ''; // js well be chucking in

        let rightClickPosition;

        // cf. https://github.com/electron/electron/issues/6046
        webviewShell.innerHTML = '<webview style="height: 100%; display: flex; flex: 1 1;"/>';
        const wv = webviewShell.querySelector( 'webview' );
        this.webview = wv;

        const { meId } = this.props;
        const partition = 'persist:peruse-tab';

        // wv.partition = partition
        // wv.useragent = useragent
        wv.plugins = true;
        // wv.preload = injectPath
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
        const { updateTab, index, updateAddress } = this.props;
        const { url } = e;
        this.updateBrowserState( { url } );

        updateTab( { index, url } );
        updateAddress( url );
    }

    willNavigate( e )
    {
        if ( !this.isFrozen() )
        {
            return;
        }

        const { navigate } = this.props;
        const { url } = e;

        // sometimes we get double will-navigate events because life is fun?!
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
            this.props.updateAddress( url );
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
        const { navigate, addTab } = this.props;
        const { url } = e;
        // navigate('url/' + url)
        // addTab( { url, isActiveTab: true } );

        this.goForward();

        // TODO: Negate bug
        console.log( 'webcontents historyyyy', this.webview.getWebContents().history );
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

    async loadURL( input )
    {
        const { navigate } = this.props;
        // const url = await transformUrl(input)

        const url = input;

        // if (navigation.isAppSupported(url) && this.isFrozen()) {
        //     navigate(`url/${url}`)
        // } else {
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
