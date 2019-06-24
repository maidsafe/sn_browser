import * as history from '$Actions/history_actions';

const date = new Date().toLocaleDateString();

describe( 'history actions', () => {
    it( 'should have types', () => {
        expect( history.TYPES ).toBeDefined();
    } );

    it( 'should update history', () => {
        const payload = {
            history: {
                [date]: [
                    { url: 'safe-auth://home/#/login', timeStamp: 1559635322450 },
                    { url: 'safe://cat.ashi', timeStamp: 1559635322111 },
                    { url: 'safe://home.dgeddes', timeStamp: 1559635322123 },
                    { url: 'safe://eye.eye', timeStamp: 1559635322345 },
                    { url: 'safe://safenetworkprimer', timeStamp: 1559635322456 },
                    { url: 'safe://typer.game', timeStamp: 1559635322678 }
                ],
                '10/11/2019': [
                    {
                        url: 'safe://another-another-url',
                        timeStamp: 1469635322567
                    },
                    {
                        url: 'safe://another-url',
                        timeStamp: 1239635322567
                    }
                ]
            }
        };
        const expectedAction = {
            type: history.TYPES.UPDATE_HISTORY_STATE,
            payload
        };
        expect( history.updateHistoryState( payload ) ).toEqual( expectedAction );
    } );
} );
