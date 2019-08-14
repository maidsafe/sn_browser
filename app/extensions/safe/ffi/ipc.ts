/* eslint-disable no-underscore-dangle */
import open from 'open';
import { shell } from 'electron';
import { receivedAuthResponse } from '$Extensions/safe/actions/safeBrowserApplication_actions';
import {
  setReAuthoriseState as setReAuthoriseStateAction,
  setIsAuthorisedState as setIsAuthorisedStateAction
} from '$Extensions/safe/actions/authenticator_actions';
import i18n from 'i18n';
import { logger } from '$Logger';
// import { getSafeBackgroundProcessStore } from '$Extensions/safe/index';
import { replyToRemoteCallFromAuth } from '$Extensions/safe/network';
import authenticator from './authenticator';
import { CONSTANTS } from '../auth-constants';
import { addAuthNotification } from '../manageAuthNotifications';
import errConst from '../err-constants';

// TODO unify this with calls for safeBrowserApp store...
let theSafeBgProcessStore;

export const setSafeBgProcessStore = (passedStore) => {
  theSafeBgProcessStore = passedStore;
};

const ipcEvent = null;

export const CLIENT_TYPES = {
  DESKTOP: 'DESKTOP',
  WEB: 'WEB'
};

export const REQ_TYPES = {
  AUTH: 'AUTH',
  CONTAINER: 'CONTAINER',
  MDATA: 'MDATA'
};

const allAuthCallBacks = {};

/**
 * Set promise callbacks to be retrievable after authentication handling.
 * @param {[type]} req     [description]
 * @param {[type]} resolve [description]
 * @param {[type]} reject  [description]
 */
export const setAuthCallbacks = (req, resolve, reject) => {
  logger.info('IPC.js Setting authCallbacks');
  allAuthCallBacks[req.id] = {
    resolve,
    reject
  };
};

const parseResUrl = (url) => {
  const split = url.split(':');
  split[0] = split[0].toLocaleLowerCase().replace('==', '');
  return split.join(':');
};

async function sendAuthDecision(isAllowed, authReqData, reqType) {
  logger.info('IPC.js: Sending auth response', isAllowed, authReqData);
  if (reqType === REQ_TYPES.AUTH) {
    onAuthDecision(authReqData, isAllowed);
  } else if (reqType === REQ_TYPES.CONTAINER) {
    onContainerDecision(authReqData, isAllowed);
  } else {
    onSharedMDataDecision(authReqData, isAllowed);
  }
}

class Request {
  constructor(req) {
    this.id = req.id;
    this.uri = req.uri;
    this.isUnRegistered = req.isUnRegistered;
    this.type = CONSTANTS.CLIENT_TYPES[req.type];
    this.error = null;
    this.res = null;
  }
}

class ReqQueue {
  constructor(resChannelName, errChannelName) {
    this.q = [];
    this.processing = false;
    this.req = null;
    this.resChannelName = resChannelName;
    this.errChannelName = errChannelName;
  }

  openExternal(uri) {
    if (
      !uri ||
      uri.indexOf('safe') !== 0 ||
      this.req.type !== CONSTANTS.CLIENT_TYPES.DESKTOP
    ) {
      return;
    }
    try {
      open(parseResUrl(uri));
    } catch (err) {
      logger.error(err.message);
    }
  }

  add(req) {
    logger.info('IPC.js adding req');
    if (!(req instanceof Request)) {
      logger.error('IPC.js not a Request instance, so ignoring');
      this.next();
      return;
    }
    logger.info('IPC.js pushing req');
    this.q.push(req);
    this.processTheReq();
  }

  next() {
    this.processing = false;
    if (this.q.length === 0) {
      return;
    }
    this.q.shift();
    this.processTheReq();
  }

