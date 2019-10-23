import * as pWeb from '$Extensions/safe/actions/pWeb_actions';

const date = new Date().toLocaleDateString();

describe( 'pWeb actions', () => {
    it( 'should have types', () => {
        expect( pWeb.TYPES ).toBeDefined();
    } );

    it( 'should set known version', () => {
        const payload = {
            url: 'x',
            version: 2
        };
        const expectedAction = {
            type: pWeb.TYPES.SET_KNOWN_VERSIONS_FOR_URL,
            payload
        };
        expect( pWeb.setKnownVersionsForUrl( payload ) ).toEqual( expectedAction );
    } );

    it( 'should set url as owned', () => {
        const payload = {
            url: 'x'
        };

        const expectedAction = {
            type: pWeb.TYPES.SET_NAME_AS_MY_SITE,
            payload
        };
        expect( pWeb.setNameAsMySite( payload ) ).toEqual( expectedAction );
    } );
} );
