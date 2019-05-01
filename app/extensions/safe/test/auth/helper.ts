import crypto from 'crypto';
import client from '../../ffi/authenticator';

/* eslint-disable import/prefer-default-export */
export const getRandomCredentials = () => ( {
    locator: crypto
        .randomBytes( 32 )
        .toString( 'hex' )
        .slice( 0, 15 ),
    secret: crypto
        .randomBytes( 32 )
        .toString( 'hex' )
        .slice( 0, 15 ),
    invite: crypto.randomBytes( 10 ).toString( 'hex' )
} );

export const createRandomAccount = async (): Promise<
| {
    locator: string;
    secret: string;
    invite: string;
}
| Error
> => {
    const randomCredentials = getRandomCredentials();

    try {
        await client.createAccount(
            randomCredentials.locator,
            randomCredentials.secret,
            randomCredentials.invite
        );
        return randomCredentials;
    } catch ( e ) {
        console.error( 'helper/createRandom error:', e );
        return e;
    }
};

export const clearAccount = async () => {
    const out = await client.logout();
    return out;
};
