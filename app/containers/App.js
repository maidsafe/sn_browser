// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './app.css';

export default class App extends Component
{
    static propTypes = {
        children : PropTypes.element.isRequired
    };

    render()
    {
        return (
            <div className={ styles.container }>
                { this.props.children }
            </div>
        );
    }
}
