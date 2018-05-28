import * as preloadFuncs from '../../app/setupPreloadAPIs';
import { APP_INFO, startedRunningProduction } from 'appConstants';

jest.mock('logger');

// avoid appveyour for its weak.ref issues right now.
const APPVEYOR = process.env.APPVEYOR;

describe('Setup Preload APIs', () =>
{
    if ( APPVEYOR )
    {
        return;
    }

    let win = {};
    let store = jest.fn(); //need to mock store. should be called once.
    beforeAll( () =>
    {
        preloadFuncs.setupSafeAPIs( store, win )
    });

    test('setupSafeAPIs populates the window object', async () =>
    {
        expect.assertions(5);

        expect( win ).toHaveProperty('safe');
        expect( win.safe ).toHaveProperty('CONSTANTS');
        expect( win.safe ).toHaveProperty('initialiseApp');
        expect( win.safe ).toHaveProperty('fromAuthURI');
        expect( win.safe ).toHaveProperty('authorise');
    });


    test('window.safe.authorise exists', async () =>
    {
        expect.assertions(2);
        expect(win.safe.authorise).not.toBeUndefined()

        try {
            await win.safe.authorise();

        } catch (e) {
            expect( e.message ).toBe('AuthUri string is required')
        }
    })

    // skip final tests in a production environment as libs dont exist
    if( startedRunningProduction ) return;

    test('setupSafeAPIs\s safe.initialiseApp', async () =>
    {
        expect.assertions(5);

        try
        {
            await win.safe.initialiseApp();
        }
        catch( e )
        {
            expect( e.message ).not.toBeNull();
            expect( e.message ).toBe('Cannot read property \'id\' of undefined');
        }

        let app = await win.safe.initialiseApp( APP_INFO.info );

        expect( app ).not.toBeNull()
        expect( app.auth ).not.toBeUndefined()
        expect( app.auth.openUri() ).toBeUndefined()

    });


    test('setupSafeAPIs\s safe.fromAuthURI, gets initialiseApp errors', async () =>
    {
        expect.assertions(3);

        try
        {
            await win.safe.fromAuthURI();
        }
        catch( e )
        {
            //error from initApp.
            expect( e.message ).not.toBeNull();
            expect( e.message ).toBe('Cannot read property \'id\' of undefined');
        }

        win.safe.initialiseApp = jest.fn()
                                    .mockName('mockInitApp');

        try
        {
            await win.safe.fromAuthURI();
        }
        catch( e )
        {
            expect( win.safe.initialiseApp.mock.calls.length ).toBe(1)
        }

    });

});
