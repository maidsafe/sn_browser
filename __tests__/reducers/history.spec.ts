import { history } from '$Reducers/history';
import { TYPES as TABS_TYPES } from '$Actions/tabs_actions';
import { initialAppState } from '$Reducers/initialAppState';

const initialState = initialAppState.history;

const date = new Date().toLocaleDateString();

describe( 'history reducer', () => {
    it( 'add an initial url', () => {
        const state = {};
        const timeStamp = new Date().getTime();
        const newState = history( state, {
            type: TABS_TYPES.UPDATE_TAB_URL,
            payload: {
                url: 'another-url',
                timeStamp
            }
        } );

        expect( newState ).not.toStrictEqual( state );
        expect( newState ).toEqual( {
            [date]: [
                {
                    url: 'safe://another-url',
                    timeStamp
                }
            ]
        } );
    } );
    it( 'add another url', () => {
        const state = {
            [date]: [
                {
                    url: 'safe://another-url',
                    timeStamp: 1559635003845
                }
            ]
        };
        const timeStamp = new Date().getTime();
        const newState = history( state, {
            type: TABS_TYPES.UPDATE_TAB_URL,
            payload: {
                url: 'another-another-url',
                timeStamp
            }
        } );

        expect( newState ).not.toStrictEqual( state );
        expect( newState ).toEqual( {
            [date]: [
                {
                    url: 'safe://another-another-url',
                    timeStamp
                },
                {
                    url: 'safe://another-url',
                    timeStamp: 1559635003845
                }
            ]
        } );
    } );

    it( 'state should have the new timeStamp if the same url is passed', () => {
        const state = {
            [date]: [
                {
                    url: 'safe://another-another-url',
                    timeStamp: 1559635306833
                },
                {
                    url: 'safe://another-url',
                    timeStamp: 1559635306845
                }
            ]
        };
        const timeStamp = new Date().getTime();
        const newState = history( state, {
            type: TABS_TYPES.UPDATE_TAB_URL,
            payload: {
                url: 'another-another-url',
                timeStamp
            }
        } );

        expect( newState ).not.toStrictEqual( state );
        expect( newState ).toEqual( {
            [date]: [
                {
                    url: 'safe://another-another-url',
                    timeStamp
                },
                {
                    url: 'safe://another-url',
                    timeStamp: 1559635306845
                }
            ]
        } );
    } );

    it( 'add pass a different url with a different date', () => {
        const state = {
            '5/21/2019': [
                {
                    url: 'safe://another-another-url',
                    timeStamp: 1559635306845
                },
                {
                    url: 'safe://another-url',
                    timeStamp: 1559635322845
                }
            ],
            [date]: [
                {
                    url: 'safe://hello',
                    timeStamp: 1559635306858
                }
            ]
        };

        const timeStamp = new Date().getTime();
        const newState = history( state, {
            type: TABS_TYPES.UPDATE_TAB_URL,
            payload: {
                url: 'helloAgain',
                timeStamp
            }
        } );

        expect( newState ).not.toStrictEqual( state );
        expect( newState ).toEqual( {
            [date]: [
                {
                    url: 'safe://helloAgain',
                    timeStamp
                },
                {
                    url: 'safe://hello',
                    timeStamp: 1559635306858
                }
            ],
            '5/21/2019': [
                {
                    url: 'safe://another-another-url',
                    timeStamp: 1559635306845
                },
                {
                    url: 'safe://another-url',
                    timeStamp: 1559635322845
                }
            ]
        } );
    } );

    it( 'should ResetStore', () => {
        const state = {
            [date]: [
                {
                    url: 'safe://helloAgain',
                    timeStamp: 1559635322225
                },
                {
                    url: 'safe://hello',
                    timeStamp: 1559635322845
                }
            ],
            '5/21/2019': [
                {
                    url: 'safe://another-another-url',
                    timeStamp: 1469635322845
                },
                {
                    url: 'safe://another-url',
                    timeStamp: 1239635322845
                }
            ]
        };

        const newState = history( state, {
            type: TABS_TYPES.TABS_RESET_STORE
        } );

        expect( newState ).toStrictEqual( initialState );
    } );
} );
