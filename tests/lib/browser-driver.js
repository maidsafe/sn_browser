import { UI, COPY } from './constants'

export const navigateTo = function (app, url) {
  return app.client.windowByIndex(0)
    .then(() => app.client.waitForExist('.toolbar-actions:not(.hidden) .nav-location-input', 10e3))
    .then(() => {
      return app.client.click('.toolbar-actions:not(.hidden) .nav-location-pretty')
      .catch(() => app.client.click('.toolbar-actions:not(.hidden) .nav-location-input'))
    })
    .then(() => app.client.pause(500)) // need to wait a sec for the UI to catch up
    .then(() => app.client.keys('\uE003')) // backspace
    .then(() => app.client.setValue('.toolbar-actions:not(.hidden) .nav-location-input', url))
    .then(() => app.client.pause(500)) // need to wait a sec for the UI to catch up
    .then(() => app.client.keys('\uE007')) // enter
}

export const newTab = function (app) {
  var index
  return app.client.windowByIndex(0)
    .then(() => app.client.getWindowCount())
    .then(count => {
      index = count
      return app.client.click('.chrome-tab-add-btn')
    })
    .then(() => app.client.waitUntilWindowLoaded(index))
    .then(() => index)
}

export const setAppToAuthTab = async(app) =>
{
  let tabIndex = 1; // always the second window in tabs array
  await app.client.windowByIndex(tabIndex)

  return;
}

const secret = Math.random().toString(36);
const password = Math.random().toString(36);

export const createAccount = async( app ) =>{
  await setAppToAuthTab( app )
  await app.client.waitForExist(UI.AUTH_FORM)

  await app.client.click(UI.START_CREATE_BUTTON)
  await app.client.click(UI.AUTH_CREATE_ACCOUNT_CONTINUE)

  await app.client.click(UI.AUTH_INVITE_CODE_INPUT)
  await app.client.keys(secret) // mock, so invite does not matter
  await app.client.click(UI.AUTH_CREATE_ACCOUNT_CONTINUE)

  // auth secret
  await app.client.waitForExist(UI.AUTH_SECRET_INPUT)
  await app.client.click(UI.AUTH_SECRET_INPUT)
  await app.client.keys(secret)
  await app.client.click(UI.AUTH_CONFIRM_SECRET_INPUT)
  await app.client.keys(secret)

  //continue
  await app.client.click(UI.AUTH_CREATE_ACCOUNT_CONTINUE)

  // auth pass
  await app.client.waitForExist(UI.AUTH_PASSWORD_INPUT)
  await app.client.click(UI.AUTH_PASSWORD_INPUT)
  await app.client.keys(password)
  await app.client.click(UI.AUTH_CONFIRM_PASSWORD_INPUT)
  await app.client.keys(password)

  //continue
  await app.client.click(UI.AUTH_CREATE_ACCOUNT_CONTINUE)

  return;
}

export const logout = async( app ) =>{
  await setAppToAuthTab(app);
  await app.client.waitForExist(UI.AUTH_LOGOUT_BUTTON);
  await app.client.click(UI.AUTH_LOGOUT_BUTTON);
  await app.client.waitForExist(UI.START_CREATE_BUTTON);

  return;
}


export const login = async( app ) =>{
  await setAppToAuthTab(app);
  await app.client.waitForExist(UI.AUTH_FORM)
  await app.client.click(UI.AUTH_SECRET_INPUT)
  await app.client.keys(secret)
  await app.client.click(UI.AUTH_PASSWORD_INPUT)
  await app.client.keys(password)
  await app.client.click(UI.AUTH_LOGIN_BUTTON)
  return;
}
