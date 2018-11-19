import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Row, Col, Icon, Button } from 'antd';
import 'antd/lib/row/style';
import 'antd/lib/col/style';
import 'antd/lib/button/style';
import 'antd/lib/icon/style';

import extendComponent from 'utils/extendComponent';
import { wrapAddressBarButtonsRHS } from 'extensions/components';
import styles from './buttonsRHS.css';

import CustomMenu from 'components/CustomMenu';

import { CLASSES } from 'appConstants';


/**
 * Left hand side buttons for the Address Bar
 * @extends Component
 */
class ButtonsRHS extends Component
{
    static propTypes =
    {
        addTab                : PropTypes.func.isRequired,
        address               : PropTypes.string,
        isBookmarked          : PropTypes.bool.isRequired,
        addBookmark           : PropTypes.func.isRequired,
        removeBookmark        : PropTypes.func.isRequired,
        showSettingsMenu      : PropTypes.func.isRequired,
        hideSettingsMenu      : PropTypes.func.isRequired,
        settingsMenuIsVisible : PropTypes.bool.isRequired,
        menuItems             : PropTypes.arrayOf( PropTypes.node ).isRequired
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
        const {
            isBookmarked,
            settingsMenuIsVisible,
            addTab,
            showSettingsMenu,
            hideSettingsMenu,
            menuItems
        } = this.props;


        return (
            <Row
                type="flex"
                justify="end"
                align="middle"
                gutter={ { xs: 2, sm: 4, md: 6 } }
            >
                <Col>
                    <Button
                        className={ styles.meatball }
                        shape="circle"
                    >
                        <Icon
                            className={ `${CLASSES.BOOKMARK_PAGE}` }
                            onClick={ this.handleBookmarking }
                            type="star"
                            theme={ isBookmarked ? 'filled' : 'outlined' }
                        />
                    </Button>
                </Col>
                <Col>
                    <CustomMenu
                        isVisible={ settingsMenuIsVisible }
                        menuItems={ menuItems }
                        showMenu={ showSettingsMenu }
                        hideMenu={ hideSettingsMenu }
                        // todo add icon option
                    />
                </Col>
            </Row>
        );
    }
}

export default extendComponent( ButtonsRHS, wrapAddressBarButtonsRHS );
