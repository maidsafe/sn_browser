import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Grid from '@material-ui/core/Grid';
import { WebIdDropdown } from '$Extensions/safe/components/webIdDropdown';
import {
    showWebIdDropdown,
    setAppStatus
} from '$Extensions/safe/actions/safeBrowserApplication_actions';
import { getAvailableWebIds } from '$Extensions/safe/actions/aliased';

// import styles from './wrapAddressBarButtons.css';

function mapStateToProps( state ) {
    return {
        safeBrowserApp: state.safeBrowserApp
    };
}
function mapDispatchToProps( dispatch ) {
    const actions = {
        showWebIdDropdown,
        getAvailableWebIds,
        setAppStatus
    };
    return bindActionCreators( actions, dispatch );
}
export const wrapAddressBarButtonsLHS = (
    AddressBarButtons,
    extensionFunctionality = {}
) => {
    const WrappedAddressBarButtonsLHS = ( props ) => {
        const { safeBrowserApp } = props;
        const { experimentsEnabled } = safeBrowserApp;
        return (
            <Grid container alignItems="center">
                <Grid item>
                    <AddressBarButtons {...props} />
                </Grid>
                <Grid item>
                    <WebIdDropdown {...props} />
                </Grid>
            </Grid>
        );
    };

    const hookedUpInput = connect(
        mapStateToProps,
        mapDispatchToProps
    )( WrappedAddressBarButtonsLHS );
    return hookedUpInput;
};
