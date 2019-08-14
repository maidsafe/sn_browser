export const CONSTANTS = {
  NETWORK_STATUS: {
    CONNECTED: 0,
    CONNECTING: 1,
    DISCONNECTED: -1
  },
  CLIENT_TYPES: {
    DESKTOP: 'DESKTOP',
    WEB: 'WEB'
  },
  CREATE_ACC_NAV: {
    WELCOME: 1,
    INVITE_CODE: 2,
    SECRET_FORM: 3,
    PASSWORD_FORM: 4
  },
  PASSPHRASE_STRENGTH: {
    VERY_WEAK: 4,
    WEAK: 8,
    SOMEWHAT_SECURE: 10,
    SECURE: 10
  },
  PASSPHRASE_STRENGTH_MSG: {
    VERY_WEAK: 'Very weak',
    WEAK: 'Weak',
    SOMEWHAT_SECURE: 'Somewhat secure',
    SECURE: 'Secure'
  },
  RE_AUTHORISE: {
    KEY: 'SAFE_LOCAL_RE_AUTHORISE_STATE',
    LOCK_MSG: 'Apps cannot re-authenticate automatically',
    UNLOCK_MSG: 'Apps can re-authenticate automatically',
    STATE: {
      LOCK: 0,
      UNLOCK: 1
    }
  }
};
