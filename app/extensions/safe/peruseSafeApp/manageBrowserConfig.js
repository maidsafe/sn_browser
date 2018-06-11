import logger from 'logger';
import { getPeruseAppObj } from './index.js';
import {
    setSaveConfigStatus,
    setReadConfigStatus
} from 'extensions/safe/actions/peruse_actions';
import { addNotification } from 'actions/notification_actions';
import { CONFIG } from 'appConstants';
import { SAFE, SAFE_APP_ERROR_CODES } from 'extensions/safe/constants';

/**
 * Parses the browser state to json (removes peruseApp) and saves to an MD on the app Homecontainer,
 * encrypting as it goes.
 * @param  { Object } state App state
 * @param  { Bool } quit  to quit or not to quit...
 * @return {[type]}       Promise
 */
export const saveConfigToSafe = ( store, quit ) =>
{
    const state = store.getState();

    // TODO: Better to opt in?
    const stateToSave = {
        ...state,
        peruseApp: {},
        authenticator: {},
        remoteCalls : []
    };
    const JSONToSave = JSON.stringify( stateToSave );

    return new Promise( async ( resolve, reject ) =>
    {
        const peruseAppObj = getPeruseAppObj();

        let mData;
        let mdEntries;

        if ( !peruseAppObj )
        {
            store.dispatch( setSaveConfigStatus( SAFE.SAVE_STATUS.FAILED_TO_SAVE ) );
            logger.error( 'Not authorised to save to the network.' );
            return reject( 'Not authorised to save data' );
        }

        try
        {
            const container = await peruseAppObj.auth.getOwnContainer();
            const mut = await peruseAppObj.mutableData.newMutation();
            const encryptedKey = await container.encryptKey( CONFIG.STATE_KEY );
            const encryptedData = await container.encryptValue( JSONToSave );

            let createdNewEntry = false;
            let previousEntry;
            let version;


            try
            {
                mdEntries = await container.getEntries();
            }
            catch ( e )
            {
                logger.verbose( 'Saved Data not found. Creating.' );

                if ( e.code === SAFE_APP_ERROR_CODES.ERR_DATA_NOT_FOUND )
                {
                    mut.insert( encryptedKey, encryptedData );
                    createdNewEntry = true;
                    container.applyEntriesMutation( mut );
                }
                else
                {
                    reject( e );
                }
            }

            try
            {
                logger.verbose( 'checking prev entry.' );
                previousEntry = await container.get( encryptedKey );
            }
            catch ( e )
            {
                if ( e.code === SAFE_APP_ERROR_CODES.ERR_NO_SUCH_ENTRY )
                {
                    logger.verbose( 'Previous didnt exist, creating...' );
                    mut.insert( encryptedKey, encryptedData );
                    createdNewEntry = true;
                    container.applyEntriesMutation( mut );
                }
                else
                {
                    reject( e );
                }
            }

            if ( !createdNewEntry && previousEntry &&
                typeof previousEntry.version !== 'undefined' )
            {
                logger.verbose( 'Previous entry exists, updating...' );

                version = previousEntry.version + 1;
                await mut.update( encryptedKey, encryptedData, version );
                container.applyEntriesMutation( mut );
            }

            logger.info( 'Data saved successfully' );
            resolve();
        }
        catch ( e )
        {
            logger.error( 'xxxxxxxxxxxxxxxxxxxxxxxxxx' );
            logger.error( e.message || e );
            logger.error( e.code );
            logger.error( 'xxxxxxxxxxxxxxxxxxxxxxxxxx' );
            reject( e );
        }
    } );
};

function delay( t )
{
    return new Promise( ( ( resolve ) =>
    {
        setTimeout( resolve, t );
    } ) );
}

/**
 * Read the configuration from the netowrk
 * @param  {[type]} app SafeApp reference, with handle and authUri
 */
export const readConfigFromSafe = ( store ) =>
    new Promise( async ( resolve, reject ) =>
    {
        const peruseAppObj = getPeruseAppObj();
        if ( !peruseAppObj )
        {
            reject( 'Not authorised to read from the network.' );
        }

        // FIXME: we add a delay here to prevent a deadlock known in the node-ffi
        // logic when dealing with the callbacks.
        // Research and remove this ASAP.
        await delay( 5000 );

        try
        {
            const container = await peruseAppObj.auth.getOwnContainer();
            const encryptedKey = await container.encryptKey( CONFIG.STATE_KEY );
            const encryptedValue = await container.get( encryptedKey );
            const decryptedValue = await container.decrypt( encryptedValue.buf );
            const browserState = await JSON.parse( decryptedValue.toString() );

            logger.info( 'State retrieved: ', browserState );
            resolve( browserState );
        }
        catch ( e )
        {
            if ( e.code === SAFE_APP_ERROR_CODES.ERR_NO_SUCH_ENTRY ||
                e.code === SAFE_APP_ERROR_CODES.ERR_DATA_NOT_FOUND )
            {
                const state = store.getState();

                //only error if we're only reading
                if( state.peruseApp.saveStatus !== SAFE.SAVE_STATUS.TO_SAVE )
                {
                    store.dispatch( addNotification( {
                        text: 'No browser data found on the network.',
                        type: 'error'
                    } ) );
                }

                store.dispatch( setReadConfigStatus( SAFE.READ_STATUS.READ_BUT_NONEXISTANT ))
            }
            else
            {
                logger.error( e );
                reject( e );
            }
        }
    } );