  processTheReq() {
    const self = this;

    if (this.processing || this.q.length === 0) {
      return;
    }
    this.processing = true;
    this.req = this.q[0];

    authenticator
      .decodeRequest(this.req.uri)
      .then((res) => {
        if (!res) {
          return;
        }

        this.req.res = res;

        logger.info('IPC.js: another response being parsed.:', this.req);
        if (res.authReq || res.contReq || res.mDataReq) {
          let reqType = REQ_TYPES.AUTH;
          let app;
          if (res.authReq) {
            app = res.authReq.app;
          }
          if (res.contReq) {
            reqType = REQ_TYPES.CONTAINER;
            app = res.contReq.app;
          }
          if (res.mDataReq) {
            reqType = REQ_TYPES.MDATA;
            app = res.mDataReq.app;
          }

          if (
            res.isAuthorised &&
            theSafeBgProcessStore.getState().authenticator.reAuthoriseState
          ) {
            sendAuthDecision(true, res, reqType);
          } else {
            addAuthNotification(
              res,
              app,
              sendAuthDecision,
              theSafeBgProcessStore
            );
          }

          // each of the above func trigger self.next()
          return;
        }

        // if (res.isAuthorised && theSafeBgProcessStore.getState().authenticator.reAuthoriseState)
        // {
        //     sendAuthDecision( true, res, reqType );
        // }

        // WEB && not an auth req (that's handled above)
        if (this.req.type === CLIENT_TYPES.WEB) {
          logger.info(
            'IPC.js About to open send remoteCall response for auth req',
            res
          );

          replyToRemoteCallFromAuth(this.req);

          self.next();

          return;
        }

        self.openExternal(res);

        self.next();
      })
      .catch((err) => {
        // FIXME: if error occurs for unregistered client process next
        self.req.error = err;
        if (allAuthCallBacks[self.req.id]) {
          allAuthCallBacks[self.req.id].reject(err);
          delete allAuthCallBacks[self.req.id];
        }

        // TODO/BOOKMARK: leaving off here. share MData req URI is causing error when used to call auth_decode_ipc_msg in authenticator.js

        const bgStore = theSafeBgProcessStore;

        // TODO: Setup proper rejection from when unauthed.
        if (bgStore) {
          bgStore.dispatch(
            receivedAuthResponse(
              err.error_code
                ? `${err.error_code}: ${err.description}`
                : `${err.message}`
            )
          );
        }

        if (ipcEvent) {
          ipcEvent.sender.send(self.errChannelName, self.req);
        } else {
          // TODO: Currently there is no message sent when unauthorised.
          // We need to send one for the app to know...
          // authenticator.encodeAuthResp( this.req, false )
        }
        self.next();
      });
  }
}

const reqQ = new ReqQueue('onAuthDecisionRes', 'onAuthResError');
const unregisteredReqQ = new ReqQueue(
  'onUnAuthDecisionRes',
  'onUnAuthResError'
);

const registerNetworkListener = (e) => {
  authenticator.setListener(
    CONSTANTS.LISTENER_TYPES.NW_STATE_CHANGE,
    (err, state) => {
      if (
        state === CONSTANTS.NETWORK_STATUS.CONNECTED ||
        state === CONSTANTS.NETWORK_STATUS.LOGGED_IN
      ) {
        reqQ.processing = false;
        reqQ.processTheReq();
      }
      e.sender.send('onNetworkStatus', state);
    }
  );
};

const enqueueRequest = (req, type) => {
  if (!req) throw new Error('The req object is missing');

  const { isUnRegistered } = req;
  const request = new Request({
    id: req.id || Math.floor(Math.random() * 2 ** 32),
    uri: req.uri ? req.uri : req,
    type: type || CONSTANTS.CLIENT_TYPES.DESKTOP,
    isUnRegistered
  });

  if (isUnRegistered) {
    unregisteredReqQ.add(request);
  } else {
    logger.info('IPC.js enqueue authQ req...');
    reqQ.add(request);
  }
};

const onAuthReq = (e) => {
  authenticator.setListener(CONSTANTS.LISTENER_TYPES.AUTH_REQ, (err, req) => {
    e.sender.send('onAuthReq', req);
  });
};

const onContainerReq = (e) => {
  authenticator.setListener(
    CONSTANTS.LISTENER_TYPES.CONTAINER_REQ,
    (err, req) => {
      e.sender.send('onContainerReq', req);
    }
  );
};

const onSharedMDataReq = (e) => {
  authenticator.setListener(CONSTANTS.LISTENER_TYPES.MDATA_REQ, (err, req) => {
    e.sender.send('onSharedMDataReq', req);
  });
};

