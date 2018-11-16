// @flow
import React, { Component } from 'react';
import { ipcRenderer, remote } from 'electron';
import PropTypes from 'prop-types';
import MdStar from 'react-icons/lib/md/star';
import MdStarOutline from 'react-icons/lib/md/star-outline';
import { Column, Grid } from 'nessie-ui';
import ButtonsLHS from 'components/AddressBar/ButtonsLHS';
import Input from 'components/AddressBar/Input';
import logger from 'logger';

import { CLASSES } from 'appConstants';

import styles from './addressBar.css';


export default class AddressBar extends Component
{
    static propTypes =
    {
        address            : PropTypes.string,
        isSelected         : PropTypes.bool,
        activeTab          : PropTypes.shape( { url: PropTypes.string } ),
        windowId           : PropTypes.number.isRequired,
        isBookmarked       : PropTypes.bool.isRequired,
        addBookmark        : PropTypes.func.isRequired,
        removeBookmark     : PropTypes.func.isRequired,
        onBlur             : PropTypes.func.isRequired,
        onSelect           : PropTypes.func.isRequired,
        onFocus            : PropTypes.func.isRequired,
        reloadPage         : PropTypes.func.isRequired,
        updateActiveTab    : PropTypes.func.isRequired,
        activeTabBackwards : PropTypes.func.isRequired,
        activeTabForwards  : PropTypes.func.isRequired,
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

    handleBack = ( ) =>
    {
        const { activeTabBackwards } = this.props;
        activeTabBackwards();
    }

    handleForward = ( ) =>
    {
        const { activeTabForwards } = this.props;
        activeTabForwards();
    }

    handleRefresh = ( event ) =>
    {
        // TODO: if cmd or so clicked, hard.
        event.stopPropagation();
        const { reloadPage } = this.props;
        reloadPage();
    }


    render()
    {
        const props = this.props;

        const { isBookmarked, activeTab, updateActiveTab } = this.props;

        return (
            <div className={ `${styles.container} js-address` } >
                <Grid align="left" verticalAlign="middle" gutters="S" className={ styles.addressBar }>
                    <Column size="content">
                        <ButtonsLHS
                            activeTab={ activeTab }
                            updateActiveTab={ updateActiveTab }
                            handleBack={ this.handleBack }
                            handleForward={ this.handleForward }
                            handleRefresh={ this.handleRefresh }
                            { ...props }
                        />

                    </Column>
                    <Column className={ styles.addressBarColumn }>
                        <Input { ...this.props } />
                    </Column>
                    <Column size="content">
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
                    </Column>
                </Grid>
            </div>
        );
    }
}
