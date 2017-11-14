import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { I18n } from 'react-redux-i18n';
import zxcvbn from 'zxcvbn';
import classNames from 'classnames';
import { getStrengthMsg } from '../utils';
import CONSTANTS from '../../constants';
import CardLoaderFull from './card_loader_full';

export default class CreateAccount extends Component {
  static propTypes = {
    isAuthorised: PropTypes.bool,
    loading: PropTypes.bool,
    navPos: PropTypes.number,
    secretStrength: PropTypes.number,
    passwordStrength: PropTypes.number,
    userSecret: PropTypes.string,
    inviteCode: PropTypes.string,
    userPassword: PropTypes.string,
    error: PropTypes.string,
    setCreateAccNavPos: PropTypes.func,
    clearError: PropTypes.func,
    clearAccSecret: PropTypes.func,
    clearAccPassword: PropTypes.func,
    resetCreateAccNavPos: PropTypes.func,
    setAccSecret: PropTypes.func,
    setInviteCode: PropTypes.func,
    setError: PropTypes.func,
    setAccPassword: PropTypes.func,
    createAccount: PropTypes.func,
    clearInviteCode: PropTypes.func,
    setPasswordStrength: PropTypes.func,
    setSecretStrength: PropTypes.func,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  constructor() {
    super();
    this.state = {
      inviteError: null,
      accSecError: null,
      confirmAccSecError: null,
      accPassErr: null,
      confirmAccPassErr: null,
    };
    this.lastNavPos = 0;
    this.secretEle = null;
    this.confirmSecretEle = null;
    this.passwordEle = null;
    this.confirmPasswordEle = null;
    this.inviteCode = null;
    this.getContainer = this.getContainer.bind(this);
    this.getWelcomeContainer = this.getWelcomeContainer.bind(this);
    this.getInvitationContainer = this.getInvitationContainer.bind(this);
    this.getAccountSecretContainer = this.getAccountSecretContainer.bind(this);
    this.getAccountPasswordContainer = this.getAccountPasswordContainer.bind(this);
    this.togglePassword = this.togglePassword.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleSecret = this.handleSecret.bind(this);
    this.handleInvitation = this.handleInvitation.bind(this);
    this.getStrength = this.getStrength.bind(this);
    this.getTitle = this.getTitle.bind(this);
    this.clearFieldMsg = this.clearFieldMsg.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.getNav = this.getNav.bind(this);
    this.reset = this.reset.bind(this);
  }

  componentWillMount() {
    if (this.props.isAuthorised) {
      return this.context.router.push('/');
    }
    this.reset();
  }

  componentWillUpdate(nextProps) {
    if (nextProps.isAuthorised) {
      return this.context.router.push('/');
    }
  }

  componentDidUpdate() {
    if (this.lastNavPos === this.props.navPos) {
      return;
    }
    this.lastNavPos = this.props.navPos;
    if (this.props.navPos === CONSTANTS.CREATE_ACC_NAV.PASSWORD_FORM) {
      if (this.props.userPassword) {
        this.passwordEle.value = this.props.userPassword;
        this.confirmPasswordEle.value = this.props.userPassword;
        this.passwordEle.dispatchEvent(new Event('keyup', { bubbles: true }));
      }
      this.passwordEle.focus();
    } else if (this.props.navPos === CONSTANTS.CREATE_ACC_NAV.SECRET_FORM) {
      if (this.props.userSecret) {
        this.secretEle.value = this.props.userSecret;
        this.confirmSecretEle.value = this.props.userSecret;
        this.secretEle.dispatchEvent(new Event('keyup', { bubbles: true }));
      }
      this.secretEle.focus();
    } else if (this.props.navPos === CONSTANTS.CREATE_ACC_NAV.INVITE_CODE) {
      if (this.props.inviteCode) {
        this.inviteCode.value = this.props.inviteCode;
      }
      this.inviteCode.focus();
    }
  }

  getContainer() {
    switch (this.props.navPos) {
      case CONSTANTS.CREATE_ACC_NAV.WELCOME:
        return this.getWelcomeContainer();
      case CONSTANTS.CREATE_ACC_NAV.INVITE_CODE:
        return this.getInvitationContainer();
      case CONSTANTS.CREATE_ACC_NAV.SECRET_FORM:
        return this.getAccountSecretContainer();
      case CONSTANTS.CREATE_ACC_NAV.PASSWORD_FORM:
        return this.getAccountPasswordContainer();
      default:
        return (
          <div>Oops!!</div>
        );
    }
  }

  getWelcomeContainer() {
    const { navPos, setCreateAccNavPos } = this.props;
    return (
      <div className="card-main-cntr">
        <div className="auth">
          <div className="auth-b">
            <p className="auth-cont-1">
              Authenticator will act as your gateway to the SAFE Network.<br />
              You can use it to access data on the network and to<br />
              authorise apps to connect on your behalf.
            </p>
            <div className="auth-welcome">{''}</div>
            <div className="auth-f">
              <div className="auth-f-b">
                { this.getNav() }
                <button
                  type="button"
                  className="rgt flat btn primary"
                  onClick={() => {
                    setCreateAccNavPos(navPos + 1);
                  }}
                >Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  getInvitationContainer() {
    const { navPos, error, setCreateAccNavPos } = this.props;
    const msgClassNames = classNames(
      'msg',
      { error: error || this.state.inviteError });

    return (
      <div className="card-main-cntr">
        <div className="auth">
          <div className="auth-b">
            <p className="auth-cont-1">
              Enter an invitation token or claim an invitation below.
            </p>
            <div className="auth-form">
              <form id="invitationForm" onSubmit={(e) => { e.preventDefault(); }}>
                <div className="inp-grp">
                  <input
                    type="text"
                    id="invitation-code"
                    name="invitation-code"
                    key="invitation-code"
                    ref={(c) => {
                      this.inviteCode = c;
                    }}
                    required
                  />
                  <label htmlFor="invitation-code">Invitation Token</label>
                  <span className={msgClassNames}>{ error || this.state.inviteError }</span>
                </div>
                <div className="invitation">
                  <span className="separator">or</span>
                  <button
                    type="button"
                    className="btn primary long"
                    onClick={() => {
                      window.open('https://invite.maidsafe.net/');
                    }}
                  >Claim an Invitation</button>
                </div>
              </form>
            </div>
            <div className="auth-f no-border">
              <div className="auth-f-b">
                <button
                  type="button"
                  className="lft flat btn"
                  onClick={() => {
                    setCreateAccNavPos(navPos - 1);
                  }}
                >Back
                </button>
                { this.getNav() }
                <button
                  type="button"
                  className="rgt flat btn primary"
                  onClick={(e) => {
                    this.handleInvitation(e);
                  }}
                >Continue</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  getAccountSecretContainer() {
    const { navPos, error, secretStrength, setCreateAccNavPos } = this.props;
    const msgClassNames = classNames(
      'msg',
      { error: error || this.state.accSecError });
    return (
      <div className="card-main-cntr">
        <div className="auth">
          <div className="auth-b">
            <p className="auth-cont-1">
              Your &lsquo;Account Secret&rsquo; is private and should not be<br />
              shared with anyone.
            </p>
            <div className="auth-form bottom-pad">
              <form id="secretForm">
                <div className="inp-grp">
                  <input
                    type="password"
                    id="acc-secret"
                    name="acc-secret"
                    key="acc-secret"
                    ref={(c) => {
                      this.secretEle = c;
                    }}
                    onKeyUp={this.handleInputChange}
                    required
                  />
                  <label htmlFor="acc-secret">Account Secret</label>
                  { this.getStrength(secretStrength) }
                  <span className="limit short">{''}</span>
                  <span className={msgClassNames}>
                    { error || getStrengthMsg(secretStrength) || this.state.accSecError }
                  </span>
                  <button
                    type="button"
                    tabIndex="-1"
                    className="eye-btn"
                    onClick={this.togglePassword}
                  >{' '}</button>
                </div>
                <div className="inp-grp">
                  <input
                    type="password"
                    id="cacc-secret"
                    name="cacc-secret"
                    key="cacc-secret"
                    ref={(c) => {
                      this.confirmSecretEle = c;
                    }}
                    required
                  />
                  <label htmlFor="cacc-secret">Confirm Account Secret</label>
                  <span className="msg error" >{this.state.confirmAccSecError}</span>
                  <button
                    type="button"
                    tabIndex="-1"
                    className="eye-btn"
                    onClick={this.togglePassword}
                  >{' '}</button>
                </div>
              </form>
            </div>
            <div className="auth-f no-border">
              <div className="auth-f-b">
                <button
                  type="button"
                  className="lft flat btn"
                  onClick={() => {
                    setCreateAccNavPos(navPos - 1);
                  }}
                >Back
                </button>
                { this.getNav() }
                <button
                  type="button"
                  form="secretForm"
                  className="rgt flat btn primary"
                  onClick={(e) => {
                    this.handleSecret(e);
                  }}
                >Continue</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  getAccountPasswordContainer() {
    const { navPos, error, passwordStrength, setCreateAccNavPos } = this.props;
    const msgClassNames = classNames(
      'msg',
      { error: error || this.state.accPassErr });
    return (
      <div className="card-main-cntr">
        <div className="auth">
          <div className="auth-b">
            <p className="auth-cont-1">
              Your &lsquo;Account Password&rsquo; is never stored or <br />
              transmitted, it will not leave your computer.
            </p>
            <div className="auth-form bottom-pad">
              <form id="passwordForm">
                <div className="inp-grp">
                  <input
                    type="password"
                    id="acc-password"
                    name="acc-password"
                    key="acc-password"
                    ref={(c) => {
                      this.passwordEle = c;
                    }}
                    onKeyUp={this.handleInputChange}
                    required
                  />
                  <label htmlFor="acc-password">Account Password</label>
                  { this.getStrength(passwordStrength) }
                  <span className="limit long">{''}</span>
                  <span className={msgClassNames}>
                    { error || getStrengthMsg(passwordStrength) || this.state.accPassErr }
                  </span>
                  <button
                    type="button"
                    tabIndex="-1"
                    className="eye-btn"
                    onClick={this.togglePassword}
                  >{' '}</button>
                </div>
                <div className="inp-grp">
                  <input
                    type="password"
                    id="cacc-password"
                    name="cacc-password"
                    key="cacc-password"
                    ref={(c) => {
                      this.confirmPasswordEle = c;
                    }}
                    required
                  />
                  <label htmlFor="cacc-password">Confirm Account Password</label>
                  <span className="msg error">{ this.state.confirmAccPassErr }</span>
                  <button
                    type="button"
                    tabIndex="-1"
                    className="eye-btn"
                    onClick={this.togglePassword}
                  >{' '}</button>
                </div>
              </form>
            </div>
            <div className="auth-f no-border">
              <div className="auth-f-b">
                <button
                  type="button"
                  className="lft flat btn"
                  onClick={() => {
                    setCreateAccNavPos(navPos - 1);
                  }}
                >Back
                </button>
                { this.getNav() }
                <button
                  type="button"
                  form="passwordForm"
                  className="rgt flat btn primary"
                  onClick={(e) => {
                    this.handlePassword(e);
                  }}
                >Continue</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  getTitle() {
    switch (this.props.navPos) {
      case CONSTANTS.CREATE_ACC_NAV.WELCOME:
        return (<span><b>SAFE</b> Authenticator</span>);
      case CONSTANTS.CREATE_ACC_NAV.INVITE_CODE:
        return 'Invitation Token';
      case CONSTANTS.CREATE_ACC_NAV.SECRET_FORM:
        return 'Account Secret';
      case CONSTANTS.CREATE_ACC_NAV.PASSWORD_FORM:
        return 'Account Password';
      default:
        return (<span>Oops!!</span>);
    }
  }

  getNav() {
    const { navPos, setCreateAccNavPos } = this.props;
    const getClassName = (pos) => (
      classNames({ active: navPos === pos })
    );

    return (
      <div className="auth-f-nav">
        <span className={getClassName(CONSTANTS.CREATE_ACC_NAV.WELCOME)} onClick={() => { setCreateAccNavPos(1); }}>{''}</span>
        <span className={getClassName(CONSTANTS.CREATE_ACC_NAV.INVITE_CODE)} onClick={() => { setCreateAccNavPos(2); }}>{''}</span>
        <span className={getClassName(CONSTANTS.CREATE_ACC_NAV.SECRET_FORM)} onClick={() => { setCreateAccNavPos(3); }}>{''}</span>
        <span className={getClassName(CONSTANTS.CREATE_ACC_NAV.PASSWORD_FORM)} onClick={() => { setCreateAccNavPos(4); }}>{''}</span>
      </div>
    );
  }

  getStrength(val) {
    return (
      <span
        className="strength"
        style={{ width: `${Math.min((val / 16) * 100, 100)}%` }}
      >{''}</span>
    );
  }

  handleInvitation(e) {
    e.preventDefault();
    this.props.clearError();

    const inviteCode = this.inviteCode.value.trim();
    if (!inviteCode) {
      this.setState({ inviteError: 'Invite token required' });
      return;
    }
    if (this.state.inviteError) {
      this.setState({ inviteError: null });
    }
    this.props.setInviteCode(inviteCode);
    this.props.setCreateAccNavPos(this.props.navPos + 1);
  }

  handleSecret(e) {
    e.preventDefault();
    this.clearFieldMsg();

    const secret = this.secretEle.value.trim();
    const confirmSecret = this.confirmSecretEle.value.trim();
    if (!secret) {
      this.setState({ accSecError: 'Account Secret required' });
      return;
    }
    if (this.state.accSecError) {
      this.setState({ accSecError: null });
    }
    if (!confirmSecret) {
      this.setState({ confirmAccSecError: I18n.t('entries_mismatch') });
      return;
    }
    if (this.state.confirmAccSecError) {
      this.setState({ confirmAccSecError: null });
    }
    if (this.props.secretStrength < CONSTANTS.PASSPHRASE_STRENGTH.WEAK) {
      this.props.setError(I18n.t('messages.need_to_be_stronger', { name: I18n.t('Account Secret') }));
      return;
    }
    if (secret !== confirmSecret) {
      this.setState({ confirmAccSecError: I18n.t('entries_mismatch') });
      return;
    }
    if (this.state.confirmAccSecError) {
      this.setState({ confirmAccSecError: null });
    }
    this.props.setAccSecret(secret);
    this.props.setCreateAccNavPos(this.props.navPos + 1);
  }

  handlePassword(e) {
    e.preventDefault();
    this.clearFieldMsg();

    const password = this.passwordEle.value.trim();
    const confirmPassword = this.confirmPasswordEle.value.trim();
    if (!password) {
      this.setState({ accPassErr: 'Account Password required' });
      return;
    }
    if (this.state.accPassErr) {
      this.setState({ accPassErr: null });
    }
    if (!confirmPassword) {
      this.setState({ confirmAccPassErr: I18n.t('entries_mismatch') });
      return;
    }
    if (this.state.confirmAccPassErr) {
      this.setState({ confirmAccPassErr: null });
    }
    if (this.props.passwordStrength < CONSTANTS.PASSPHRASE_STRENGTH.SOMEWHAT_SECURE) {
      this.props.setError(I18n.t('messages.need_to_be_stronger', { name: I18n.t('Account Password') }));
      return;
    }
    if (password !== confirmPassword) {
      this.setState({ confirmAccPassErr: I18n.t('entries_mismatch') });
      return;
    }
    if (this.state.confirmAccPassErr) {
      this.setState({ confirmAccPassErr: null });
    }
    this.props.setAccPassword(password);

    this.props.createAccount(this.props.userSecret, password, this.props.inviteCode);
  }

  togglePassword(e) {
    const input = e.target.parentElement.childNodes.item('input');
    if (!(input && input.value)) {
      return;
    }
    input.type = (input.type === 'text') ? 'password' : 'text';
  }

  handleInputChange(e) {
    if (e.keyCode === 13) {
      return;
    }

    this.clearFieldMsg();

    if (this.props.navPos === CONSTANTS.CREATE_ACC_NAV.SECRET_FORM) {
      const value = this.secretEle.value.trim();
      this.props.setSecretStrength(zxcvbn(value).guesses_log10);
    } else if (this.props.navPos === CONSTANTS.CREATE_ACC_NAV.PASSWORD_FORM) {
      const value = this.passwordEle.value.trim();
      this.props.setPasswordStrength(zxcvbn(value).guesses_log10);
    }
  }

  clearFieldMsg() {
    if (this.state.confirmAccSecError) {
      this.setState({ confirmAccSecError: null });
    }
    if (this.state.accSecError) {
      this.setState({ accSecError: null });
    }
    if (this.state.confirmAccPassErr) {
      this.setState({ confirmAccPassErr: null });
    }
    if (this.state.accPassErr) {
      this.setState({ accPassErr: null });
    }
    if (this.props.error) {
      this.props.clearError();
    }
  }

  reset() {
    this.props.clearError();
    this.props.clearAccSecret();
    this.props.clearAccPassword();
    this.props.clearInviteCode();
    this.props.resetCreateAccNavPos();
  }

  render() {
    return (
      <div>
        <div className="card-main-b">
          {this.props.loading &&
          <CardLoaderFull msg="Registering on SAFE Network">{''}</CardLoaderFull>
          }
          <div className="card-main-h">{this.getTitle()}</div>
          { this.getContainer() }
        </div>
        <div className="card-f">
          Already have an account? <Link
            className={classNames({ disabled: this.props.loading })}
            onClick={(e) => {
              e.preventDefault();
              if (this.props.loading) {
                return;
              }
              return this.context.router.push('/');
            }}
          >LOG IN</Link>
        </div>
      </div>
    );
  }
}
