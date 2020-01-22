import React, { Component } from 'react';
import { Row, Col, Switch } from 'antd';
import 'antd/lib/row/style';
import 'antd/lib/col/style';
import 'antd/lib/switch/style';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import styles from './wrapAddressBarButtons.css';

import { CLASSES } from '$Constants';
import * as SafeBrowserAppActions from '$Extensions/safe/actions/safeBrowserApplication_actions';

function mapStateToProperties( state ) {
    return {
        safeBrowserApp: state.safeBrowserApp
    };
}
function mapDispatchToProperties( dispatch ) {
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
                <Row
                    key="menuItem-experimental-toggle"
                    type="flex"
                    justify="space-between"
                    align="middle"
                    className={`${styles.toggleRow} ${CLASSES.SETTINGS_MENU__TOGGLE}`}
                >
                    <Col span={6}>
                        <span
                            className={`${styles.toggleText} ${CLASSES.SETTINGS_MENU__TOGGLE_TEXT}`}
                        >
              Toggle Experiments
                        </span>
                    </Col>
                    <Col span={6} offset={6}>
                        <Switch
                            className={CLASSES.SETTINGS_MENU__TOGGLE_BUTTON}
                            size="small"
                            aria-label="settings-menu"
                            tabIndex={0}
                            style={{ float: 'right' }}
                            checked={experimentsEnabled}
                            onChange={this.handleExperimentalToggleClick}
                        />
                    </Col>
                </Row>
            ];
            return [].concat( menuItems, itemsToAdd );
        };

        render() {
            return (
                <AddressBarButtons {...this.props} menuItems={this.getNewMenuItems()} />
            );
        }
    }
    const hookedUpInput = connect(
        mapStateToProperties,
        mapDispatchToProperties
    )( WrappedAddressBarButtonsRHS );
    return hookedUpInput;
};
