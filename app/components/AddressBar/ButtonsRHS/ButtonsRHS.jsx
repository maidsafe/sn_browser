import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Column, Grid } from 'nessie-ui';
import MdStar from 'react-icons/lib/md/star';
import MdStarOutline from 'react-icons/lib/md/star-outline';
import extendComponent from 'utils/extendComponent';
import { wrapAddressBarButtonsRHS } from 'extensions/components';
import styles from './buttonsRHS.css';

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
            <Grid gutters="S">
                <Column align="left">
                    {
                        isBookmarked &&
                            <MdStar className={ `${styles.buttonIcon} ${CLASSES.BOOKMARK_PAGE}` } onClick={ this.handleBookmarking } />
                    }
                    {
                        !isBookmarked &&
                            <MdStarOutline className={ `${styles.buttonIcon} ${CLASSES.BOOKMARK_PAGE}` } onClick={ this.handleBookmarking } />
                    }
                </Column>
            </Grid>
        );
    }
}

export default extendComponent( ButtonsRHS, wrapAddressBarButtonsRHS );
