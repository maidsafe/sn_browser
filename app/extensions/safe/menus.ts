import {
    setSaveConfigStatus,
    setReadConfigStatus,
} from '$Extensions/safe/actions/safeBrowserApplication_actions';
import { SAFE } from '$Extensions/safe/constants';

// import { logger } from '$Logger';

const safeSave = ( store ) => ( {
    label: 'Save Browser State to SAFE',
    accelerator: 'CommandOrControl+Shift+E',
    click: ( _item, win ) => {
        if ( win ) {
            store.dispatch( setSaveConfigStatus( SAFE.SAVE_STATUS.TO_SAVE ) );
        }
    },
} );

const safeRead = ( store ) => ( {
    label: 'Read Browser State from SAFE',
    accelerator: 'CommandOrControl+Alt+F',
    click: ( item, win ) => {
        if ( win ) {
            store.dispatch( setReadConfigStatus( SAFE.READ_STATUS.TO_READ ) );
        }
    },
} );

export const addFileMenus = ( store, menu ) => {
    if ( !store || typeof store !== 'object' ) {
        throw new Error(
            'Must pass the store to enable dispatching actions from the menus.'
        );
    }

    if ( !menu ) throw new Error( 'Must pass a menu to extend.' );

    const save = safeSave( store );
    const read = safeRead( store );

    const newMenu = { ...menu };

    newMenu.submenu.push( { type: 'separator' } );
    // newMenu.submenu.push( safeSave( store ) );
    // newMenu.submenu.push( safeRead( store ) );
    return newMenu;
};
