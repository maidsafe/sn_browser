import crypto from 'crypto';
import client from '../../ffi/authenticator';

/* eslint-disable import/prefer-default-export */
export const getRandomCredentials = () => (
    /* eslint-disable import/prefer-default-export */
    {
        locator : crypto.randomBytes( 32 ).toString( 'hex' ).slice( 0, 15 ),
        secret  : crypto.randomBytes( 32 ).toString( 'hex' ).slice( 0, 15 ),
        invite  : crypto.randomBytes( 10 ).toString( 'hex' )
    }
);

export const createRandomAccount = async () =>
{
    const randomCredentials = getRandomCredentials();

    try
    {
        await client.createAccount(
            randomCredentials.locator,
            randomCredentials.secret,
            randomCredentials.invite
        );
        return randomCredentials;
    }
    catch ( e )
    {
        console.log( 'helper/createRandom error:', e );
    }
};

export const clearAccount = async () =>
{
    const out = await client.logout();
    return out;
};
