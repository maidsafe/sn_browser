import * as React from 'react';

import { SpriteMap } from 'nessie-ui';

interface Props {
    children: React.Node;
}

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
