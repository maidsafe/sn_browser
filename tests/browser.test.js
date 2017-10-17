import {Application} from 'spectron'
import os from 'os'
import path from 'path'
import fs from 'fs'
import electron from 'electron'
import { UI, COPY } from './lib/constants'
import * as browserdriver from './lib/browser-driver'

const app = new Application({
  path: electron,
  args: ['./app'],
  env: {
    beaker_no_welcome_tab: 1,
    beaker_user_data_path: fs.mkdtempSync(os.tmpdir() + path.sep + 'beaker-test-')
  }
})

beforeAll( async() => {
  await app.start()
  await app.client.waitUntilWindowLoaded()
});


afterAll('cleanup', async t => await app.stop())

test('window loaded', async () => await app.browserWindow.isVisible() )
test('cannot open http pages', async () => {
  var tabIndex = await browserdriver.newTab(app)
  await browserdriver.navigateTo(app, 'http://example.com/')
  await app.client.windowByIndex(tabIndex)

  let url = await app.client.getUrl()
  expect( url ).toBe( 'beaker:start' )
})
test('cannot open https pages', async () => {
  var tabIndex = await browserdriver.newTab(app)
  await browserdriver.navigateTo(app, 'https://example.com/')
  await app.client.windowByIndex(tabIndex)

  let url = await app.client.getUrl()
  expect( url ).toBe( 'beaker:start' )
})

test('can open safe pages', async () => {
  var safeUrl = 'safe://somewhere/'
  var tabIndex = await browserdriver.newTab(app)
  await browserdriver.navigateTo(app, safeUrl)
  await app.client.windowByIndex(tabIndex)

  let url = await app.client.getUrl()

  expect( url ).toBe( safeUrl )
})

describe( 'SAFE Network integration', async() =>
{
  afterEach( async() =>
  {
    await browserdriver.logout(app);
  }, 5000)

  test('can create new account and auth the browser', async () => {

    await browserdriver.createAccount(app)

    app.client.windowByIndex(0) // get root shell window
    await app.client.waitForExist(UI.ALLOW_BUTTON)
    await app.client.click(UI.ALLOW_BUTTON)

    await browserdriver.setAppToAuthTab(app)
    await app.client.waitForExist( UI.AUTH_APP_LIST )

    expect( await app.client.isExisting( UI.AUTH_APP_LIST ) ).toBeTruthy()
    expect( await app.client.isExisting(UI.AUTH_APP_NAME) ).toBeTruthy()

    expect( await app.client.getText(UI.AUTH_APP_NAME) ).toBe( COPY.BROWSER_APP_NAME )
  })

  // timeout set at end of test, as this is LONG
  test('can execute beaker-safe-app tests', async () => {

    await browserdriver.login(app)
    var testUrl = 'localhost://p:3001/'
    var tabIndex = await browserdriver.newTab(app)

    await browserdriver.navigateTo(app, testUrl)
    await app.client.windowByIndex(tabIndex)

    let url = await app.client.getUrl()
    expect( url ).toBe( testUrl )

    app.client.windowByIndex(0) // get root shell window

    // Six times we need confirmation for beaker-plugin tests
    await app.client.waitForExist(UI.ALLOW_BUTTON)
    await app.client.click(UI.ALLOW_BUTTON)
    await app.client.waitForExist(UI.ALLOW_BUTTON)
    await app.client.click(UI.ALLOW_BUTTON)
    await app.client.waitForExist(UI.ALLOW_BUTTON)
    await app.client.click(UI.ALLOW_BUTTON)
    await app.client.waitForExist(UI.ALLOW_BUTTON)
    await app.client.click(UI.ALLOW_BUTTON)
    await app.client.waitForExist(UI.ALLOW_BUTTON)
    await app.client.click(UI.ALLOW_BUTTON)
    await app.client.waitForExist(UI.ALLOW_BUTTON)
    await app.client.click(UI.ALLOW_BUTTON)

    // back to the tab in question
    await app.client.windowByIndex(tabIndex)

    expect( await app.client.isExisting( UI.BROWSER_PLUGIN_TEST_FAILURES ) ).toBeTruthy()
    expect( await app.client.getText(UI.BROWSER_PLUGIN_TEST_FAILURES) ).toBe( COPY.BROWSER_PLUGIN_FAILURES )

  }, 30000)
})
