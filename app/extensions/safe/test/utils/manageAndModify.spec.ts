import {
    shouldBlockRequestForPage,
    getSourcePageUrl,
    redirectUrlIfNeeded,
    mapPageResourceToPageVersion,
    INVALID_URL
} from '$Extensions/safe/manageAndModifyRequests';

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
                        url: 'safe://mysite'
                    }
                }
            } ) )
        };

        const mockDetails = {
            headers: {
                'User-Agent': 'blabal; webContentsId: 22'
            }
        };

        expect( getSourcePageUrl( mockDetails, mockStore ) ).toBe( 'safe://mysite' );
    } );
    it( 'should return an empty string when no page w/ webId is found', () => {
        const mockStore = {
            getState: jest.fn( () => ( {
                tabs: {
                    aTab: {
                        webContentsId: 22,
                        url: 'safe://mysite'
                    }
                }
            } ) )
        };

        const mockDetails = {
            headers: {
                'User-Agent': 'blabal; webContentsId: 44'
            }
        };

        expect( getSourcePageUrl( mockDetails, mockStore ) ).toBe( '' );
    } );
} );

describe( 'redirectUrlIfNeeded', () => {
    it( 'should redirect to file if .app is present in req url', () => {
        expect( redirectUrlIfNeeded ).not.toBeNull();

        const appUrl = 'osLocation.app/bla/blablabla';
        expect( redirectUrlIfNeeded( appUrl, 'osLocation.app', 'darwin' ) ).toMatch(
            'file://'
        );
        expect( redirectUrlIfNeeded( appUrl, 'osLocation.app', 'darwin' ) ).toMatch(
            '.app'
        );
    } );

    it( 'should return the same url if standard safe', () => {
        expect( redirectUrlIfNeeded( 'safe://hithere', 'osLocation.app' ) ).toEqual(
            'safe://hithere'
        );
        expect(
            redirectUrlIfNeeded( 'safe://hithere', 'osLocation.app', 'darwin' )
        ).toEqual( 'safe://hithere' );
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

    it( 'should change version of an unversioned resource when same site', () => {
        expect(
            mapPageResourceToPageVersion(
                'safe://mysite?v=2',
                'safe://mysite/css/bla.jpg'
            )
        ).toEqual( 'safe://mysite/css/bla.jpg?v=2' );
    } );

    // it('should change version of an unversioned resource when same site', () => {
    // expect(mapPageResourceToPageVersion('safe://mysite?v=2', 'safe://mysite/jpg'))
    // .toEqual('safe://mysite/jpg?v=2')
    // })
    it( 'should not change version of an unversioned resource form a different site', () => {
        expect(
            mapPageResourceToPageVersion( 'safe://mysite?v=2', 'safe://nowhere/jpg' )
        ).toEqual( 'safe://nowhere/jpg' );
    } );
} );
