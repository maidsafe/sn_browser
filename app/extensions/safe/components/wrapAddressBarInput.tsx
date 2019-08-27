import React, { Component } from 'react';
import { parse } from 'url';
import { connect } from 'react-redux';
import { Column, Grid } from 'nessie-ui';
import _ from 'lodash';
import { Tag, Icon } from 'antd';
import 'antd/lib/tag/style';
import 'antd/lib/icon/style';
import './wrapAddressBarInput.less';
import { bindActionCreators } from 'redux';
import styles from './wrapAddressBarButtons.css';
import { CLASSES } from '$Constants';
import * as SafeBrowserAppActions from '$Extensions/safe/actions/safeBrowserApplication_actions';
import * as TabActions from '$Actions/tabs_actions';

import { logger } from '$Logger';

function mapStateToProps( state ) {
    return {
        safeBrowserApp: state.safeBrowserApp,
        pWeb: state.pWeb
    };
}

function mapDispatchToProps( dispatch ) {
    const actions = {
        ...SafeBrowserAppActions,
        ...TabActions
    };
    return bindActionCreators( actions, dispatch );
}

interface AddressBarInputProps {
    tabId: string;
    address: string;
    updateTabUrl: Function;
    safeBrowserApp: {
        isMock: boolean;
        experimentsEnabled: boolean;
    };
    pWeb: {
        versionedUrls: {
            [url: string]: number;
        };
    };
    disableExperiments?: Function;
}

export const wrapAddressBarInput = (
    AddressBarInput,
    extensionFunctionality = {}
) => {
    const WrappedAddressBarInput = (
        props: AddressBarInputProps = {
            safeBrowserApp: {
                isMock: false,
                experimentsEnabled: false
            },
            tabId: '',
            address: '',
            updateTabUrl: () => {},
            pWeb: {
                versionedUrls: {}
            }
        }
    ) => {
        const {
            address,
            tabId,
            safeBrowserApp,
            disableExperiments,
            updateTabUrl,
            pWeb
        } = props;
        const { isMock, experimentsEnabled } = safeBrowserApp;
        const addOnsBefore = [];
        const addOnsAfter = [];
        if ( isMock ) {
            addOnsBefore.push(
                <Tag key="F5222D" className={CLASSES.MOCK_TAG} color="#F5222D">
          Mock Network
                </Tag>
            );
        }

        let knownVersionedUrl;
        const parseTheQuery = true;
        const versionedUrls = pWeb.versionedUrls || {};
        const parsedAddress = parse( address, parseTheQuery );

        const urlVersion =
      parsedAddress.query && parsedAddress.query.v
          ? parseInt( parsedAddress.query.v, 10 )
          : undefined;

        Object.keys( versionedUrls ).forEach( ( site ) => {
            if ( address.startsWith( site ) ) {
                knownVersionedUrl = site;
            }
        } );

        const knownLatestVersion = versionedUrls[knownVersionedUrl];
        const pageIsVersioned = !!knownLatestVersion;
        // we're either at a url w/ version, or the latest.
        const currentVersion =
      typeof urlVersion !== 'undefined' ? urlVersion : knownLatestVersion;

        logger.verbose( 'Known latest page version: ', knownLatestVersion );
        logger.verbose( 'Current page version: ', currentVersion );
        logger.verbose( 'Version determined from URL query: ', urlVersion );

        const baseUrl = `safe://${parsedAddress.host}${
            parsedAddress.pathname ? parsedAddress.pathname : ''
        }?v=`;

        const shouldHaveActivePreviousVersionButton =
      pageIsVersioned && currentVersion !== 0;

        const shouldHaveActiveNextVersionButton =
      pageIsVersioned && knownLatestVersion !== currentVersion;

        // prev version button
        if ( pageIsVersioned ) {
            addOnsBefore.push(
                <Tag
                    key="prev-version"
                    className={styles.versionButton}
                    disabled={shouldHaveActivePreviousVersionButton}
                    color={shouldHaveActivePreviousVersionButton ? 'green' : 'grey'}
                    title="Go to previous version"
                    onClick={() => {
                        if ( !shouldHaveActivePreviousVersionButton ) {
                            return;
                        }
                        logger.info( 'Do something about prev version versions...' );
                        updateTabUrl( {
                            tabId,
                            url: `${baseUrl}${currentVersion - 1}`
                        } );
                    }}
                >
                    <Icon type="step-backward" />
                </Tag>
            );
        }

        // next version button
        if ( pageIsVersioned ) {
            addOnsBefore.push(
                <Tag
                    key="next version"
                    className={styles.versionButton}
                    disabled={shouldHaveActiveNextVersionButton}
                    color={shouldHaveActiveNextVersionButton ? 'green' : 'grey'}
                    title="Go to next version"
                    onClick={() => {
                        if ( !shouldHaveActiveNextVersionButton ) {
                            return;
                        }
                        logger.info( 'Do something about next version versions...' );
                        updateTabUrl( {
                            tabId,
                            url: `${baseUrl}${currentVersion + 1}`
                        } );
                    }}
                >
                    <Icon type="step-forward" />
                </Tag>
            );
        }

        if ( experimentsEnabled ) {
            addOnsAfter.push(
                <Tag key="42566E" color="#42566E" onClick={() => disableExperiments()}>
                    <Icon type="experiment" />
                </Tag>
            );
        }
        return (
            <Grid gutters="M">
                <Column align="center" verticalAlign="middle">
                    <AddressBarInput
                        // className={ styles.addressBar }
                        {...props}
                        addonBefore={addOnsBefore}
                        addonAfter={addOnsAfter}
                    />
                </Column>
            </Grid>
        );
    };

    const hookedUpInput = connect(
        mapStateToProps,
        mapDispatchToProps
    )( WrappedAddressBarInput );

    return hookedUpInput;
};
