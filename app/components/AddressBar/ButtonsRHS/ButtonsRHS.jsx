import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Row, Col, Icon } from 'antd';
import 'antd/lib/row/style';
import 'antd/lib/col/style';
import 'antd/lib/button/style';

import extendComponent from 'utils/extendComponent';
import { wrapAddressBarButtonsRHS } from 'extensions/components';
// import styles from './buttonsRHS.css';

import { CLASSES } from 'appConstants';

/**
 * Left hand side buttons for the Address Bar
 * @extends Component
 */
class ButtonsRHS extends Component
{
    static propTypes =
    {
        address        : PropTypes.string,
        isBookmarked   : PropTypes.bool.isRequired,
        addBookmark    : PropTypes.func.isRequired,
        removeBookmark : PropTypes.func.isRequired,
    }

    static defaultProps =
    {
        address    : '',
        isSelected : false,
        editingUrl : false
    }

    handleBookmarking = ( ) =>
    {
        const { address, addBookmark, removeBookmark, isBookmarked } = this.props;

        if ( isBookmarked )
        {
            removeBookmark( { url: address } );
        }
        else
        {
            addBookmark( { url: address } );
        }
    }

    render()
    {
        const { isBookmarked } = this.props;

        return (
            <Row type="flex" justify="end" align="middle">
                <Col>
                    <Icon
                        className={ `${CLASSES.BOOKMARK_PAGE}` }
                        onClick={ this.handleBookmarking }
                        type="star"
                        theme={ isBookmarked ? 'filled' : 'outlined' }
                    />
                </Col>
            </Row>
        );
    }
}

export default extendComponent( ButtonsRHS, wrapAddressBarButtonsRHS );
