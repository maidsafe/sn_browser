// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Column, Grid } from 'nessie-ui';
import ButtonsLHS from 'components/AddressBar/ButtonsLHS';
import ButtonsRHS from 'components/AddressBar/ButtonsRHS';
import Input from 'components/AddressBar/Input';
import logger from 'logger';

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

        const { activeTab, updateActiveTab } = this.props;

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
                        <ButtonsRHS { ...this.props } />
                    </Column>
                </Grid>
            </div>
        );
    }
}
