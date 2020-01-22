import { parse } from 'url';

import { PROTOCOLS } from '$Constants';
import { SAFE_PAGES } from '$Extensions/safe/rendererProcess/internalPages';

export const inEditor = ( address ): boolean => {
    const parsedAddress = parse( address );

    return (
        parsedAddress.protocol === `${PROTOCOLS.INTERNAL_PAGES}:` &&
    parsedAddress.host === SAFE_PAGES.EDIT_SITE
    );
};
