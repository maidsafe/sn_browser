/* eslint-disable no-underscore-dangle */
import crypto from 'crypto';

const _cbFunctions = Symbol('_cbFunctions');

export default class Listener {
  constructor() {
    this[_cbFunctions] = {};
  }

  add(cb) {
    if (typeof cb !== 'function') {
      return;
    }
    const rand = crypto.randomBytes(32).toString('hex');
    this[_cbFunctions][rand] = cb;
    return rand;
  }

  len() {
    return Object.keys(this[_cbFunctions]);
  }

  remove(id) {
    if (!id) {
      return;
    }
    delete this[_cbFunctions][id];
  }

  push(cbId, err, data) {
    if (!this[_cbFunctions].hasOwnProperty(cbId)) {
      return;
    }
    this[_cbFunctions][cbId].call(this, err, data);
  }

  broadcast(err, data) {
    Object.keys(this[_cbFunctions]).forEach((id) => {
      try {
        this[_cbFunctions][id].call(this[_cbFunctions][id], err, data);
      } catch (e) {
        // remove the callback if object destroyed
        console.warn('Listener warn :', e.message);
        this.remove(id);
      }
    });
  }
}
