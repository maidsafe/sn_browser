import * as React from 'react';
import { SpriteMap } from 'nessie-ui';

interface Properties {
    children: React.ReactNode;
}

export const App = ( props: Properties ) => {
    const { children } = props;
    return (
        <React.Fragment>
            <SpriteMap />
            {children}
        </React.Fragment>
    );
};
