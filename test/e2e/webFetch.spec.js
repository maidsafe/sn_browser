import { Application } from 'spectron';
import electron from 'electron';
import path from 'path';
import { parse as urlParse } from 'url';
import {removeTrailingSlash} from 'utils/urlHelpers';
import {
    navigateTo,
    newTab,
    setClientToMainBrowserWindow,
    setClientToBackgroundProcessWindow
} from './lib/browser-driver';
import { BROWSER_UI, AUTH_UI } from './lib/constants';
import { initializeApp } from '@maidsafe/safe-node-app';
const TAG_TYPE_DNS = 15001;
const TAG_TYPE_WWW = 15002;

jest.unmock('electron')

jasmine.DEFAULT_TIMEOUT_INTERVAL = 25000;

const delay = time => new Promise( resolve => setTimeout( resolve, time ) );

const createRandomDomain = async (content, path, service, authedApp) => {
    const domain = `test_${Math.round(Math.random() * 100000)}`;
    const app = authedApp;
    return app.mutableData.newRandomPublic( TAG_TYPE_WWW )
      .then((serviceMdata) => serviceMdata.quickSetup()
        .then(() => {
          const nfs = serviceMdata.emulateAs('NFS');
          // let's write the file
          return nfs.create(content)
            .then((file) => nfs.insert(path || '/index.html', file))
            .then(() => app.crypto.sha3Hash(domain)
              .then((dnsName) => app.mutableData.newPublic(dnsName, TAG_TYPE_DNS)
                .then((dnsData) => serviceMdata.getNameAndTag()
                    .then((res) => {
                      const payload = {};
                      payload[service || 'www'] = res.name;
                      return dnsData.quickSetup(payload);
                    }))));
        }))
      .then(() => domain);
};

describe( 'SAFE network webFetch operation', async () =>
{
    let safeApp;
    const app = new Application( {
        path : electron,
        args : [path.join( __dirname, '..', '..', 'app' )],
        env  : {
            IS_SPECTRON: true
        }
    } );

    const appInfo = {
        id: "net.peruse.test",
        name: 'SAFE App Test',
        vendor: 'Peruse'
    };


    beforeAll( async () =>
    {
        safeApp = await initializeApp(appInfo);

        await safeApp.auth.loginForTest();
        await app.start();
        await setClientToMainBrowserWindow( app );
        await app.client.waitUntilWindowLoaded();
    } );

    afterAll( () =>
    {
        if ( app && app.isRunning() )
        {
            return app.stop();
        }
    } );

    it( 'fetches content from network', async () =>
    {
        expect.assertions(1);
        const content = `hello world, on ${Math.round(Math.random() * 100000)}`;
    	const domain = await createRandomDomain(content, '', '', safeApp);
    	const data = await safeApp.webFetch(`safe://${domain}`);

    	expect(data.body.toString()).toBe(content );
    } );
} );
