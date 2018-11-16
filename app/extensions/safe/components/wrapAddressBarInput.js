import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Column, Grid } from 'nessie-ui';
import _ from 'lodash';

import { Tag, Icon } from 'antd';
import 'antd/lib/tag/style';
import 'antd/lib/icon/style';
import './wrapAddressBarInput.less'

function mapStateToProps( state )
{
    return {

        safeBrowserApp : state.safeBrowserApp
    };
}

const wrapAddressBarInput = ( AddressBarInput, extensionFunctionality = {} ) =>
{
    class WrappedAddressBarInput extends Component
    {
        static propTypes =
        {
            safeBrowserApp : PropTypes.shape( {
                isMock             : PropTypes.bool,
                experimentsEnabled : PropTypes.bool
            } ).isRequired
        }

        static defaultProps =
        {
            safeBrowserApp : {
                isMock             : false,
                experimentsEnabled : false
            }
        }

        render()
        {
            const { safeBrowserApp } = this.props;

            const { isMock, experimentsEnabled } = safeBrowserApp;

            const addOns = [];

            if ( isMock ) addOns.push( <Tag color="#F5222D">Mock Network</Tag> );
            if ( experimentsEnabled ) addOns.push( <Tag color="#42566E"><Icon type="experiment" /></Tag> );
            // if ( experimentsEnabled ) addOns.push( <Tag color="#42566E">Experimental</Tag> );

            return (
                <Grid gutters="M">
                    <Column align="center" verticalAlign="middle">

                        <AddressBarInput
                            // className={ styles.addressBar }
                            { ...this.props }
                            addonBefore={ addOns }
                        />
                    </Column>
                </Grid>
            );
        }
    }

    const hookedUpInput = connect( mapStateToProps )( WrappedAddressBarInput );

    return hookedUpInput;
};

export default wrapAddressBarInput;
