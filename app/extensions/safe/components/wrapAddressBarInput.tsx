import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Column, Grid } from 'nessie-ui';
import _ from 'lodash';
import { Tag, Icon } from 'antd';
import 'antd/lib/tag/style';
import 'antd/lib/icon/style';
import './wrapAddressBarInput.less';
import { CLASSES } from '$Constants';
import { bindActionCreators } from 'redux';
import * as SafeBrowserAppActions from '$Extensions/safe/actions/safeBrowserApplication_actions';

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

export const wrapAddressBarInput = (
    AddressBarInput,
    extensionFunctionality = {}
) => {
    class WrappedAddressBarInput extends Component {
    // static propTypes = {
    //   safeBrowserApp: PropTypes.shape({
    //     isMock: PropTypes.bool,
    //     experimentsEnabled: PropTypes.bool
    //   }).isRequired
    // };
        static defaultProps = {
            safeBrowserApp: {
                isMock: false,
                experimentsEnabled: false
            }
        };

        render() {
            const { safeBrowserApp, disableExperiments } = this.props;
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
            if ( experimentsEnabled ) {
                addOnsAfter.push(
                    <Tag
                        key="42566E"
                        color="#42566E"
                        onClick={() => disableExperiments()}
                    >
                        <Icon type="experiment" />
                    </Tag>
                );
            }
            return (
                <Grid gutters="M">
                    <Column align="center" verticalAlign="middle">
                        <AddressBarInput
                            // className={ styles.addressBar }
                            {...this.props}
                            addonBefore={addOnsBefore}
                            addonAfter={addOnsAfter}
                        />
                    </Column>
                </Grid>
            );
        }
    }
    const hookedUpInput = connect(
        mapStateToProps,
        mapDispatchToProps
    )( WrappedAddressBarInput );
    return hookedUpInput;
};
