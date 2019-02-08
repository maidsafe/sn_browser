// @flow
import * as React from 'react';

import nessieStyles from 'nessie-ui/dist/styles.css';
import { SpriteMap } from 'nessie-ui';
import styles from './app.css';

type Props = {
    children: React.Node
};

export default class App extends React.Component<Props> {
    props: Props;

    render() {
        const { children } = this.props;
        return (
            <React.Fragment>
                <SpriteMap />
                {children}
            </React.Fragment>
        );
    }
}
