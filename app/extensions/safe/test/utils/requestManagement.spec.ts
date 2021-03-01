import {
    shouldBlockRequestForPage,
    getSourcePageUrl,
    redirectUrlIfNeeded,
    manageAndModifyRequest,
    mapPageResourceToPageVersion,
    INVALID_URL,
} from '$Extensions/safe/requestManagement';

const SERVER = 'http://localhost:55155';

jest.mock( 'electron', () => {
    const app = {
        getPath: jest.fn( () => {
            return '/Somewhere/Electron.app';
        } ),
        getName: jest.fn( () => 'Safe Browser' ),
        getVersion: jest.fn( () => 'v0.42.0' ),
    };

    return {
        require: jest.fn(),
        match: jest.fn(),
        app,
        remote: {
            process: {
                execPath: process.execPath,
            },
            getGlobal: jest.fn(),
            app,
        },
        dialog: jest.fn(),
    };
} );

describe( 'shouldBlockRequestForPage', () => {
    it( 'exists', () => {
        expect( shouldBlockRequestForPage ).not.toBeNull();
    } );

    it( 'blocks requests from another site w/o version', () => {
        expect(
            shouldBlockRequestForPage( 'safe://elsewhere/thing.png', 'safe://mysite' )
        ).toBeTruthy();
    } );

    it( ' does not block requests from the browser itself', () => {
        expect(
            shouldBlockRequestForPage( 'https://localhost:3132/thing.png', '' )
        ).toBeFalsy();
    } );

    it( 'blocks invalid URL reqs', () => {
        expect(
            shouldBlockRequestForPage( INVALID_URL, 'safe://mysite' )
        ).toBeTruthy();
    } );
    it( 'allows requests from another site w/ version', () => {
        expect(
            shouldBlockRequestForPage(
                'safe://elsewhere/thing.png?v=2',
                'safe://mysite'
            )
        ).toBeFalsy();
    } );

    it( 'blocks http/s reqs', () => {
        expect(
            shouldBlockRequestForPage( 'http:blaaa', 'safe://mysite' )
        ).toBeTruthy();
        expect(
            shouldBlockRequestForPage( 'http://blaaa', 'safe://mysite' )
        ).toBeTruthy();
        expect(
            shouldBlockRequestForPage( 'https:blaaa', 'safe://mysite' )
        ).toBeTruthy();
        expect(
            shouldBlockRequestForPage( 'https://blaaa', 'safe://mysite' )
        ).toBeTruthy();
    } );
} );

describe( 'getSourcePageUrl', () => {
    it( 'should return the page url when same webId is found', () => {
        const mockStore = {
            getState: jest.fn( () => ( {
                tabs: {
                    aTab: {
                        webContentsId: 22,
                        url: 'safe://mysite',
                    },
                },
            } ) ),
        };

        const mockDetails = {
            headers: {
                'User-Agent': 'blabal; webContentsId: 22',
            },
        };

        expect( getSourcePageUrl( mockDetails, mockStore ) ).toBe( 'safe://mysite' );
    } );
    it( 'should return an empty string when no page w/ webId is found', () => {
        const mockStore = {
            getState: jest.fn( () => ( {
                tabs: {
                    aTab: {
                        webContentsId: 22,
                        url: 'safe://mysite',
                    },
                },
            } ) ),
        };

        const mockDetails = {
            headers: {
                'User-Agent': 'blabal; webContentsId: 44',
            },
        };

        expect( getSourcePageUrl( mockDetails, mockStore ) ).toBe( '' );
    } );
} );

describe( 'redirectUrlIfNeeded', () => {
    it( 'should redirect to file if .app is present in req url', () => {
        expect( redirectUrlIfNeeded ).not.toBeNull();

        const appUrl =
      'safe://dweb/Users/josh/Projects/safe/forks/browser/node_modules/electron/dist/Electron.app/Contents/Resources/electron.asar/browser/api/module-list.js.map';

        expect( redirectUrlIfNeeded( appUrl ) ).toMatchObject( {
            shouldRedirect: true,
            redirectURL:
        'file:///Somewhere/Electron.app/Contents/Resources/electron.asar/browser/api/module-list.js.map',
        } );
    } );

    it( 'should return the same url if standard safe', () => {
        expect( redirectUrlIfNeeded( 'safe://hithere' ) ).toMatchObject( {
            shouldRedirect: false,
        } );
    } );
} );

