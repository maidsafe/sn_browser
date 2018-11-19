import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Row, Col, Switch } from 'antd';
import 'antd/lib/row/style';
import 'antd/lib/col/style';
import 'antd/lib/switch/style';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as SafeBrowserAppActions
    from 'extensions/safe/actions/SafeBrowserApplication_actions';

import styles from './wrapAddressBarButtons.css';


function mapStateToProps( state )
{
    return {
        safeBrowserApp : state.safeBrowserApp
    };
}


function mapDispatchToProps( dispatch )
{
    const actions =
        {
            ...SafeBrowserAppActions
        };

    return bindActionCreators( actions, dispatch );
}


const wrapAddressBarButtonsRHS = ( AddressBarButtons, extensionFunctionality = {} ) =>
{
    class WrappedAddressBarButtonsRHS extends Component
    {
        static propTypes =
        {
            safeBrowserApp : PropTypes.shape( {
                isMock             : PropTypes.bool,
                experimentsEnabled : PropTypes.bool.isRequired,
                webIds             : PropTypes.arrayOf( PropTypes.shape( {
                    name : PropTypes.string
                } ) )
            } ).isRequired,
            menuItems          : PropTypes.arrayOf( PropTypes.node ).isRequired,
            enableExperiments  : PropTypes.func.isRequired,
            disableExperiments : PropTypes.func.isRequired,

        }

        static defaultProps =
        {
            safeBrowserApp : {
                isMock             : false,
                experimentsEnabled : false
            }
        }


        handleExperimentalToggleClick = ( ) =>
        {
            const {
                enableExperiments,
                disableExperiments,
                safeBrowserApp
            } = this.props;

            const { experimentsEnabled } = safeBrowserApp;

            if ( experimentsEnabled )
            {
                disableExperiments();
                return;
            }

            enableExperiments();
        }

        getNewMenuItems = () =>
        {
            const { menuItems } = this.props;
            const {
                safeBrowserApp
            } = this.props;
            const { experimentsEnabled } = safeBrowserApp;

            const itemsToAdd = [
                <Row type="flex" className={ styles.toggleRow }>
                    <Col className={ styles.toggleText }>Toggle Experiments</Col>
                    <Col>
                        <Switch
                            size="small"
                            checked={ experimentsEnabled }
                            onChange={ this.handleExperimentalToggleClick }
                        />
                    </Col>
                </Row>,
            ];

            return [].concat( menuItems, itemsToAdd );
        }

        render()
        {
            return (
                <AddressBarButtons
                    { ...this.props }
                    menuItems={ this.getNewMenuItems() }
                />

            );
        }
    }

    const hookedUpInput =
        connect(
            mapStateToProps,
            mapDispatchToProps
        )( WrappedAddressBarButtonsRHS );

    return hookedUpInput;
};


export default wrapAddressBarButtonsRHS;
