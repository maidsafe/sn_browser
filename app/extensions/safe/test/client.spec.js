/* eslint-disable no-underscore-dangle */
import crypto from 'crypto';
import i18n from 'i18n';
import client, { Authenticator } from '../ffi/authenticator';
import * as helper from './helper';
import CONST from '../auth-constants';

const to = helper.to;

describe('Authenticator Client', () => {
  let randomCredentials = null;
  const encodedAuthUri = 'safe-auth:AAAAAAgMpeUAAAAAHgAAAAAAAABuZXQubWFpZHNhZmUuZXhh' +
  'bXBsZXMudGVzdC1hcHAAEAAAAAAAAABTQUZFIGV4YW1wbGUgQXBwEQAAAAAAAABNYWlkU2FmZS5uZXQgTHR' +
  'kLgEDAAAAAAAAAAoAAAAAAAAAX2Rvd25sb2FkcwUAAAAAAAAAAAAAAAEAAAACAAAAAwAAAAQAAAAHAAAAAA' +
  'AAAF9wdWJsaWMFAAAAAAAAAAAAAAABAAAAAgAAAAMAAAAEAAAACgAAAAAAAABfZG9jdW1lbnRzBQAAAAAAA' +
  'AAAAAAAAQAAAAIAAAADAAAABAAAAA==';
  const encodedUnRegisterAuthUri = 'safe-auth:AAAAAKfmUZgCAAAA';
  const encodedContUri = 'safe-auth:AAAAAGGCe2cBAAAAHgAAAAAAAABuZXQubWFpZHNhZmUuZXhhbX' +
  'BsZXMudGVzdC1hcHAAEAAAAAAAAABTQUZFIGV4YW1wbGUgQXBwEQAAAAAAAABNYWlkU2FmZS5uZXQgTHRkLg' +
  'EAAAAAAAAADAAAAAAAAABfcHVibGljTmFtZXMFAAAAAAAAAAAAAAABAAAAAgAAAAMAAAAEAAAA';

  const decodedReqForRandomClient = (uri) => helper.createRandomAccount()
    .then(() => client.decodeRequest(uri));

  describe('Unregistered client', () => {
    it.skip('gets back encoded response', () => (
      new Promise((resolve) => {
        client.decodeRequest(encodedUnRegisterAuthUri)
          .then((res) => {
            should(res).be.String();
            should(res.indexOf('safe-')).be.not.equal(-1);
            return resolve();
          });
      })
    ));
  });

  describe('create Account', () => {
    after(() => helper.clearAccount());

    it('throws an error when account locator is empty', () => client.createAccount()
      .should.be.rejectedWith(Error)
      .then((err) => {
        should(err.message).be.equal(i18n.__('messages.should_not_be_empty', i18n.__('Locator')));
      })
    );

    it('throws error when account secret is empty', () => client.createAccount('test')
      .should.be.rejectedWith(Error)
      .then((err) => {
        should(err.message).be.equal(i18n.__('messages.should_not_be_empty', i18n.__('Secret')));
      })
    );

    it('throws an error when account locator is not string', () => client.createAccount(1111, 111)
      .should.be.rejectedWith(Error)
      .then((err) => {
        should(err.message).be.equal(i18n.__('messages.must_be_string', i18n.__('Locator')));
      })
    );

    it('throws an error when account secret is not string', () => client.createAccount('test', 111)
      .should.be.rejectedWith(Error)
      .then((err) => {
        should(err.message).be.equal(i18n.__('messages.must_be_string', i18n.__('Secret')));
      })
    );

    it('throws an error when account locator is empty string', () => client.createAccount(' ', 'test')
      .should.be.rejectedWith(Error)
      .then((err) => {
        should(err.message).be.equal(i18n.__('messages.should_not_be_empty', i18n.__('Locator')));
      })
    );

    it('throws an error when account secret is empty string', () => client.createAccount('test', ' ')
      .should.be.rejectedWith(Error)
      .then((err) => {
        should(err.message).be.equal(i18n.__('messages.should_not_be_empty', i18n.__('Secret')));
      })
    );

    it('sets authenticator handle when account creation is successful', () => {
      randomCredentials = helper.getRandomCredentials();
      return client.createAccount(randomCredentials.locator,
        randomCredentials.secret, randomCredentials.invite)
        .should.be.fulfilled()
        .then(() => {
          should(client.registeredClientHandle).not.be.empty();
          should(client.registeredClientHandle).not.be.null();
          should(client.registeredClientHandle).not.be.undefined();
          should(client.registeredClientHandle).be.instanceof(Buffer);
        });
    });

    it('emit network state as connected when account creation is successful', () => (
      new Promise((resolve) => {
        const nwListener = client.setListener(CONST.LISTENER_TYPES.NW_STATE_CHANGE,
          (err, state) => {
            should(err).be.null();
            should(state).not.be.undefined();
            should(state).be.equal(CONST.NETWORK_STATUS.CONNECTED);
            client.removeListener(CONST.LISTENER_TYPES.NW_STATE_CHANGE, nwListener);
            return resolve();
          });
        helper.createRandomAccount();
      }))
    );
  });

  describe('login', () => {
    before(() => helper.createRandomAccount()
      .then((credential) => { randomCredentials = credential; })
    );

    after(() => helper.clearAccount());

    it('throws an error when account locator is empty', () => client.login()
      .should.be.rejectedWith(Error)
      .then((err) => {
        should(err.message).be.equal(i18n.__('messages.should_not_be_empty', i18n.__('Locator')));
      })
    );

    it('throws an error when account secret is empty', () => client.login('test')
      .should.be.rejectedWith(Error)
      .then((err) => {
        should(err.message).be.equal(i18n.__('messages.should_not_be_empty', i18n.__('Secret')));
      })
    );

    it('throws an error when account locator is not string', () => client.login(1111, 111)
      .should.be.rejectedWith(Error)
      .then((err) => {
        should(err.message).be.equal(i18n.__('messages.must_be_string', i18n.__('Locator')));
      })
    );

    it('throws an error when account secret is not string', () => client.login('test', 111)
      .should.be.rejectedWith(Error)
      .then((err) => {
        should(err.message).be.equal(i18n.__('messages.must_be_string', i18n.__('Secret')));
      })
    );

    it('throws an error when account locator is empty string', () => client.login('  ', 'test')
      .should.be.rejectedWith(Error)
      .then((err) => {
        should(err.message).be.equal(i18n.__('messages.should_not_be_empty', i18n.__('Locator')));
      })
    );

    it('throws an error when account secret is empty string', () => client.login('test', '  ')
      .should.be.rejectedWith(Error)
      .then((err) => {
        should(err.message).be.equal(i18n.__('messages.should_not_be_empty', i18n.__('Secret')));
      })
    );

    it('sets authenticator handle when account login is successful', () => client.login(randomCredentials.locator,
      randomCredentials.secret)
      .should.be.fulfilled()
      .then(() => {
        should(client.registeredClientHandle).not.be.empty();
        should(client.registeredClientHandle).not.be.null();
        should(client.registeredClientHandle).not.be.undefined();
        should(client.registeredClientHandle).be.instanceof(Buffer);
      })
    );

    it('emit network state as connected when account login is successful', () => (
      new Promise((resolve) => {
        const nwListener = client.setListener(CONST.LISTENER_TYPES.NW_STATE_CHANGE,
          (err, state) => {
            should(err).be.null();
            should(state).not.be.undefined();
            should(state).be.equal(CONST.NETWORK_STATUS.CONNECTED);
            client.removeListener(CONST.LISTENER_TYPES.NW_STATE_CHANGE, nwListener);
            return resolve();
          });
        helper.createRandomAccount();
      }))
    );
  });

  describe('decrypt request', () => {
    before(() => helper.createRandomAccount());

    after(() => helper.clearAccount());

    it('throws an error when encoded URI is empty', () =>
      client.decodeRequest().should.be.rejected()
    );

    it('throws an error for container request of unknown app', () => (
      new Promise((resolve, reject) => {
        const contListener = client.setListener(CONST.LISTENER_TYPES.CONTAINER_REQ, (err, res) => {
          client.removeListener(CONST.LISTENER_TYPES.CONTAINER_REQ, contListener);
          reject(res);
        });

        const errListener = client.setListener(CONST.LISTENER_TYPES.REQUEST_ERR, (err) => {
          should(err).not.be.empty().and.be.String();
          client.removeListener(CONST.LISTENER_TYPES.REQUEST_ERR, errListener);
          resolve(err);
        });
        client.decodeRequest(encodedContUri);
      })
    ));

    it('throws an error for invalid URI', () => (
      new Promise((resolve, reject) => {
        const authListener = client.setListener(CONST.LISTENER_TYPES.AUTH_REQ, (err, res) => {
          client.removeListener(CONST.LISTENER_TYPES.AUTH_REQ, authListener);
          reject(res);
        });

        const errListener = client.setListener(CONST.LISTENER_TYPES.REQUEST_ERR, (err) => {
          client.removeListener(CONST.LISTENER_TYPES.REQUEST_ERR, errListener);
          resolve(err);
        });

        client.decodeRequest(`safe-auth:${crypto.randomBytes(32).toString('base64')}`);
      })
    ));

    it('returns a decoded request for encoded Auth request', () => (
      new Promise((resolve, reject) => {
        const authListener = client.setListener(CONST.LISTENER_TYPES.AUTH_REQ, (err, res) => {
          should(res).not.be.undefined().and.be.Object().and.not.empty().and.have.properties(['reqId', 'authReq']);
          should(res.reqId).not.be.undefined().and.be.Number();
          should(res.authReq).be.Object().and.not.empty().and.have.properties([
            'app',
            'app_container',
            'containers',
            'containers_len',
            'containers_cap']);
          should(res.authReq.app).be.Object().and.not.empty().and.have.properties([
            'id',
            'scope',
            'name',
            'vendor']);
          should(res.authReq.app.id).not.be.undefined().and.not.be.empty().and.be.String();
          should(res.authReq.app.name).not.be.undefined().and.not.be.empty().and.be.String();
          should(res.authReq.app.vendor).not.be.undefined().and.not.be.empty().and.be.String();
          should(res.authReq.app_container).not.be.undefined().and.be.Boolean();
          should(res.authReq.containers).not.be.undefined().and.be.Array();
          should(res.authReq.containers_len).not.be.undefined().and.be.Number();
          should(res.authReq.containers_cap).not.be.undefined().and.be.Number();

          if (res.authReq.containers_len > 0) {
            const container0 = res.authReq.containers[0];
            should(container0).be.Object().and.not.empty().and.have.properties([
              'cont_name',
              'access'
            ]);
            should(container0.cont_name).not.be.undefined().and.not.be.empty().and.be.String();
            should(container0.access).not.be.undefined().and.not.be.empty().and.be.Object();
          }
          client.removeListener(CONST.LISTENER_TYPES.AUTH_REQ, authListener);
          return resolve();
        });

        const errListener = client.setListener(CONST.LISTENER_TYPES.REQUEST_ERR, (err) => {
          client.removeListener(CONST.LISTENER_TYPES.REQUEST_ERR, errListener);
          reject(err);
        });

        client.decodeRequest(encodedAuthUri);
      })
    ));

    it('returns a decoded request for encoded Auth request without safe-auth: scheme', () => (
      new Promise((resolve, reject) => {
        const authListener = client.setListener(CONST.LISTENER_TYPES.AUTH_REQ, (err, res) => {
          should(res).not.be.undefined().and.be.Object().and.not.empty().and.have.properties(['reqId', 'authReq']);
          client.removeListener(CONST.LISTENER_TYPES.AUTH_REQ, authListener);
          return resolve();
        });

        const errListener = client.setListener(CONST.LISTENER_TYPES.REQUEST_ERR, (err) => {
          client.removeListener(CONST.LISTENER_TYPES.REQUEST_ERR, errListener);
          reject(err);
        });

        client.decodeRequest(encodedAuthUri.replace('safe-auth:', ''));
      })
    ));

    it('retuns a decoded request for encoded Container request', () => (
      new Promise((resolve, reject) => {
        const contListener = client.setListener(CONST.LISTENER_TYPES.CONTAINER_REQ, (err, res) => {
          should(res).not.be.undefined().and.be.Object().and.not.empty().and.have.properties(['reqId', 'contReq']);
          should(res.reqId).not.be.undefined().and.be.Number();
          should(res.contReq).be.Object().and.not.empty().and.have.properties([
            'app',
            'containers',
            'containers_len',
            'containers_cap']);
          should(res.contReq.app).be.Object().and.not.empty().and.have.properties([
            'id',
            'scope',
            'name',
            'vendor']);
          should(res.contReq.app.id).not.be.undefined().and.not.be.empty().and.be.String();
          // should(res.contReq.app.scope).not.be.undefined().and.be.String();
          should(res.contReq.app.name).not.be.undefined().and.not.be.empty().and.be.String();
          should(res.contReq.app.vendor).not.be.undefined().and.not.be.empty().and.be.String();
          should(res.contReq.containers).not.be.undefined().and.be.Array();
          should(res.contReq.containers_len).not.be.undefined().and.be.Number();
          should(res.contReq.containers_cap).not.be.undefined().and.be.Number();

          if (res.contReq.containers_len > 0) {
            const container0 = res.contReq.containers[0];
            should(container0).be.Object().and.not.empty().and.have.properties([
              'cont_name',
              'access'
            ]);
            should(container0.cont_name).not.be.undefined().and.not.be.empty().and.be.String();
            should(container0.access).not.be.undefined().and.not.be.empty().and.be.Object();
          }
          client.removeListener(CONST.LISTENER_TYPES.CONTAINER_REQ, contListener);
          return resolve();
        });

        const authL = client.setListener(CONST.LISTENER_TYPES.AUTH_REQ, (err, req) => {
          client.encodeAuthResp(req, true).then(() => client.decodeRequest(encodedContUri));
          client.removeListener(CONST.LISTENER_TYPES.AUTH_REQ, authL);
        });

        const errL = client.setListener(CONST.LISTENER_TYPES.REQUEST_ERR, (err) => {
          client.removeListener(CONST.LISTENER_TYPES.REQUEST_ERR, errL);
          reject(err);
        });

        client.decodeRequest(encodedAuthUri);
      }))
    );

    it('returns a decoded request for encoded Container request without safe-auth: scheme', () => (
      new Promise((resolve, reject) => {
        const contL = client.setListener(CONST.LISTENER_TYPES.CONTAINER_REQ, (err, res) => {
          should(res).not.be.undefined().and.be.Object().and.not.empty().and.have.properties(['reqId', 'contReq']);
          client.removeListener(CONST.LISTENER_TYPES.CONTAINER_REQ, contL);
          return resolve();
        });

        const authL = client.setListener(CONST.LISTENER_TYPES.AUTH_REQ, (err, req) => {
          client.removeListener(CONST.LISTENER_TYPES.AUTH_REQ, authL);
          reject(req);
        });

        const errL = client.setListener(CONST.LISTENER_TYPES.REQUEST_ERR, (err) => {
          client.removeListener(CONST.LISTENER_TYPES.REQUEST_ERR, errL);
          reject(err);
        });

        client.decodeRequest(encodedContUri);
      })
    ));
  });

  describe('encode auth response', () => {
    let decodedReq = null;
    const prepareReq = () => new Promise((resolve, reject) => {
      const authL = client.setListener(CONST.LISTENER_TYPES.AUTH_REQ, (err, req) => {
        decodedReq = req;
        client.removeListener(CONST.LISTENER_TYPES.AUTH_REQ, authL);
        return resolve();
      });

      const errL = client.setListener(CONST.LISTENER_TYPES.REQUEST_ERR, (err) => {
        client.removeListener(CONST.LISTENER_TYPES.REQUEST_ERR, errL);
        reject(err);
      });

      decodedReqForRandomClient(encodedAuthUri);
    });

    before(() => prepareReq());

    after(() => helper.clearAccount());

    it('throws an error if request is undefined', () => client.encodeAuthResp()
      .should.be.rejectedWith(Error)
      .then((err) => {
        should(err.message).be.equal(i18n.__('messages.invalid_params'));
      })
    );

    it('throws an error if decision is not boolean type', () => (
      Promise.all([
        client.encodeAuthResp({}, 123).should.be.rejectedWith(Error).then((err) => should(err.message).be.equal(i18n.__('messages.invalid_params'))),
        client.encodeAuthResp({}, 'string').should.be.rejectedWith(Error).then((err) => should(err.message).be.equal(i18n.__('messages.invalid_params'))),
        client.encodeAuthResp({}, { a: 1 }).should.be.rejectedWith(Error).then((err) => should(err.message).be.equal(i18n.__('messages.invalid_params'))),
        client.encodeAuthResp({}, [1, 2, 3]).should.be.rejectedWith(Error).then((err) => should(err.message).be.equal(i18n.__('messages.invalid_params'))),
        client.encodeAuthResp({}, [1, 2, 3]).should.be.rejectedWith(Error).then((err) => should(err.message).be.equal(i18n.__('messages.invalid_params')))
      ]))
    );

    it('throws an error if request doesn\'t have request ID(reqId)', () => client.encodeAuthResp({}, true)
      .should.be.rejectedWith(Error)
      .then((err) => should(err.message).be.equal(i18n.__('messages.invalid_req')))
    );

    it('throws an error when invalid request is passed', () => client.encodeAuthResp(Object.assign({}, decodedReq, { reqId: 123 }), true)
      .should.be.rejectedWith(Error)
      .then((err) => should(err.message).be.equal(i18n.__('messages.invalid_req')))
    );

    it('returns encoded response URI on success of deny', () => client.encodeAuthResp(decodedReq, false)
      .should.be.fulfilled()
      .then((res) => should(res).not.be.empty().and.be.String())
    );

    it('returns encoded response URI on success of allow', () => prepareReq()
      .then(() => client.encodeAuthResp(decodedReq, true))
      .should.be.fulfilled()
      .then((res) => should(res).not.be.empty().and.be.String())
    );
  });

  describe('encode container response', () => {
    let decodedReq = null;
    const prepareReq = () => new Promise((resolve, reject) => {
      const contListener = client.setListener(CONST.LISTENER_TYPES.CONTAINER_REQ, (err, req) => {
        decodedReq = req;
        client.removeListener(CONST.LISTENER_TYPES.CONTAINER_REQ, contListener);
        return resolve();
      });

      const authListener = client.setListener(CONST.LISTENER_TYPES.AUTH_REQ, (err, req) => {
        client.encodeAuthResp(req, true).then(() => client.decodeRequest(encodedContUri));
        client.removeListener(CONST.LISTENER_TYPES.AUTH_REQ, authListener);
      });

      const errListener = client.setListener(CONST.LISTENER_TYPES.REQUEST_ERR, (err) => {
        client.removeListener(CONST.LISTENER_TYPES.REQUEST_ERR, errListener);
        reject(err);
      });

      decodedReqForRandomClient(encodedAuthUri);
    });

    before(() => prepareReq());

    after(() => helper.clearAccount());

    it('throws an error if request is undefined', () => client.encodeContainersResp()
      .should.be.rejectedWith(Error)
      .then((err) => {
        should(err.message).be.equal(i18n.__('messages.invalid_params'));
      })
    );

    it('throws an error if decision is not boolean type', () => (
      Promise.all([
        client.encodeContainersResp({}, 123).should.be.rejectedWith(Error).then((err) => should(err.message).be.equal(i18n.__('messages.invalid_params'))),
        client.encodeContainersResp({}, 'string').should.be.rejectedWith(Error).then((err) => should(err.message).be.equal(i18n.__('messages.invalid_params'))),
        client.encodeContainersResp({}, { a: 1 }).should.be.rejectedWith(Error).then((err) => should(err.message).be.equal(i18n.__('messages.invalid_params'))),
        client.encodeContainersResp({}, [1, 2, 3]).should.be.rejectedWith(Error).then((err) => should(err.message).be.equal(i18n.__('messages.invalid_params'))),
        client.encodeContainersResp({}, [1, 2, 3]).should.be.rejectedWith(Error).then((err) => should(err.message).be.equal(i18n.__('messages.invalid_params')))
      ]))
    );

    it('throws an error if request doesn\'t have request ID(reqId)', () => client.encodeContainersResp({}, true)
      .should.be.rejectedWith(Error)
      .then((err) => should(err.message).be.equal(i18n.__('messages.invalid_req')))
    );

    it('throws an error when invalid request is passed', () => client.encodeContainersResp(Object.assign({}, decodedReq, { reqId: 123 }), true)
      .should.be.rejectedWith(Error)
      .then((err) => should(err.message).be.equal(i18n.__('messages.invalid_req')))
    );

    it('returns encoded response URI on success of deny', () => client.encodeContainersResp(decodedReq, false)
      .should.be.fulfilled()
      .then((res) => should(res).not.be.empty().and.be.String())
    );

    it('returns encoded response URI on success of allow', () => prepareReq()
      .then(() => client.encodeContainersResp(decodedReq, true))
      .should.be.fulfilled()
      .then((res) => should(res).not.be.empty().and.be.String())
    );
  });

  describe('get authorised apps', () => {
    const prepareReq = () => new Promise((resolve, reject) => {
      const authL = client.setListener(CONST.LISTENER_TYPES.AUTH_REQ,
        (err, req) => client.encodeAuthResp(req, true).then(() => {
          client.removeListener(CONST.LISTENER_TYPES.AUTH_REQ, authL);
          resolve();
        }));

      const errL = client.setListener(CONST.LISTENER_TYPES.REQUEST_ERR, (err) => {
        client.removeListener(CONST.LISTENER_TYPES.REQUEST_ERR, errL);
        reject(err);
      });

      client.decodeRequest(encodedAuthUri);
    });

    before(() => helper.createRandomAccount());

    after(() => helper.clearAccount());

    it('return empty array before registering any app', () => client.getRegisteredApps()
      .should.be.fulfilled()
      .then((apps) => should(apps).be.Array().and.be.empty())
    );

    it('return apps list after registering apps', () => prepareReq()
      .then(() => client.getRegisteredApps())
      .should.be.fulfilled()
      .then((apps) => should(apps).be.Array().and.not.be.empty())
    );
  });

  describe('revoke app', () => {
    let appId = null;
    before(() => new Promise(
      (resolve, reject) => {
        const authL = client.setListener(CONST.LISTENER_TYPES.AUTH_REQ, (err, req) => {
          appId = req.authReq.app.id;
          return client.encodeAuthResp(req, true).then(() => {
            client.removeListener(CONST.LISTENER_TYPES.AUTH_REQ, authL);
            resolve();
          });
        });

        const errL = client.setListener(CONST.LISTENER_TYPES.REQUEST_ERR, () => {
          client.removeListener(CONST.LISTENER_TYPES.REQUEST_ERR, errL);
          reject();
        });

        decodedReqForRandomClient(encodedAuthUri);
      })
    );

    after(() => helper.clearAccount());

    it('throws an error when appId is undefined', () => client.revokeApp()
      .should.be.rejectedWith(Error)
      .then((err) => should(err.message).be.equal(i18n.__('messages.should_not_be_empty', i18n.__('AppId'))))
    );

    it('throws an error when appId is not of String type', () => (
      Promise.all([
        client.revokeApp(123).should.be.rejectedWith(Error).then((err) => should(err.message).be.equal(i18n.__('messages.must_be_string', i18n.__('AppId')))),
        client.revokeApp(true).should.be.rejectedWith(Error).then((err) => should(err.message).be.equal(i18n.__('messages.must_be_string', i18n.__('AppId')))),
        client.revokeApp({ a: 1 }).should.be.rejectedWith(Error).then((err) => should(err.message).be.equal(i18n.__('messages.must_be_string', i18n.__('AppId')))),
        client.revokeApp([1, 2, 3]).should.be.rejectedWith(Error).then((err) => should(err.message).be.equal(i18n.__('messages.must_be_string', i18n.__('AppId'))))
      ])
    ));

    it('throws an error when appId is empty string', () => client.revokeApp(' ')
      .should.be.rejectedWith(Error)
      .then((err) => should(err.message).be.equal(i18n.__('messages.should_not_be_empty', i18n.__('AppId'))))
    );

    it('removes app from registered app list', () => client.revokeApp(appId)
      .should.be.fulfilled()
      .then(() => client.getRegisteredApps())
      .then((apps) => should(apps).be.Array().and.be.empty())
    );
  });

  describe('after revoking', () => {
    before(() => new Promise(
      (resolve, reject) => {
        const authL = client.setListener(CONST.LISTENER_TYPES.AUTH_REQ, (err, req) => {
          const appId = req.authReq.app.id;
          return client.encodeAuthResp(req, true)
            .then(() => client.revokeApp(appId).then(() => {
              client.removeListener(CONST.LISTENER_TYPES.AUTH_REQ, authL);
              resolve();
            }));
        });

        const errL = client.setListener(CONST.LISTENER_TYPES.REQUEST_ERR, (err) => {
          client.removeListener(CONST.LISTENER_TYPES.REQUEST_ERR, errL);
          reject(err);
        });

        decodedReqForRandomClient(encodedAuthUri);
      })
    );

    after(() => helper.clearAccount());

    it('same app can be registered again', () => (
      new Promise((resolve, reject) => {
        setTimeout(() => {
          const authL = client.setListener(CONST.LISTENER_TYPES.AUTH_REQ, (err, req) => (
            client.encodeAuthResp(req, true)
              .then(() => client.getRegisteredApps()
                .then((apps) => {
                  should(apps.length).be.equal(1);
                  client.removeListener(CONST.LISTENER_TYPES.AUTH_REQ, authL);
                  return resolve();
                }))
          ));
          const errL = client.setListener(CONST.LISTENER_TYPES.REQUEST_ERR, (err) => {
            client.removeListener(CONST.LISTENER_TYPES.REQUEST_ERR, errL);
            reject(err);
          });
          client.decodeRequest(encodedAuthUri);
        }, 1000);
      }))
    );
  });

  describe('re-authorising', () => {
    before(() => new Promise(
      (resolve, reject) => {
        const authL = client.setListener(CONST.LISTENER_TYPES.AUTH_REQ,
          (err, req) => client.encodeAuthResp(req, true).then(() => {
            client.removeListener(CONST.LISTENER_TYPES.AUTH_REQ, authL);
            resolve();
          }));

        const errL = client.setListener(CONST.LISTENER_TYPES.REQUEST_ERR, (err) => {
          client.removeListener(CONST.LISTENER_TYPES.REQUEST_ERR, errL);
          reject(err);
        });

        decodedReqForRandomClient(encodedAuthUri);
      })
    );

    after(() => helper.clearAccount());

    it.skip('doesn\'t throw error', () => (
      new Promise((resolve, reject) => {
        client.setListener(CONST.LISTENER_TYPES.AUTH_REQ, (err, req) => (
          client.encodeAuthResp(req, true)
            .then((res) => {
              should(res).not.be.empty().and.be.String();
              return resolve();
            })
        ));
        client.setListener(CONST.LISTENER_TYPES.REQUEST_ERR, reject);
        client.decodeRequest(encodedAuthUri);
      })
    ));
  });

  describe('account information', () => {
    before(() => new Promise(
      (resolve, reject) => {
        const authL = client.setListener(CONST.LISTENER_TYPES.AUTH_REQ, (err, req) => (
          client.encodeAuthResp(req, true).then(() => {
            client.removeListener(CONST.LISTENER_TYPES.AUTH_REQ, authL);
            resolve();
          })
        ));

        const errL = client.setListener(CONST.LISTENER_TYPES.REQUEST_ERR, () => {
          client.removeListener(CONST.LISTENER_TYPES.REQUEST_ERR, errL);
          reject();
        });

        decodedReqForRandomClient(encodedAuthUri);
      })
    );

    after(() => helper.clearAccount());

    it('are retrievable', () => client.getAccountInfo()
      .should.be.fulfilled()
      .then((res) => {
        should(res).be.Object().and.not.empty().and.have.properties([
          'done',
          'available']);
        should(res.done).not.be.undefined().and.be.Number();
        should(res.available).not.be.undefined().and.be.Number();
      })
    );
  });
});
