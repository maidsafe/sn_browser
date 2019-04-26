import * as React from 'react';
import { I18n } from 'react-redux-i18n';
import classNames from 'classnames';
import { AUTH_UI_CLASSES } from '$Extensions/safe/auth-web-app/classes';

import { CardLoaderFull } from './card_loader_full';
import { Popup } from './popup';

interface Error {
    code: number;
    description: string;
}

interface PropTypes {
    isAuthorised: boolean;
    libErrPopup: boolean;
    loading: boolean;
    login: ( ...args: Array<any> ) => any;
    clearError: ( ...args: Array<any> ) => any;
    error: Error;
}

interface ContextTypes {
    router: object;
}

export class Login extends React.Component<PropTypes, ContextTypes> {
    constructor() {
        super();
        this.title = 'Sign in to manage your apps';
        this.handleSubmit = this.handleSubmit.bind( this );
        this.state = {
            libErrPopup: false,
            libErr: true
        };
    }

    componentWillMount() {
        if ( this.props.isAuthorised ) {
            return this.props.push( '/' );
        }
        if ( this.props.error ) {
            this.props.clearError();
        }
        this.setState( { libErrPopup: this.props.libErrPopup } );
    }

    componentWillUpdate( nextProps ) {
        if ( nextProps.isAuthorised ) {
            return this.props.push( '/' );
        }
    }

    togglePassword( e ) {
        const input = e.target.parentElement.childNodes.item( 'input' );
        if ( !( input && input.value ) ) {
            return;
        }
        input.type = input.type === 'text' ? 'password' : 'text';
    }

    handleSubmit( e ) {
        e.preventDefault();
        const { login, clearError } = this.props;
        clearError();
        const secret = this.secretEle.value.trim();
        const password = this.passwordEle.value.trim();
        if ( !secret || !password ) {
            return;
        }
        login( secret, password );
    }

    createAccount( e ) {
        e.preventDefault();
        if ( this.props.loading || this.props.libErrPopup ) {
            return;
        }
        return this.props.push( '/create-account' );
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
                                this.setState( { libErrPopup: false } );
                            }}
                            title={I18n.t( 'messages.failed_to_load_lib_title' )}
                            desc={I18n.t( 'messages.failed_to_load_lib' )}
                        />
                        {this.props.loading && (
                            <CardLoaderFull msg={I18n.t( 'messages.signing_in' )}>
                                {''}
                            </CardLoaderFull>
                        )}
                        <div className="auth">
                            <div className="auth-b login-b">
                                <div className="auth-form">
                                    <form onSubmit={this.handleSubmit}>
                                        <div className="inp-grp">
                                            <input
                                                key="userName"
                                                className={AUTH_UI_CLASSES.AUTH_SECRET_INPUT}
                                                tabIndex="0"
                                                type="password"
                                                id="acc-secret"
                                                name="acc-secret"
                                                ref={c => {
                                                    this.secretEle = c;
                                                }}
                                                required
                                            />
                                            <label htmlFor="acc-secret">
                                                {I18n.t( 'account_secret' )}
                                            </label>
                                            {error && error.code !== -3 && (
                                                <span className="msg error">{error.description}</span>
                                            )}
                                            <button
                                                type="button"
                                                tabIndex="0"
                                                className="eye-btn"
                                                aria-label={I18n.t( 'aria.show_secret_toggle' )}
                                                onClick={this.togglePassword}
                                            >
                                                {' '}
                                            </button>
                                        </div>
                                        <div className="inp-grp">
                                            <input
                                                key="accPassword"
                                                className={AUTH_UI_CLASSES.AUTH_PASSWORD_INPUT}
                                                tabIndex="0"
                                                type="password"
                                                id="acc-password"
                                                name="acc-password"
                                                ref={c => {
                                                    this.passwordEle = c;
                                                }}
                                                required
                                            />
                                            <label htmlFor="acc-password">
                                                {I18n.t( 'account_password' )}
                                            </label>
                                            {error && error.code === -3 && (
                                                <span className="msg error">{error.description}</span>
                                            )}
                                            <button
                                                type="button"
                                                tabIndex="0"
                                                className="eye-btn"
                                                aria-label={I18n.t( 'aria.show_password_toggle' )}
                                                onClick={this.togglePassword}
                                            >
                                                {' '}
                                            </button>
                                        </div>
                                        <div className="btn-grp">
                                            <button
                                                type="submit"
                                                className={`btn primary long ${
                                                    AUTH_UI_CLASSES.AUTH_LOGIN_BUTTON
                                                }`}
                                                disabled={this.props.libErrPopup}
                                            >
                                                {I18n.t( 'buttons.login' )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-f">
                    {I18n.t( 'no_account_question' )}
          &nbsp;
                    <a
                        className={`${classNames( {
                            disabled: this.props.loading || this.props.libErrPopup
                        } )} ${AUTH_UI_CLASSES.CREATE_ACCOUNT_BUTTON}`}
                        tabIndex="0"
                        role="button"
                        onClick={e => this.createAccount( e )}
                        onKeyDown={e => {
                            if ( e.keyCode === 13 ) {
                                this.createAccount( e );
                            }
                        }}
                    >
                        {I18n.t( 'buttons.create_account' )}
                    </a>
                </div>
            </div>
        );
    }
}
