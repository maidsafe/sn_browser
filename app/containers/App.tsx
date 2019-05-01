import * as React from 'react';

import { SpriteMap } from 'nessie-ui';

interface Props {
    children: React.ReactNode;
}

export const App = ( props: Props ) => {
    const { children } = props;
    return (
        <React.Fragment>
            <SpriteMap />
            {children}
        </React.Fragment>
    );
};
