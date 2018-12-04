// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Error extends Component
{
    static propTypes =
    {
        error : PropTypes.shape( {
            header    : PropTypes.string.isRequired,
            subHeader : PropTypes.string
        } )
    }

    static defaultProps =
    {
        error : { header: '', subHeader: '' }
    }

    render( )
    {
        const { error } = this.props;
        const pageStyle = {
            width         : '100%',
            paddingTop    : '3px',
            paddingBottom : '3px',
            display       : 'flex',
            flex          : 'none',
            alignContent  : 'center',
            boxSizing     : 'border-box',
            borderRight   : '0',
            overflow      : 'auto'
        };
        const constainerStyle = {
            margin : '0 auto'
        };
        const contentStyle = {
            textAlign : 'center'
        };


        return (
            <div style={ pageStyle }>
                <div style={ constainerStyle }>
                    <h3 style={ contentStyle }>{ error.header }</h3>
                    {
                        error.subHeader && <h4 style={ contentStyle }>{ error.subHeader }</h4>
                    }
                </div>
            </div>
        );
    }
}
