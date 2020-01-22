import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
// import Toolbar from '@material-ui/core/Toolbar';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import styles from './nrsRegistryBar.css';

import { logger } from '$Logger';

interface NrsRegistryBarProps {
    address: string;
    registerNrsName: Function;
    tabId: string;
    updateTabUrl: Function;
}
export class NrsRegistryBar extends Component<NrsRegistryBarProps, {}> {
    handleRegisterAddress = () => {
        const {
            address,
            tabId,
            registerNrsName,
            setNameAsMySite,
            updateTabUrl
        } = this.props;

        // TODO Validate etc.
        const addressToRegister = this.state ? this.state.input : address;

        logger.info( `Registering ${addressToRegister} on NRS` );
        registerNrsName( addressToRegister );

        updateTabUrl( {
            tabId,
            url: `${addressToRegister}/?v=0`
        } );
    };

    handleInputChange = ( error ) => {
        this.setState( {
            input: error.target.value
        } );
    };

    render() {
        const { address } = this.props;

        return (
            <React.Fragment>
                <AppBar
                    classes={{
                        colorPrimary: 'mysites__theBar'
                    }}
                    // color="secondary"
                    position="absolute"
                >
                    <div className={styles.barLayout}>
                        <Typography variant="subtitle1">Create Site</Typography>
                        <div className={styles.inputArea}>
                            <TextField
                                id="register-url"
                                label="URL to register"
                                className={styles.textField}
                                defaultValue={address}
                                onChange={this.handleInputChange}
                                margin="normal"
                                variant="outlined"
                            />
                            <div className={styles.buttonSpacer} />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={this.handleRegisterAddress}
                            >
                Create Site
                            </Button>
                        </div>
                    </div>
                </AppBar>
            </React.Fragment>
        );
    }
}
