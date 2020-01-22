import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { CLASSES, isRunningSpectronTestProcess } from '$Constants';
import { SAFE } from '$Extensions/safe/constants';
import { logger } from '$Logger';
import * as SafeBrowserActions from '$Extensions/safe/actions/safeBrowserApplication_actions';

function mapStateToProperties( state ) {
    return {
        safeBrowserApp: state.safeBrowserApp
    };
}
function mapDispatchToProperties( dispatch ) {
    const actions = {
        ...SafeBrowserActions
    };
    return bindActionCreators( actions, dispatch );
}
// jsx css as babel not currently parsing css files here.
const spectronAreaButton = {
    width: '10px',
    height: '10px',
    display: 'inline-block'
};
const spectronArea = {
    backgroundColor: 'blue',
    display: 'block',
    width: '100%',
    height: '40px'
};
const browserContainer = {
    textAlign: 'center',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
};
export const wrapBrowser = ( BrowserComponent, extensionFunctionality = {} ) => {
    class WrappedSafeBrowser extends Component {
    // static propTypes = {
    //   addressBarIsSelected: PropTypes.bool,
    //   setSaveConfigStatus: PropTypes.func.isRequired,
    //   setReadConfigStatus: PropTypes.func.isRequired
    // };
        static defaultProps = {
            addressBarIsSelected: false,
            tabs: [],
            bookmarks: [],
            notifications: []
        };

        handleSpectronTestSaveState = () => {
            const { setSaveConfigStatus } = this.props;
            logger.info( 'ATTEMPTING MENU SPOOF SAVE', setSaveConfigStatus );
            setSaveConfigStatus( SAFE.SAVE_STATUS.TO_SAVE );
        };

        handleSpectronTestReadState = () => {
            const { setReadConfigStatus } = this.props;
            logger.info( 'ATTEMPTING MENU SPOOF READ', setReadConfigStatus );
            setReadConfigStatus( SAFE.READ_STATUS.TO_READ );
        };

        render() {
            return (
                <div style={browserContainer}>
                    {isRunningSpectronTestProcess && (
                        <div
                            className={`${CLASSES.SPECTRON_AREA}`}
                            // hard setting style just now, as babel is not parsing css
                            style={spectronArea}
                        >
                            <button
                                type="button"
                                style={spectronAreaButton}
                                aria-label="spoofSave"
                                className={`${CLASSES.SPECTRON_AREA__SPOOF_SAVE}`}
                                onClick={this.handleSpectronTestSaveState}
                            />
                            <button
                                type="button"
                                style={spectronAreaButton}
                                aria-label="spoofRead"
                                className={`${CLASSES.SPECTRON_AREA__SPOOF_LOAD}`}
                                onClick={this.handleSpectronTestReadState}
                            />
                        </div>
                    )}
                    <BrowserComponent {...this.props} />
                </div>
            );
        }
    }
    const hookedUpInput = connect(
        mapStateToProperties,
        mapDispatchToProperties
    )( WrappedSafeBrowser );
    return hookedUpInput;
};
