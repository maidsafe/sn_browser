import React from 'react';

import logger from 'logger';

const wrapTab = ( TabComponent, extensionFunctionality = {} ) =>
{
    class WrappedSafeBrowser extends TabComponent
    {
        loadURL( input )
        {
            console.log(' -------- -------- babdkeienbdlkalkjasdfie ----------- -----------');
            logger.info('wrapeppper tabb tabbb awrappp loadURL input: ', input);
            super.loadURL( 'safe://service.publicname' );
        }

        render()
        {
            return (
                <TabComponent { ...this.props } />
            );
        }
    }

    return WrappedSafeBrowser;
};

export default wrapTab;
