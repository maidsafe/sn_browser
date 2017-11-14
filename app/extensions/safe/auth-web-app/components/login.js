import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { I18n } from 'react-redux-i18n';
import classNames from 'classnames';

import CardLoaderFull from './card_loader_full';
import Popup from './popup';

export default class Login extends Component {
  static propTypes = {
    isAuthorised: PropTypes.bool,
    libErrPopup: PropTypes.bool,
    loading: PropTypes.bool,
    error: PropTypes.string,
    login: PropTypes.func,
    clearError: PropTypes.func
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  constructor() {
    super();
    this.title = 'Sign in to manage your apps';
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      libErrPopup: false,
      libErr: true
    };
  }

  componentWillMount() {
    if (this.props.isAuthorised) {
      return this.context.router.push('/');
    }
    if (this.props.error) {
      this.props.clearError();
    }
    this.setState({ libErrPopup: this.props.libErrPopup });
  }

  componentDidMount() {
    setTimeout(() => {
      this.secretEle.focus();
    }, 100);
  }

  componentWillUpdate(nextProps) {
    if (nextProps.isAuthorised) {
      return this.context.router.push('/');
    }
  }

  togglePassword(e) {
    const input = e.target.parentElement.childNodes.item('input');
    if (!(input && input.value)) {
      return;
    }
    input.type = (input.type === 'text') ? 'password' : 'text';
  }

  handleSubmit(e) {
    e.preventDefault();
    const { login, clearError } = this.props;
    clearError();
    const secret = this.secretEle.value.trim();
    const password = this.passwordEle.value.trim();
    if (!secret || !password) {
      return;
    }
    login(secret, password);
  }

  render() {
    const { error } = this.props;

    // if (loading) {
    //   return <AuthLoader cancelAuthReq={clearAuthLoader} />;
    // }

    return (
      <div>
        <div className="card-main-b">
          <div className="card-main-h">{this.title}</div>
          <div className="card-main-cntr">
            <Popup
              show={this.state.libErrPopup}
              error={this.state.libErr}
              callback={() => {
                this.setState({ libErrPopup: false });
              }}
              title={I18n.t('messages.failed_to_load_lib_title')}
              desc={I18n.t('messages.failed_to_load_lib')}
            />
            {this.props.loading &&
            <CardLoaderFull msg="Signing in, please wait!">{''}</CardLoaderFull>
            }
            <div className="auth">
              <div className="auth-b login-b">
                <div className="auth-form">
                  <form onSubmit={this.handleSubmit}>
                    <div className="inp-grp">
                      <input
                        type="password"
                        id="acc-secret"
                        name="acc-secret"
                        ref={(c) => { this.secretEle = c; }}
                        required
                      />
                      <label htmlFor="acc-secret">Account Secret</label>
                      <span className="msg error">{ error }</span>
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
                        id="acc-password"
                        name="acc-password"
                        ref={(c) => { this.passwordEle = c; }}
                        required
                      />
                      <label htmlFor="acc-password">Account Password</label>
                      <button
                        type="button"
                        tabIndex="-1"
                        className="eye-btn"
                        onClick={this.togglePassword}
                      >{' '}</button>
                    </div>
                    <div className="btn-grp">
                      <button
                        type="submit"
                        className="btn primary long"
                        disabled={this.props.libErrPopup}
                      >Log in</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card-f">
          Don&lsquo;t have an account? <Link
            className={classNames({ disabled: this.props.loading || this.props.libErrPopup })}
            onClick={(e) => {
              e.preventDefault();
              if (this.props.loading || this.props.libErrPopup) {
                return;
              }
              return this.context.router.push('create-account');
            }}
          >CREATE ACCOUNT</Link>
        </div>
      </div>
    );
  }
}
