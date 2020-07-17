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

import { CLASSES, PROTOCOLS } from '$Constants';
import { inEditor } from '$Extensions/safe/utils/isInEditor';
import { SAFE_PAGES } from '$Extensions/safe/rendererProcess/internalPages';
import { STYLE_CONSTANTS } from '$Extensions/safe/rendererProcess/styleConstants';
import * as SafeBrowserAppActions from '$Extensions/safe/actions/safeBrowserApplication_actions';
import { logger } from '$Logger';

function mapStateToProperties( state ) {
    return {
        safeBrowserApp: state.safeBrowserApp,
        pWeb: state.pWeb,
    };
}

function mapDispatchToProperties( dispatch ) {
    const actions = {
        ...SafeBrowserAppActions,
    };

    return bindActionCreators( actions, dispatch );
}

interface AddressBarInputProps {
    tabId: string;
    address: string;
    updateTabUrl: () => void;
    registerNrsName: () => void;
    safeBrowserApp: {
        isMock: boolean;
        experimentsEnabled: boolean;
    };
    pWeb: {
        versionedUrls: {
            [url: string]: number;
        };
        availableNrsUrls: Array<string>;
        mySites: Array<string>;
    };
    disableExperiments?: () => void;
}

export const wrapAddressBarInput = (
    AddressBarInput,
    extensionFunctionality = {}
) => {
    const WrappedAddressBarInput = (
        props: AddressBarInputProps = {
            safeBrowserApp: {
                isMock: false,
                experimentsEnabled: false,
            },
            tabId: '',
            address: '',
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            updateTabUrl: () => {},
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            registerNrsName: () => {},
            pWeb: {
                versionedUrls: {},
                availableNrsUrls: [],
                mySites: [],
            },
        }
    ) => {
        const {
            address,
            tabId,
            safeBrowserApp,
            disableExperiments,
            updateTabUrl,
            pWeb,
        } = props;
        const { isMock, experimentsEnabled } = safeBrowserApp;
        const addOnsBefore = [];
        const addOnsAfter = [];

        let updatedAddress = address;

        if ( isMock ) {
            addOnsBefore.push(
                <Tag key="F5222D" className={CLASSES.MOCK_TAG} color="#F5222D">
          Mock Network
                </Tag>
            );
        }

        let knownVersionedUrl;
        const { availableNrsUrls, mySites, versionedUrls } = pWeb;

        const parseTheQuery = true;
        const parsedAddress = parse( address, parseTheQuery );

        // VERSIONS
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

        logger.verbose( 'Version determined from URL query: ', urlVersion );
        logger.verbose( 'Latest known version: ', knownLatestVersion );

        const baseUrl = `safe://${parsedAddress.host}${
            parsedAddress.pathname ? parsedAddress.pathname : ''
        }?v=`;

        // EDITOR
        // remove /
        const isEditingPage = inEditor( updatedAddress );

        let siteUnderEdit = null;

        if ( isEditingPage ) {
            siteUnderEdit = parsedAddress.path.slice( 1 );
            updatedAddress = `${PROTOCOLS.SAFE}://${siteUnderEdit}`;
        }

        const shouldHaveActivePreviousVersionButton =
      pageIsVersioned && currentVersion !== 0;

        const shouldHaveActiveNextVersionButton =
      pageIsVersioned && knownLatestVersion !== currentVersion;

        // Edit page tag
        if ( mySites.includes( parsedAddress.host ) || isEditingPage ) {
            addOnsBefore.push(
                <Tag
                    key="edit-site"
                    className={styles.editSiteButton}
                    color={isEditingPage ? 'grey' : 'green'}
                    title={`Edit ${address}`}
                    onClick={() => {
                        if ( isEditingPage ) {
                            updateTabUrl( {
                                tabId,
                                url: `${PROTOCOLS.SAFE}://${siteUnderEdit}`,
                            } );

                            return;
                        }

                        updateTabUrl( {
                            tabId,
                            url: `${PROTOCOLS.INTERNAL_PAGES}://${SAFE_PAGES.EDIT_SITE}/${parsedAddress.host}`,
                        } );
                    }}
                >
                    <Icon type="edit" />
                </Tag>
            );
        }

        // prev version button
        if ( pageIsVersioned ) {
            addOnsBefore.push(
                <Tag
                    key="prev-version"
                    className={styles.versionButton}
                    // disabled={shouldHaveActivePreviousVersionButton}
                    color={shouldHaveActivePreviousVersionButton ? 'green' : 'grey'}
                    title="Go to previous version"
                    onClick={() => {
                        if ( !shouldHaveActivePreviousVersionButton ) {
                            return;
                        }
                        logger.info( 'Do something about prev version versions...' );
                        updateTabUrl( {
                            tabId,
                            url: `${baseUrl}${currentVersion - 1}`,
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
                    color={shouldHaveActiveNextVersionButton ? 'green' : 'grey'}
                    title="Go to next version"
                    onClick={() => {
                        if ( !shouldHaveActiveNextVersionButton ) {
                            return;
                        }
                        logger.info( 'Do something about next version versions...' );
                        updateTabUrl( {
                            tabId,
                            url: `${baseUrl}${currentVersion + 1}`,
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
                        address={updatedAddress}
                        addonBefore={addOnsBefore}
                        addonAfter={addOnsAfter}
                        extensionStyles={{
                            backgroundColor: STYLE_CONSTANTS.editBgColor,
                        }}
                    />
                </Column>
            </Grid>
        );
    };

    const hookedUpInput = connect(
        mapStateToProperties,
        mapDispatchToProperties
    )( WrappedAddressBarInput );

    return hookedUpInput;
};
