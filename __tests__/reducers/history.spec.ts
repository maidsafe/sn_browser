import { history } from '$Reducers/history';
import { TYPES as TABS_TYPES } from '$Actions/tabs_actions';
import { initialAppState } from '$Reducers/initialAppState';

const initialState = initialAppState.history;

const date = new Date().toLocaleDateString();

describe( 'history reducer', () => {
    it( 'add an initial url', () => {
        const state = {};
        const newState = history( state, {
            type: TABS_TYPES.UPDATE_TAB_URL,
            payload: {
                url: 'another-url'
            }
        } );

        expect( newState ).not.toStrictEqual( state );
        expect( newState ).toEqual( {
            [date]: [
                {
                    url: 'safe://another-url',
                    timeStamp: new Date().toLocaleTimeString()
                }
            ]
        } );
    } );
    it( 'add another url', () => {
        const state = {
            [date]: [
                {
                    url: 'safe://another-url',
                    timeStamp: '2:20:28 PM'
                }
            ]
        };
        const newState = history( state, {
            type: TABS_TYPES.UPDATE_TAB_URL,
            payload: {
                url: 'another-another-url'
            }
        } );

        expect( newState ).not.toStrictEqual( state );
        expect( newState ).toEqual( {
            [date]: [
                {
                    url: 'safe://another-another-url',
                    timeStamp: new Date().toLocaleTimeString()
                },
                {
                    url: 'safe://another-url',
                    timeStamp: '2:20:28 PM'
                }
            ]
        } );
    } );

    it( 'state should be the same if the same url is passed', () => {
        const state = {
            [date]: [
                {
                    url: 'safe://another-another-url',
                    timeStamp: new Date().toLocaleTimeString()
                },
                {
                    url: 'safe://another-url',
                    timeStamp: '2:20:28 PM'
                }
            ]
        };
        const newState = history( state, {
            type: TABS_TYPES.UPDATE_TAB_URL,
            payload: {
                url: 'another-another-url'
            }
        } );

        expect( newState ).toStrictEqual( state );
    } );

    it( 'add pass a different url with a different date', () => {
        const state = {
            '5/21/2019': [
                {
                    url: 'safe://another-another-url',
                    timeStamp: '4:45:69 PM'
                },
                {
                    url: 'safe://another-url',
                    timeStamp: '2:20:28 PM'
                }
            ],
            [date]: [
                {
                    url: 'safe://hello',
                    timeStamp: '2:25:29 PM'
                }
            ]
        };

        const newState = history( state, {
            type: TABS_TYPES.UPDATE_TAB_URL,
            payload: {
                url: 'helloAgain'
            }
        } );

        expect( newState ).not.toStrictEqual( state );
        expect( newState ).toEqual( {
            [date]: [
                {
                    url: 'safe://helloAgain',
                    timeStamp: new Date().toLocaleTimeString()
                },
                {
                    url: 'safe://hello',
                    timeStamp: '2:25:29 PM'
                }
            ],
            '5/21/2019': [
                {
                    url: 'safe://another-another-url',
                    timeStamp: '4:45:69 PM'
                },
                {
                    url: 'safe://another-url',
                    timeStamp: '2:20:28 PM'
                }
            ]
        } );
    } );

    it( 'should ResetStore', () => {
        const state = {
            [date]: [
                {
                    url: 'safe://helloAgain',
                    timeStamp: new Date().toLocaleTimeString()
                },
                {
                    url: 'safe://hello',
                    timeStamp: '2:25:29 PM'
                }
            ],
            '5/21/2019': [
                {
                    url: 'safe://another-another-url',
                    timeStamp: '4:45:69 PM'
                },
                {
                    url: 'safe://another-url',
                    timeStamp: '2:20:28 PM'
                }
            ]
        };

        const newState = history( state, {
            type: TABS_TYPES.TABS_RESET_STORE
        } );

        expect( newState ).toStrictEqual( initialState );
    } );
} );
