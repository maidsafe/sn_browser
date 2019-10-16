import React, { Component } from 'react';
import { parse } from 'url';
import { connect } from 'react-redux';
import {
    Grid,
    Box,
    Chip,
    Avatar,
    IconButton,
    Tooltip
} from '@material-ui/core';
import FastForwardIcon from '@material-ui/icons/FastForward';
import FastRewindIcon from '@material-ui/icons/FastRewind';
import EditIcon from '@material-ui/icons/Edit';
import _ from 'lodash';
import './wrapAddressBarInput.less';
import { bindActionCreators } from 'redux';
import Container from '@material-ui/core/Container';
import styles from './wrapAddressBarButtons.css';
import { CLASSES, PROTOCOLS } from '$Constants';
import { inEditor } from '$Extensions/safe/utils/isInEditor';
import { SAFE_PAGES } from '$Extensions/safe/rendererProcess/internalPages';
import { STYLE_CONSTANTS } from '$Extensions/safe/rendererProcess/styleConstants';

import * as SafeBrowserAppActions from '$Extensions/safe/actions/safeBrowserApplication_actions';

import { logger } from '$Logger';

function mapStateToProps( state ) {
    return {
        safeBrowserApp: state.safeBrowserApp,
        pWeb: state.pWeb
    };
}

function mapDispatchToProps( dispatch ) {
    const actions = {
        ...SafeBrowserAppActions
    };

    return bindActionCreators( actions, dispatch );
}

interface AddressBarInputProps {
    tabId: string;
    address: string;
    updateTabUrl: Function;
    registerNrsName: Function;
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
            registerNrsName: () => {},
            pWeb: {
                versionedUrls: {},
                availableNrsUrls: [],
                mySites: []
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

        let updatedAddress = address;

        if ( isMock ) {
            addOnsBefore.push(
                <Chip
                    key="F5222D"
                    label="Mock Network"
                    className={CLASSES.MOCK_TAG}
                    size="small"
                    color="primary"
                    style={{ background: '#e53936', marginLeft: '3px' }}
                />
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

        const baseUrl = `safe://${parsedAddress.host}${
            parsedAddress.pathname ? parsedAddress.pathname : ''
        }?v=`;

        // EDITOR
        // remove /
        const isEditingPage = inEditor( updatedAddress );

        let siteUnderEdit = null;

        if ( isEditingPage ) {
            siteUnderEdit = parsedAddress.path.substring( 1 );
            updatedAddress = `${PROTOCOLS.SAFE}://${siteUnderEdit}`;
        }

        const shouldHaveActivePreviousVersionButton =
      pageIsVersioned && currentVersion !== 0;

        const shouldHaveActiveNextVersionButton =
      pageIsVersioned && knownLatestVersion !== currentVersion;

        // Edit page tag
        if ( mySites.includes( parsedAddress.host ) || isEditingPage ) {
            addOnsBefore.push(
                <Tooltip title={`Edit ${address}`}>
                    <Box className={styles.editSiteWrapper}>
                        <Avatar
                            key="edit-site"
                            className={
                                isEditingPage
                                    ? styles.editSiteButtonClicked
                                    : styles.editSiteButton
                            }
                            size="small"
                            onClick={() => {
                                if ( isEditingPage ) {
                                    updateTabUrl( {
                                        tabId,
                                        url: `${PROTOCOLS.SAFE}://${siteUnderEdit}`
                                    } );

                                    return;
                                }

                                updateTabUrl( {
                                    tabId,
                                    url: `${PROTOCOLS.INTERNAL_PAGES}://${SAFE_PAGES.EDIT_SITE}/${parsedAddress.host}`
                                } );
                            }}
                        >
                            <EditIcon style={{ height: '15px', width: '15px' }} />
                        </Avatar>
                    </Box>
                </Tooltip>
            );
        }

        // prev version button
        if ( pageIsVersioned ) {
            addOnsBefore.push(
                <Tooltip title="Go to previous version">
                    <Box className={styles.versionButtonWrapper}>
                        <IconButton
                            key="prev-version"
                            size="small"
                            className={styles.versionButton}
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
                            <FastRewindIcon />
                        </IconButton>
                    </Box>
                </Tooltip>
            );
        }

        // next version button
        if ( pageIsVersioned ) {
            addOnsBefore.push(
                <Tooltip
                    title="Go to next version"
                    className={styles.versionButtonWrapper}
                >
                    <Box className={styles.versionButtonWrapper}>
                        <IconButton
                            key="next version"
                            size="small"
                            className={styles.versionButton}
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
                            <FastForwardIcon />
                        </IconButton>
                    </Box>
                </Tooltip>
            );
        }

        /*
        if ( experimentsEnabled ) {
            addOnsAfter.push(
                <Tag key="42566E" color="#42566E" onClick={() => disableExperiments()}>
                    <Icon type="experiment" />
                </Tag>
            );
        }
        */
        return (
            <Box>
                <Grid>
                    <AddressBarInput
                        // className={ styles.addressBar }
                        {...props}
                        address={updatedAddress}
                        addonBefore={addOnsBefore}
                        addonAfter={addOnsAfter}
                        extensionStyles={{
                            backgroundColor: STYLE_CONSTANTS.editBgColor
                        }}
                    />
                </Grid>
            </Box>
        );
    };

    const hookedUpInput = connect(
        mapStateToProps,
        mapDispatchToProps
    )( WrappedAddressBarInput );

    return hookedUpInput;
};
