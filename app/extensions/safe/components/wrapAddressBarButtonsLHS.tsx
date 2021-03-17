import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col } from 'antd';

import { WebIdDropdown } from '$Extensions/safe/components/webIdDropdown';
import 'antd/lib/row/style';
import 'antd/lib/col/style';
import 'antd/lib/button/style';
import {
    showWebIdDropdown,
    setAppStatus,
} from '$Extensions/safe/actions/safeBrowserApplication_actions';
import { getAvailableWebIds } from '$Extensions/safe/actions/aliased';

// import styles from './wrapAddressBarButtons.css';

function mapStateToProperties( state ) {
    return {
        safeBrowserApp: state.safeBrowserApp,
    };
}
function mapDispatchToProperties( dispatch ) {
    const actions = {
        showWebIdDropdown,
        getAvailableWebIds,
        setAppStatus,
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
            <Row
                type="flex"
                justify="end"
                align="middle"
                gutter={{ xs: 2, sm: 4, md: 6 }}
            >
                <Col>
                    <AddressBarButtons {...props} />
                </Col>
                {experimentsEnabled && (
                    <Col>
                        <WebIdDropdown {...props} />
                    </Col>
                )}
            </Row>
        );
    };

    const hookedUpInput = connect(
        mapStateToProperties,
        mapDispatchToProperties
    )( WrappedAddressBarButtonsLHS );
    return hookedUpInput;
};