describe( 'mapPageResourceToPageVersion', () => {
    it( 'should not change version on a versioned site', () => {
        expect(
            mapPageResourceToPageVersion(
                'safe://mysite?v=102',
                'safe://mysite/jpg?v=100'
            )
        ).toEqual( 'safe://mysite/jpg?v=100' );
    } );

    it( 'should change version of an unversioned resource when same site and thats versioned ', () => {
        expect(
            mapPageResourceToPageVersion(
                'safe://mysite?v=2',
                'safe://mysite/css/bla.jpg'
            )
        ).toEqual( 'safe://mysite/css/bla.jpg?v=2' );
    } );

    it( 'should change version of an unversioned resource when on unversioned same site', () => {
        expect(
            mapPageResourceToPageVersion( 'safe://mysite', 'safe://mysite/css/bla.jpg' )
        ).toEqual( 'safe://mysite/css/bla.jpg' );
    } );

    it( 'should not change version of an unversioned resource form a different site', () => {
        expect(
            mapPageResourceToPageVersion( 'safe://mysite?v=2', 'safe://nowhere.jpg' )
        ).toEqual( 'safe://nowhere.jpg' );
    } );
} );

// integration of all of the above...
describe( 'manageAndModifyRequest', () => {
    const store = {
        getState: jest.fn( () => ( {
            tabs: {
                someTab: {
                    webContentsId: 1,
                    url: 'safe://same',
                },
            },
        } ) ),
    };
    let callback = jest.fn();
    const details = {
        url: `${SERVER}/safe://same/main.42ea068a.js`,
        headers: {
            'User-Agent': 'blabla; webContentsId: 1',
        },
    };

    beforeEach( () => {
        callback = jest.fn();
    } );

    it( 'should allow javascript files from same site', () => {
        manageAndModifyRequest( details, callback, store );
        expect( callback ).not.toHaveBeenCalledWith( { cancel: true } );
        expect( callback ).not.toHaveBeenCalledWith( { redirect: true } );
    } );

    it( 'should allow css files from same site', () => {
        details.url = `${SERVER}/safe://same/main.bla.css`;

        manageAndModifyRequest( details, callback, store );
        expect( callback ).not.toHaveBeenCalledWith( { cancel: true } );
        expect( callback ).not.toHaveBeenCalledWith( { redirect: true } );
    } );

    it( 'should block css files from different site', () => {
        details.url = `${SERVER}/safe://other/main.bla.js`;
        manageAndModifyRequest( details, callback, store );
        expect( callback ).toHaveBeenCalledWith( { cancel: true } );
        expect( callback ).not.toHaveBeenCalledWith( { redirect: true } );
    } );
    it( 'should block javascript files from different site', () => {
        details.url = `${SERVER}/safe://other/main.bla.css`;
        manageAndModifyRequest( details, callback, store );
        expect( callback ).toHaveBeenCalledWith( { cancel: true } );
        expect( callback ).not.toHaveBeenCalledWith( { redirect: true } );
    } );

    it( 'should redirect app url', () => {
        details.url = `${SERVER}/safe://dweb/Users/josh/Projects/safe/forks/browser/node_modules/electron/dist/Electron.app/Contents/Resources/electron.asar/browser/api/module-list.js.map`;

        manageAndModifyRequest( details, callback, store );
        expect( callback ).not.toHaveBeenCalledWith( { cancel: true } );
        expect( callback ).toHaveBeenCalledWith( {
            redirectURL:
        'file:///Somewhere/Electron.app/Contents/Resources/electron.asar/browser/api/module-list.js.map',
        } );
    } );
} );
