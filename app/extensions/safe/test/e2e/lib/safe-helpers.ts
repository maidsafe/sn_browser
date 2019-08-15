import { logger } from '$Logger';

const TAG_TYPE_DNS = 15001;
const TAG_TYPE_WWW = 15002;

export const createSafeApp = async ( appInfo ) => {
    logger.info( 'should be creating safe app' );
    // const safeApp = await initialiseApp( appInfo, null, { forceUseMock: true } );
    //
    // return safeApp;
};

export const createRandomDomain = async ( content, path, service, authedApp ) => {
    const domain = `test_${Math.round( Math.random() * 100000 )}`;
    const app = authedApp;
    return app.mutableData
        .newRandomPublic( TAG_TYPE_WWW )
        .then( ( serviceMdata ) =>
            serviceMdata.quickSetup().then( () => {
                console.info( 'GET NAME AND TAG?', serviceMdata );
                const nfs = serviceMdata.emulateAs( 'NFS' );
                // let's write the file
                return nfs
                    .create( content )
                    .then( ( file ) => nfs.insert( path || '/index.html', file ) )
                    .then( () =>
                        app.crypto.sha3Hash( domain ).then( ( dnsName ) =>
                            app.mutableData.newPublic( dnsName, TAG_TYPE_DNS ).then( ( dnsData ) =>
                                serviceMdata.getNameAndTag().then( ( res ) => {
                                    const payload = {};
                                    payload[service || 'www'] = res.name;
                                    return dnsData.quickSetup( payload );
                                } )
                            )
                        )
                    );
            } )
        )
        .then( () => domain );
};
