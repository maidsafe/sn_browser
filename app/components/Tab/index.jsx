// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { remote } from 'electron';
// import { Link }                 from 'react-router'
import styles from './tab.css';
// import { MdClose }                from 'react-icons/md';
// import FaBeer from 'react-icons/lib/fa/beer';
// import electronContextMenu      from 'electron-context-menu'
// import WebView                  from 'react-electron-web-view';


const {Menu, MenuItem} = remote;

// drawing on itch browser meat: https://github.com/itchio/itch/blob/3231a7f02a13ba2452616528a15f66670a8f088d/appsrc/components/browser-meat.js
const WILL_NAVIGATE_GRACE_PERIOD = 3000;
const SHOW_DEVTOOLS = parseInt(process.env.DEVTOOLS, 10) > 1;





export default class Tab extends Component {
    static propTypes =
    {
        isActiveTab : PropTypes.bool.isRequired,
        url         : PropTypes.string.isRequired,
        //   tabPath: PropTypes.string,
        //   tabData: PropTypes.object,
        index    : PropTypes.number.isRequired,
        // className   : PropTypes.string,
        //   meId: PropTypes.any,
        // navigate    : PropTypes.any,

        updateTab : PropTypes.func.isRequired,
        addTab          : PropTypes.func.isRequired
        //   evolveTab: PropTypes.func.isRequired,

        //   controls: PropTypes.oneOf(['generic', 'game', 'user'])
    }

    static defaultProps =
    {
        isActiveTab : false,
        url         : 'http://nowhere.com',

    }


