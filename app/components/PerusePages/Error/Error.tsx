import React from 'react';
import { parse } from 'url';
// js style as we're building from SSR, no CSS file as yet
// import styles from './error.css';
export const ERROR_TYPES = {
    BAD_REQUEST: 'BAD_REQUEST',
    NO_CONTENT_FOUND: 'NO_CONTENT_FOUND',
    INVALID_VERSION: 'INVALID_VERSION',
    UNKNOWN_NAME: 'UNKNOWN_NAME',
    CONNECTION_FAILED: 'CONNECTION_FAILED'
};

export const ERROR_CODES = {
    BAD_REQUEST: 400,
    NO_CONTENT_FOUND: 404,
    INVALID_VERSION: 404,
    UNKNOWN_NAME: 404,
    CONNECTION_FAILED: 500
};

// Safe Error code space? 1000?

const ERROR_PAGES = {
    CONNECTION_FAILED: {
        superTitle: 'Connection Failed',
        title: 'Could not connect to the network',
        getMessage: () => 'There was an problem with the network connection. '
    },
    BAD_REQUEST: {
        superTitle: 'Bad Request',
        title: 'Invalid address',
        getMessage: ( address ) =>
            `${address} is not a valid URL, please check it and try again.`
    },
    NO_CONTENT_FOUND: {
        superTitle: '404',
        title: 'Not Found',
        getMessage: () =>
            'Nothing has been published at this address, no page or file can be found'
    },
    INVALID_VERSION: {
        superTitle: 'Invalid version',
        title: 'This page version does not exist',
        getMessage: ( badVersion, latest ) =>
            `Version ${badVersion} does not exist.${
                latest ? ` ${latest} is the latest` : ''
            }`,
        getCallToAction: ( address ) => {
            const parsed = parse( address );
            const latestVersion = `safe://${parsed.host}${parsed.path}`;

            return {
                text: 'Go to latest',
                targetUrl: latestVersion
            };
        }
    },
    UNKNOWN_NAME: {
        superTitle: 'Unknown Public Name',
        title: 'Nobody owns this address yet',
        getMessage: ( address ) => `${address} has not been registered yet.`,
        getCallToAction: ( address ) => {
            const parsed = parse( address );
            const registerThis = `sn_browser://my-sites?register=${parsed.host}`;

            return {
                ctaText: `Register ${address}`,
                targetUrl: registerThis
            };
        },
        errorCode: 404
    }
};
export const Error = ( props ) => {
    const { address, badVersion, latestVersion, type } = props;

    const {
        superTitle,
        title,
        getMessage,
        getCallToAction,
        errorCode
    } = ERROR_PAGES[type];

    const pageStyle = {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        boxSizing: 'border-box',
        borderRight: '0',
        overflow: 'auto',
        margin: '0',
        fontFamily: 'system-ui'
    };

    const containerStyle = {
        width: '500px',
        display: 'flex',
        alignItems: 'start',
        flexDirection: 'column',
        justifyContent: 'center',
        boxSizing: 'border-box',
        margin: '0'
    };

    const callToActionStyle = {
        display: 'block',
        backgroundColor: '#4054B2',
        color: '#FFFFFF',
        padding: '12px',
        borderRadius: '200px',
        textDecoration: 'none'
    };

    const superTitleStyle = {
        display: 'block',
        textTransform: 'uppercase'
    };

    const { ctaText, targetUrl } = getCallToAction
        ? getCallToAction( address )
        : { ctaText: null, targetUrl: null };

    return (
        <html lang="en">
            <body style={pageStyle}>
                <div style={containerStyle}>
                    <div style={superTitleStyle}>{superTitle}</div>
                    <h1 key="title" style={{ fontWeight: 'normal' }}>
                        {title}
                    </h1>
                    <p key="message" style={{}}>
                        {getMessage( address )}
                    </p>
                    {ctaText && (
                        <a href={targetUrl} style={callToActionStyle}>
                            {ctaText}
                        </a>
                    )}
                </div>
            </body>
        </html>
    );
};
