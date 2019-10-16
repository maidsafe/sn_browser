import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { CLASSES } from '$Constants';
import * as SafeBrowserAppActions from '$Extensions/safe/actions/safeBrowserApplication_actions';
import styles from './wrapAddressBarButtons.css';

function mapStateToProps( state ) {
    return {
        safeBrowserApp: state.safeBrowserApp
    };
}
function mapDispatchToProps( dispatch ) {
    const actions = {
        ...SafeBrowserAppActions
    };
    return bindActionCreators( actions, dispatch );
}
export const wrapAddressBarButtonsRHS = (
    AddressBarButtons,
    extensionFunctionality = {}
) => {
    class WrappedAddressBarButtonsRHS extends Component {
    // static propTypes = {
    //   safeBrowserApp: PropTypes.shape({
    //     isMock: PropTypes.bool,
    //     experimentsEnabled: PropTypes.bool.isRequired,
    //     webIds: PropTypes.arrayOf(
    //       PropTypes.shape({
    //         name: PropTypes.string
    //       })
    //     )
    //   }).isRequired,
    //   menuItems: PropTypes.arrayOf(PropTypes.node).isRequired,
    //   enableExperiments: PropTypes.func.isRequired,
    //   disableExperiments: PropTypes.func.isRequired
    // };
        static defaultProps = {
            safeBrowserApp: {
                isMock: false,
                experimentsEnabled: false
            }
        };

        handleExperimentalToggleClick = () => {
            const {
                enableExperiments,
                disableExperiments,
                safeBrowserApp
            } = this.props;
            const { experimentsEnabled } = safeBrowserApp;
            if ( experimentsEnabled ) {
                disableExperiments();
                return;
            }
            enableExperiments();
        };

        getNewMenuItems = () => {
            const { menuItems } = this.props;
            const { safeBrowserApp } = this.props;
            const { experimentsEnabled } = safeBrowserApp;
            const itemsToAdd = [
                <Grid
                    item
                    key="menuItem-experimental-toggle"
                    className={`${styles.toggleRow} ${CLASSES.SETTINGS_MENU__TOGGLE}`}
                    justify="space-evenly"
                >
                    <span
                        className={`${styles.toggleText} ${CLASSES.SETTINGS_MENU__TOGGLE_TEXT}`}
                    >
            Toggle Experiments
                    </span>
                    <Switch
                        className={CLASSES.SETTINGS_MENU__TOGGLE_BUTTON}
                        size="small"
                        color="primary"
                        aria-label="settings-menu"
                        style={{ float: 'right' }}
                        checked={experimentsEnabled}
                        onChange={this.handleExperimentalToggleClick}
                    />
                </Grid>
            ];
            return [].concat( menuItems, itemsToAdd );
        };

        render() {
            // Commented out to disable toggle Experimental
            /*
            return (
                <AddressBarButtons {...this.props} menuItems={this.getNewMenuItems()} />
            );
            */
            return <AddressBarButtons {...this.props} />;
        }
    }
    const hookedUpInput = connect(
        mapStateToProps,
        mapDispatchToProps
    )( WrappedAddressBarButtonsRHS );
    return hookedUpInput;
};