    constructor(props) {
        super(props);
        this.state = {
            browserState : {
                canGoBack    : false,
                canGoForward : false,
                loading      : true,
                url          : ''
            }
        };

        this.goBack = ::this.goBack;
        this.goForward = ::this.goForward;
        this.reload = ::this.reload;
        this.stop = ::this.stop;
        this.openDevTools = ::this.openDevTools;
        this.loadURL = ::this.loadURL;
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.url) {
            const { webview } = this;
            if (!webview) {
                return;
            }
            if (webview.src === '' || webview.src === 'about:blank' ||
            webview.src !== nextProps.url) {
                // we didn't have a proper url but now do
                this.loadURL(nextProps.url);
            }
        }
    }

    componentDidMount() {
        const { webviewShell } = this.refs;
        const { index } = this.props;

        const injectPath = ''; // js well be chucking in

        // console.log('MOUNTING TABBB', this.props);

        // cf. https://github.com/electron/electron/issues/6046
        //
        // Move this to css
        webviewShell.innerHTML = `<webview partition=${'tabPartition-' + index } style="height: 100%; display: flex; flex: 1 1;"/>`;
        const wv = webviewShell.querySelector('webview');
        this.webview = wv;

        const { meId } = this.props;
        // const partition = `persist:safe`

        // wv.partition = partition
        // wv.useragent = useragent
        wv.plugins = true;
        // wv.preload = injectPath
        //

        const menu = Menu.buildFromTemplate([

            { label: 'Cut', accelerator: 'Command+X', selector: 'cut:' },
            { label: 'Copy', accelerator: 'Command+C', selector: 'copy:' },
            { label: 'Paste', accelerator: 'Command+V', selector: 'paste:' },
            { label: 'Select All', accelerator: 'Command+A', selector: 'selectAll:' }
        ]);


        // menu.append(new MenuItem({label: 'Copy', click() { console.log('item 1 clicked') }}))
        // menu.append(new MenuItem({label: 'MenuItem1', click() { console.log('item 1 clicked') }}))
        // menu.append(new MenuItem({type: 'separator'}))
        // menu.append(new MenuItem({label: 'MenuItem2', type: 'checkbox', checked: true}))



        const callbackSetup = () => {
            wv.addEventListener('did-start-loading', ::this.didStartLoading);
            wv.addEventListener('did-stop-loading', ::this.didStopLoading);
            wv.addEventListener('will-navigate', ::this.willNavigate);
            wv.addEventListener('did-navigate', ::this.didNavigate);
            wv.addEventListener('page-title-updated', ::this.pageTitleUpdated);
            wv.addEventListener('page-favicon-updated', ::this.pageFaviconUpdated);
            wv.addEventListener('new-window', ::this.newWindow);

            wv.addEventListener('contextmenu', (e) => {
                  e.preventDefault()
                  menu.popup(remote.getCurrentWindow())
              }, false);

            this.domReady();

            wv.removeEventListener('dom-ready', callbackSetup);
        };
        wv.addEventListener('dom-ready', callbackSetup);

        wv.addEventListener('dom-ready', () => {
            // wv.executeJavaScript(`window.__itchInit && window.__itchInit(${JSON.stringify(index)})`)
            // this.didStopLoading()
        });

        // wv.src = 'http://google.com'
        // wv.src = 'about:blank'
        wv.src = 'about:blank';
    }


    //
    updateBrowserState(props = {}) {
        const { webview } = this;
        if (!webview) {
            return;
        }
        if (!webview.partition || webview.partition === '') {
            console.warn(`${this.props.index}: webview has empty partition`);
        }

        const browserState = {
            ...this.state.browserState,
            canGoBack    : webview.canGoBack(),
            canGoForward : webview.canGoForward(),
            ...props
        };

        this.setState({ browserState });
    }

    domReady() {
        const { url } = this.props;
        const { webview } = this;

        // console.log('DOME READYYYYY', url);

        const webContents = webview.getWebContents();
        if (!webContents || webContents.isDestroyed()) return;

        if (SHOW_DEVTOOLS) {
            webContents.openDevTools({ detach: true });
        }

        this.updateBrowserState({ loading: false });

        // if (currentSession !== webContents.session) {
        //     this.setupItchInternal(webContents.session)
        // }

        if (url && url !== 'about:blank') {
            this.loadURL(url)
            .catch(err => console.log('err in loadurl', err));
        }
    }

    didStartLoading() {
        this.updateBrowserState({ loading: true });
        const { webview } = this;
        const { addTab } = this.props;
        //
        // electronContextMenu({
        //             window: webview,
        //             showInspectElement : true,
        //             prepend: (params, browserWindow) => [{
        //                 label: 'OpenInNewTabbb',
        //                 accelerator : 'CommandOrControl+T',
        //                 click : ( menuItem, browserWindow, event )=>
        //                 {
        //                     if( params.linkURL )
        //                     {
        //                         console.log( params.linkURL );
        //                         addTab( { url : params.linkURL }  )
        //
        //                     }
        //                 }
        //
        //             }]
        //         })
    }

    didStopLoading() {
        this.updateBrowserState({ loading: false });
    }

    pageTitleUpdated(e) {
        const title = e.title;
        const { updateTab, index, isActiveTab } = this.props;

        const tabUpdate = {
            title, index
        };

        // console.log( 'action check pageTitleUpdated' );

        // if( ! )
        updateTab(tabUpdate);
        // should be title in bar not url !!
        //
        // const {index, tabDataFetched} = this.props
        // tabDataFetched(index, {webTitle: e.title})
    }

    pageFaviconUpdated(e) {
        // const {index, tabDataFetched} = this.props
        // tabDataFetched(index, {webFavicon: e.favicons[0]})
    }

    didNavigate(e) {
        const { updateTab, index } = this.props;
        const { url } = e;

        this.updateBrowserState({ url });

        // console.log( 'action check didNavigate' );

        updateTab({ index, url });
        // this.analyzePage(index, url)
    }

    willNavigate(e) {
        if (!this.isFrozen()) {
            return;
        }

        const { navigate } = this.props;
        const { url } = e;

        // sometimes we get double will-navigate events because life is fun?!
        if (this.lastNavigationUrl === url && e.timeStamp - this.lastNavigationTimeStamp < WILL_NAVIGATE_GRACE_PERIOD) {
            this.with((wv) => {
                wv.stop();
                wv.loadURL(this.props.url);
            });
            return;
        }
        this.lastNavigationUrl = url;
        this.lastNavigationTimeStamp = e.timeStamp;

        // navigate(`url/${url}`)

        const index = this.props.index;

        // extract to navigation lib?
        //
                // console.log( 'action check will navigate' );

        this.props.updateTab({ url: event.url });
        this.props.updateAddress(event.url);

        // our own little preventDefault
        // cf. https://github.com/electron/electron/issues/1378
        this.with((wv) => {
            wv.stop();
            wv.loadURL(this.props.url);
        });
    }

    newWindow(e) {
        const { navigate } = this.props;
        const { url } = e;
        // navigate('url/' + url)
        this.props.addTab(event.url);
    }

    isFrozen(e) {
        // const {index} = this.props
        // const frozen = staticTabData[index] || !index
        return false;
    }

    with(cb, opts = { insist: false }) {
        const { webview } = this;
        if (!webview) return;

        const webContents = webview.getWebContents();
        if (!webContents) {
            return;
        }

        if (webContents.isDestroyed()) return;

        cb(webview, webContents);
    }

    openDevTools() {
        this.with((wv, wc) => wc.openDevTools({ detach: true }));
    }

    stop() {
        this.with((wv) => wv.stop());
    }

    reload() {
        this.with((wv) => {
            wv.reload();
        });
        const { index, tabReloaded } = this.props;
        tabReloaded(index);
    }

    goBack() {
        this.with((wv) => wv.goBack());
    }

    goForward() {
        this.with((wv) => wv.goForward());
    }

    async loadURL(input) {
        // console.log(' input', input);
        const { navigate } = this.props;
        // const url = await transformUrl(input)
        // const url = 'http://google.com';
        const url = input;

        // if (navigation.isAppSupported(url) && this.isFrozen()) {
        //     navigate(`url/${url}`)
        // } else {
        const browserState = { ...this.state.browserState, url };
        this.setState({ browserState });

        // console.log('browserstattte???', this.state);

        const { webview } = this;

        //prevent looping over attempted url loading
        if (webview && url !== 'about:blank') {
            // webview.src = url;
            // console.log('webview exiissstsss', webview);
            webview.loadURL(url);
        }
        // }
    }

    shouldComponentUpdate( newProps )
    {
        if( newProps.isActiveTab !== this.props.isActiveTab )
            return true;

        return false;
    }



    render() {
        // console.log('STARTING tab RENNNDEERRRRRR');
        const { isActiveTab, tabData, tabPath, controls } = this.props;
        const { browserState } = this.state;

        let moddedClass = styles.tab;
        if (isActiveTab) {
            moddedClass = styles.activeTab;
            // console.log('THIS IS NOT THE ACTIVE TAB YOU WERE LOOKING FOR', moddedClass);
        }

        // const { goBack, goForward, stop, reload, openDevTools, loadURL } = this;
        // const controlProps = {tabPath, tabData, browserState, goBack, goForward, stop, reload, openDevTools, loadURL}

        const context = '';

        return <div className={moddedClass} ref="webviewShell" />;
    }

    //
    //
    // componentDidMount( )
    // {
    //     let webview = this.refs.webview;
    //
    //     console.log( "webview", webview );
    //     let thisTab = this;
    //     //webviw event binding function needed
    //     webview.addEventListener('will-navigate', event =>
    //     {
    //         const index  = this.props.index;
    //
    //         thisTab.props.updateTab( { url: event.url })
    //         thisTab.props.updateAddress( event.url )
    //     })
    //
    //     webview.addEventListener('new-window', event =>
    //     {
    //         thisTab.props.addTab( event.url )
    //
    //     });
    //
    //     webview.addEventListener('did-start-loading', event =>
    //     {
    //         // let webRequest = webview.getWebContents().session.webRequest ;
    //         //
    //         // console.log( "sessionnnnnnn wr", webRequest );
    //         //
    //         // webRequest.onBeforeSendHeaders( '*://*/*', (details, callback) =>
    //         // {
    //         //     console.log( "requessssssttttt", details );
    //         //
    //         //     callback({});
    //         // });
    //
    //
    //         electronContextMenu({
    //             window: webview,
    //             showInspectElement : true,
    //             prepend: (params, browserWindow) => [{
    //                 label: 'NewTabbb',
    //                 accelerator : 'CommandOrControl+T',
    //                 click : ( menuItem, browserWindow, event )=>
    //                 {
    //                     if( params.linkURL )
    //                     {
    //                         console.log( params.linkURL );
    //                         thisTab.props.addTab( { url : params.linkURL }  )
    //
    //                     }
    //                 }
    //
    //             }]
    //         })
    //     });
    //
    // }
    //
    //
    // render() {
    //
    //     const { url } = this.props;
    //     console.log( "props in Tab component", this.props );
    //
    //
    //
    //     // let tabSrc = tabs.get( index ).get( 'url' );
    //     return (
    //         <webview ref="webview" className={moddedClass} src={ url } session="persist:safe"/>
    //     );
    // }
}
