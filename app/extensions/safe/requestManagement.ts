import open from 'open';
import { Store } from 'redux';
import { remote } from 'electron';
import { parse as parseURL } from 'url';
import path from 'path';

import { CONFIG, isRunningTestCafeProcess } from '$Constants';
import { logger } from '$Logger';
import { urlIsValid } from '$Extensions';

export const INVALID_URL = 'invalidUrl::cancel';
export const shouldBlockRequestForPage = (
    requestUrl: string,
    pageUrl: string
): boolean => {
    //  testcafe needs access to inject code
    const httpRegExp = new RegExp( '^http' );

    if ( isRunningTestCafeProcess ) {
        return false;
    }

    if ( requestUrl === INVALID_URL || !urlIsValid( requestUrl ) ) {
        logger.info( `Blocking url ${requestUrl}` );
        return true;
    }

    const parseQuery = true;
    const parsedTabUrl = parseURL( pageUrl, parseQuery );
    const requestedSiteParsed = parseURL( requestUrl, parseQuery );
    const requestedSiteVersion = requestedSiteParsed.query.v;
    // requesting unversioned resource from another page... which is not versioned block
    if (
        pageUrl.length > 0 &&
    requestedSiteParsed.host !== parsedTabUrl.host &&
    !requestedSiteVersion
    ) {
        logger.warn(
            'Unversioned External Resource Request Blocked @ URL:',
            requestUrl
        );
        return true;
    }

    return false;
};

export const getSourcePageUrl = (
    details: { headers: { 'User-Agent': string } },
    store: Store
): string => {
    const userAgent =
    details && details.headers ? details.headers['User-Agent'] : null;
    const targetWebContentsId = userAgent
        ? parseInt( userAgent.split( 'webContentsId:' )[1], 10 )
        : undefined;

    // HACK, w/ ?v=x query params we need another way to get the current
    // content version. So we use webContentsIds to do this.
    const state = store.getState();
    const { tabs } = state;

    const tabsArray = Object.values( tabs );

    let targetTab = null;
    if ( tabsArray.length > 0 ) {
        targetTab = tabsArray.find(
            ( tab: { webContentsId: number; url: string } ) =>
                tab.webContentsId && tab.webContentsId === targetWebContentsId
        );
    }

    const url = targetTab ? targetTab.url : '';
    return url;
};

export const redirectUrlIfNeeded = (
    requestUrl: string
): { shouldRedirect: boolean; redirectURL?: string } => {
    const appLocation = remote.app.getPath( 'exe' );
    const appExecutableName = path.basename( appLocation );

    let redirectURL = requestUrl;

    const parsedUrl = parseURL( requestUrl );
    const decodedPath = decodeURIComponent( parsedUrl.path );

    // On Mac Devtools makes many requests to the app via webpage for some reason
    if ( decodedPath && decodedPath.includes( appExecutableName ) ) {
        const desiredFileInApp = requestUrl.split( appExecutableName )[1];

        redirectURL = `file://${appLocation}${desiredFileInApp}`;
        logger.verbose( 'Permitting app dep url', redirectURL );
        return { shouldRedirect: true, redirectURL };
    }

    return { shouldRedirect: false };
};

export const mapPageResourceToPageVersion = (
    sourcePageUrl: string,
    requestUrl: string
): string => {
    const parseQuery = true;
    const parsedRequestUrl = parseURL( requestUrl, parseQuery );
    const parsedTabUrl = parseURL( sourcePageUrl, parseQuery );
    let versionedUrl = requestUrl;

    const tabSiteVersion = parsedTabUrl.query.v;

    const requestedSiteVersion = parsedRequestUrl.query
        ? parsedRequestUrl.query.v
        : null;

    if (
        parsedRequestUrl.host === parsedTabUrl.host &&
    !parsedRequestUrl.query.v &&
    parsedTabUrl.query.v
    ) {
        logger.verbose(
            'On a versioned site, updated resource req, to: ',
            `${requestUrl}?v=${tabSiteVersion}`
        );
        versionedUrl = `${requestUrl}?v=${tabSiteVersion}`;
    }
    return versionedUrl;
};

/*
 Actual filter mechanism for modifying or blocking URLs.
 URLs arrive from safe:// protocol modification with localhost: url set.
 should return localhost:<port>/safe:// url for serving from internal
 server for HTTP responses, for those that need it. And strip portions of other
 URL reqs (eg devtools).

 The callback should be called, cancelled or redirected
 */
export const manageAndModifyRequest = ( details, callback, store ) => {
    logger.verbose( 'Request to modify', details.url );

    // First lets get the page URL for comparing request
    const parseQuery = true;
    const sourcePageUrl = getSourcePageUrl( details, store );

    const fullServerUrl = parseURL( details.url );
    let finalUrl = details.url;

    // remove localhost:port is safe:// present.
    // Otherwise keep it for block checking
    if ( details.url.includes( 'safe://' ) ) {
        const requestedSite = fullServerUrl.path.slice( 1 );
        finalUrl = requestedSite;
    }

    finalUrl = mapPageResourceToPageVersion( sourcePageUrl, finalUrl );
    const { shouldRedirect, redirectURL } = redirectUrlIfNeeded( finalUrl );

    if ( shouldRedirect ) {
        callback( { redirectURL } );
        return;
    }
    if ( shouldBlockRequestForPage( finalUrl, sourcePageUrl ) ) {
        callback( { cancel: true } );
    } else {
        callback( {} );
    }
};

/**
 * Bound to preflight requests from webviews, binds a filter to modify
 * or block requests.
 */
export const requestManagement = ( store: Store ) => {
    const filter = {
        urls: ['*://*/*'],
    };

    const safeSession = remote.session.fromPartition( CONFIG.SAFE_PARTITION );

    safeSession.webRequest.onBeforeRequest( filter, ( details, callback ): void => {
        manageAndModifyRequest( details, callback, store );
    } );
};