const onAuthDecision = (authData, isAllowed) => {
  logger.info('IPC.js: onAuthDecision running...', authData, isAllowed);
  if (!authData) {
    return Promise.reject(
      new Error(i18n.__('messages.should_not_be_empty', i18n.__('URL')))
    );
  }

  if (typeof isAllowed !== 'boolean') {
    return Promise.reject(
      new Error(i18n.__('messages.should_not_be_empty', i18n.__('IsAllowed')))
    );
  }

  authenticator
    .encodeAuthResp(authData, isAllowed)
    .then((res) => {
      logger.info(
        'IPC.js: Successfully encoded auth response. Here is the res:',
        res
      );

      if (allAuthCallBacks[reqQ.req.id]) {
        allAuthCallBacks[reqQ.req.id].resolve(res);
        delete allAuthCallBacks[reqQ.req.id];
      } else {
        reqQ.openExternal(res);
      }

      reqQ.next();
    })
    .catch((err) => {
      reqQ.req.error = err;
      logger.error('Auth decision error :: ', err.message);

      if (allAuthCallBacks[reqQ.req.id]) {
        allAuthCallBacks[reqQ.req.id].reject(err);
        delete allAuthCallBacks[reqQ.req.id];
      }

      reqQ.next();
    });
};

const onContainerDecision = (contData, isAllowed) => {
  if (!contData) {
    return Promise.reject(
      new Error(i18n.__('messages.should_not_be_empty', i18n.__('URL')))
    );
  }

  if (typeof isAllowed !== 'boolean') {
    return Promise.reject(
      new Error(i18n.__('messages.should_not_be_empty', i18n.__('IsAllowed')))
    );
  }

  authenticator
    .encodeContainersResp(contData, isAllowed)
    .then((res) => {
      reqQ.req.res = res;
      if (allAuthCallBacks[reqQ.req.id]) {
        allAuthCallBacks[reqQ.req.id].resolve(res);
        delete allAuthCallBacks[reqQ.req.id];
      } else {
        reqQ.openExternal(res);
      }

      reqQ.next();
    })
    .catch((err) => {
      reqQ.req.error = err;

      if (allAuthCallBacks[reqQ.req.id]) {
        allAuthCallBacks[reqQ.req.id].reject(err);
        delete allAuthCallBacks[reqQ.req.id];
      }

      logger.error(errConst.CONTAINER_DECISION_RESP.msg(err));
      reqQ.next();
    });
};

export const onSharedMDataDecision = (
  data,
  isAllowed,
  queue = reqQ,
  authCallBacks = allAuthCallBacks
) => {
  if (!data) {
    return Promise.reject(
      new Error(i18n.__('messages.should_not_be_empty', i18n.__('URL')))
    );
  }

  if (typeof isAllowed !== 'boolean') {
    return Promise.reject(
      new Error(i18n.__('messages.should_not_be_empty', i18n.__('IsAllowed')))
    );
  }

  authenticator
    .encodeMDataResp(data, isAllowed)
    .then((res) => {
      queue.req.res = res;

      if (authCallBacks[queue.req.id]) {
        authCallBacks[queue.req.id].resolve(res);
        delete authCallBacks[queue.req.id];
      } else {
        queue.openExternal(res);
      }

      queue.next();
    })
    .catch((err) => {
      queue.req.error = err;
      logger.info('Error caught: ', errConst.SHAREMD_DECISION_RESP.msg(err));

      if (authCallBacks[queue.req.id]) {
        authCallBacks[queue.req.id].reject(err);
        delete authCallBacks[queue.req.id];
      }

      queue.next();
    });
};

const onReqError = (e) => {
  authenticator.setListener(CONSTANTS.LISTENER_TYPES.REQUEST_ERR, (err) => {
    reqQ.req.error = err;
    e.sender.send('onAuthResError', reqQ.req);
    reqQ.next();
  });
};

const skipAuthReq = () => {
  reqQ.next();
};

const setReAuthoriseState = (state, store) => {
  store.dispatch(setReAuthoriseStateAction(state));
};

const setIsAuthorisedState = (store, isAuthorised) => {
  store.dispatch(setIsAuthorisedStateAction(isAuthorised));
};

export const callIPC = {
  registerSafeNetworkListener: registerNetworkListener,
  enqueueRequest,
  registerOnAuthReq: onAuthReq,
  registerOnContainerReq: onContainerReq,
  registerOnSharedMDataReq: onSharedMDataReq,
  registerAuthDecision: onAuthDecision,
  registerContainerDecision: onContainerDecision,
  registerSharedMDataDecision: onSharedMDataDecision,
  registerOnReqError: onReqError,
  skipAuthRequest: skipAuthReq,
  setReAuthoriseState,
  setIsAuthorisedState
};
