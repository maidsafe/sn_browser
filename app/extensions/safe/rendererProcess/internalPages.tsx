import React, { ReactNode } from 'react';
import { Url } from 'url';
import { Editor } from '$Extensions/safe/components/SafePages/Editor';
import { MySites } from '$Extensions/safe/components/SafePages/MySites';

import { STYLE_CONSTANTS } from '$Extensions/safe/rendererProcess/styleConstants';

export const SAFE_PAGES = {
    EDIT_SITE: 'edit-site',
    MY_SITES: 'my-sites'
};

export const addInternalPages = (
    urlObj: Url,
    query: {
        register?: string;
    },
    tab: {
        tabId: string;
    },
    props: {}
): null | { pageComponent: ReactNode; title: string; tabButtonStyles?: {} } => {
    switch ( urlObj.host ) {
        case SAFE_PAGES.EDIT_SITE: {
            const targetName = urlObj.path.slice( 1 );
            return {
                title: `Edit ${targetName}`,
                tabButtonStyles: {
                    // backgroundColor: STYLE_CONSTANTS.editBgColor,
                    // color: STYLE_CONSTANTS.editFontColor
                },
                pageComponent: <Editor {...props} targetName={`safe://${targetName}`} />
            };
        }
        case SAFE_PAGES.MY_SITES: {
            const { register } = query;
            return {
                title: 'My Sites',
                pageComponent: (
                    <MySites
                        {...props}
                        tabId={tab.tabId}
                        register={register ? `safe://${register}` : undefined}
                    />
                )
            };
        }
        default: {
            return null;
        }
    }
};
