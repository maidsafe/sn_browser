import React, { Component } from 'react';
import { Grid, IconButton } from '@material-ui/core';
import ArrowBackRoundedIcon from '@material-ui/icons/ArrowBackRounded';
import ArrowForwardRoundedIcon from '@material-ui/icons/ArrowForwardRounded';
import RefreshRoundedIcon from '@material-ui/icons/RefreshRounded';
import { I18n } from 'react-redux-i18n';
import { parse } from 'url';

import { logger } from '$Logger';
import { CLASSES, PROTOCOLS } from '$Constants';
import { extendComponent } from '$Utils/extendComponent';
import { wrapAddressBarButtonsLHS } from '$Extensions/components';
/**
 * Left hand side buttons for the Address Bar
 * @extends Component
 */
const ButtonsLHS = ( props ) => {
    const {
        addTabEnd,
        updateTabWebId,
        activeTab,
        handleBack,
        handleForward,
        handleRefresh,
        canGoForwards,
        canGoBackwards
    } = props;
    const activeTabUrl =
    activeTab && activeTab.url ? parse( activeTab.url ) : undefined;

    return (
    // label={I18n.t( 'aria.navigate_back' )}
        <Grid container spacing={1} direction="row" justify="space-evenly">
            <Grid item>
                <IconButton
                    size="small"
                    aria-label={I18n.t( 'aria.navigate_back' )}
                    className={CLASSES.BACKWARDS}
                    disabled={!canGoBackwards}
                    onClick={handleBack}
                >
                    <ArrowBackRoundedIcon />
                </IconButton>
            </Grid>
            <Grid item>
                <IconButton
                    size="small"
                    className={CLASSES.FORWARDS}
                    disabled={!canGoForwards}
                    aria-label={I18n.t( 'aria.navigate_forward' )}
                    onClick={handleForward}
                >
                    <ArrowForwardRoundedIcon />
                </IconButton>
            </Grid>
            <Grid item>
                <IconButton
                    size="small"
                    className={CLASSES.REFRESH}
                    aria-label={I18n.t( 'aria.reload_page' )}
                    disabled={
                        ( activeTab && activeTab.isLoading ) ||
            ( activeTabUrl && activeTabUrl.protocol )
                            ? activeTabUrl.protocol.includes( PROTOCOLS.INTERNAL_PAGES )
                            : false
                    }
                    onClick={handleRefresh}
                >
                    <RefreshRoundedIcon />
                </IconButton>
            </Grid>
        </Grid>
    );
};

export const ExtendedButtonsLHS = extendComponent(
    ButtonsLHS,
    wrapAddressBarButtonsLHS
);
