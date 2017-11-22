// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './app.css';
import nessieStyles from 'nessie-ui/dist/styles.css';
import { SpriteMap } from 'nessie-ui';

export default class App extends Component
{
    static propTypes = {
        children : PropTypes.element.isRequired
    };

    render()
    {
        return (
            <div className={ styles.container }>
                <SpriteMap/>
                { this.props.children }
            </div>
        );
    }
}
