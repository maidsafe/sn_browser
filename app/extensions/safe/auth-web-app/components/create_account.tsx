import * as React from 'react';
import { I18n } from 'react-redux-i18n';
import zxcvbn from 'zxcvbn';
import classNames from 'classnames';
import { AUTH_UI_CLASSES } from '$Extensions/safe/auth-web-app/classes';
import { getStrengthMsg } from '../utils';
import { CONSTANTS } from '../constants';
import { CardLoaderFull } from './card_loader_full';

interface ErrorOptions {
    code: number;
    description: string;
}

interface PropTypes {
    isAuthorised: boolean;
    loading: boolean;
    navPos: number;
    secretStrength: number;
    passwordStrength: number;
    userSecret: string;
    inviteCode: string;
    userPassword: string;
    setCreateAccNavPos: ( ...args: Array<any> ) => any;
    clearError: ( ...args: Array<any> ) => any;
    clearAccSecret: ( ...args: Array<any> ) => any;
    clearAccPassword: ( ...args: Array<any> ) => any;
    resetCreateAccNavPos: ( ...args: Array<any> ) => any;
    setAccSecret: ( ...args: Array<any> ) => any;
    setInviteCode: ( ...args: Array<any> ) => any;
    setError: ( ...args: Array<any> ) => any;
    setAccPassword: ( ...args: Array<any> ) => any;
    createAccount: ( ...args: Array<any> ) => any;
    clearInviteCode: ( ...args: Array<any> ) => any;
    setPasswordStrength: ( ...args: Array<any> ) => any;
    setSecretStrength: ( ...args: Array<any> ) => any;
    error: ErrorOptions;
}

interface ContextTypes {
    router: object;
}

export class CreateAccount extends React.Component<PropTypes, ContextTypes> {
    constructor() {
        super();
        this.state = {
            inviteError: null,
            accSecError: null,
            confirmAccSecError: null,
            accPassErr: null,
            confirmAccPassErr: null
        };
        this.lastNavPos = 0;
        this.secretEle = null;
        this.confirmSecretEle = null;
        this.passwordEle = null;
        this.confirmPasswordEle = null;
        this.inviteCode = null;
        this.getContainer = this.getContainer.bind( this );
        this.getWelcomeContainer = this.getWelcomeContainer.bind( this );
        this.getInvitationContainer = this.getInvitationContainer.bind( this );
        this.getAccountSecretContainer = this.getAccountSecretContainer.bind( this );
        this.getAccountPasswordContainer = this.getAccountPasswordContainer.bind(
            this
        );
        this.togglePassword = this.togglePassword.bind( this );
        this.handlePassword = this.handlePassword.bind( this );
        this.handleSecret = this.handleSecret.bind( this );
        this.handleInvitation = this.handleInvitation.bind( this );
        this.getStrength = this.getStrength.bind( this );
        this.getTitle = this.getTitle.bind( this );
        this.clearFieldMsg = this.clearFieldMsg.bind( this );
        this.handleInputChange = this.handleInputChange.bind( this );
        this.getNav = this.getNav.bind( this );
        this.reset = this.reset.bind( this );
    }

    componentWillMount() {
        if ( this.props.isAuthorised ) {
            return this.props.push( '/' );
        }
        this.reset();
    }

    componentWillUpdate( nextProps ) {
        if ( nextProps.isAuthorised ) {
            return this.props.push( '/' );
        }
    }

    componentDidUpdate() {
        if ( this.lastNavPos === this.props.navPos ) {
            return;
        }
        this.lastNavPos = this.props.navPos;
        if ( this.props.navPos === CONSTANTS.CREATE_ACC_NAV.PASSWORD_FORM ) {
            if ( this.props.userPassword ) {
                this.passwordEle.value = this.props.userPassword;
                this.confirmPasswordEle.value = this.props.userPassword;
                this.passwordEle.dispatchEvent( new Event( 'keyup', { bubbles: true } ) );
            }
            this.passwordEle.focus();
        } else if ( this.props.navPos === CONSTANTS.CREATE_ACC_NAV.SECRET_FORM ) {
            if ( this.props.userSecret ) {
                this.secretEle.value = this.props.userSecret;
                this.confirmSecretEle.value = this.props.userSecret;
                this.secretEle.dispatchEvent( new Event( 'keyup', { bubbles: true } ) );
            }
            this.secretEle.focus();
        } else if ( this.props.navPos === CONSTANTS.CREATE_ACC_NAV.INVITE_CODE ) {
            if ( this.props.inviteCode ) {
                this.inviteCode.value = this.props.inviteCode;
            }
            this.inviteCode.focus();
        }
    }

    getContainer() {
        switch ( this.props.navPos ) {
            case CONSTANTS.CREATE_ACC_NAV.WELCOME:
                return this.getWelcomeContainer();
            case CONSTANTS.CREATE_ACC_NAV.INVITE_CODE:
                return this.getInvitationContainer();
            case CONSTANTS.CREATE_ACC_NAV.SECRET_FORM:
                return this.getAccountSecretContainer();
            case CONSTANTS.CREATE_ACC_NAV.PASSWORD_FORM:
                return this.getAccountPasswordContainer();
            default:
                return <div>Oops!!</div>;
        }
    }

    getWelcomeContainer() {
        const { navPos, setCreateAccNavPos } = this.props;
        return (
            <div className="card-main-cntr">
                <div className="auth">
                    <div className="auth-b">
                        <p className="auth-cont-1">{I18n.t( 'auth_intro.desc.welcome' )}</p>
                        <div className="auth-welcome" />
                        <div className="auth-f">
                            <div className="auth-f-b">
                                {this.getNav()}
                                <button
                                    type="button"
                                    className={`rgt flat btn primary ${
                                        AUTH_UI_CLASSES.AUTH_CREATE_ACCOUNT_CONTINUE
                                    }`}
                                    tabIndex="0"
                                    onClick={() => {
                                        setCreateAccNavPos( navPos + 1 );
                                    }}
                                >
                                    {I18n.t( 'buttons.continue' )}
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
        const msgClassNames = classNames( 'msg', {
            error: error ? error.description : false || this.state.inviteError
        } );

        return (
            <div className="card-main-cntr">
                <div className="auth">
                    <div className="auth-b">
                        <p className="auth-cont-1">
                            {I18n.t( 'auth_intro.desc.invite_code' )}
                        </p>
                        <div className="auth-form">
                            <form
                                id="invitationForm"
                                onSubmit={e => {
                                    e.preventDefault();
                                }}
                            >
                                <div className="inp-grp">
                                    <input
                                        className={AUTH_UI_CLASSES.AUTH_INVITE_CODE_INPUT}
                                        tabIndex="0"
                                        type="text"
                                        id="invitation-code"
                                        name="invitation-code"
                                        key="invitation-code"
                                        ref={c => {
                                            this.inviteCode = c;
                                        }}
                                        required
                                    />
                                    <label htmlFor="invitation-code">
                                        {I18n.t( 'invite_token' )}
                                    </label>
                                    <span className={msgClassNames}>
                                        {error
                                            ? error.description
                                            : false || this.state.inviteError}
                                    </span>
                                </div>
                                <div className="invitation">
                                    <span className="separator">or</span>
                                    <button
                                        type="button"
                                        className="btn primary long"
                                        onClick={() => {
                                            window.open( 'https://invite.maidsafe.net/' );
                                        }}
                                    >
                                        {I18n.t( 'buttons.claim_invitation' )}
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="auth-f no-border">
                            <div className="auth-f-b">
                                <button
                                    type="button"
                                    tabIndex="0"
                                    className="lft flat btn"
                                    onClick={() => {
                                        setCreateAccNavPos( navPos - 1 );
                                    }}
                                >
                                    {I18n.t( 'buttons.back' )}
                                </button>
                                {this.getNav()}
                                <button
                                    type="button"
                                    tabIndex="0"
                                    className={`rgt flat btn primary ${
                                        AUTH_UI_CLASSES.AUTH_CREATE_ACCOUNT_CONTINUE
                                    }`}
                                    onClick={e => {
                                        this.handleInvitation( e );
                                    }}
                                >
                                    {I18n.t( 'buttons.continue' )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    getAccountSecretContainer() {
        const { navPos, error, secretStrength, setCreateAccNavPos } = this.props;
        const msgClassNames = classNames( 'msg', {
            error: error ? error.description : false || this.state.accSecError
        } );
        return (
            <div className="card-main-cntr">
                <div className="auth">
                    <div className="auth-b">
                        <p className="auth-cont-1">{I18n.t( 'auth_intro.desc.secret' )}</p>
                        <div className="auth-form bottom-pad">
                            <form id="secretForm">
                                <div className="inp-grp">
                                    <input
                                        className={AUTH_UI_CLASSES.AUTH_SECRET_INPUT}
                                        tabIndex="0"
                                        type="password"
                                        id="acc-secret"
                                        name="acc-secret"
                                        key="acc-secret"
                                        ref={c => {
                                            this.secretEle = c;
                                        }}
                                        onChange={this.handleInputChange}
                                        required
                                    />
                                    <label htmlFor="acc-secret">{I18n.t( 'account_secret' )}</label>
                                    {this.getStrength( secretStrength )}
                                    <span className="limit short" />
                                    <span className={msgClassNames}>
                                        {error
                                            ? error.description
                                            : false ||
                        getStrengthMsg( secretStrength ) ||
                        this.state.accSecError}
                                    </span>
                                    <button
                                        type="button"
                                        tabIndex="0"
                                        className="eye-btn"
                                        onClick={this.togglePassword}
                                    >
                                        {' '}
                                    </button>
                                </div>
                                <div className="inp-grp">
                                    <input
                                        className={AUTH_UI_CLASSES.AUTH_CONFIRM_SECRET_INPUT}
                                        tabIndex="0"
                                        type="password"
                                        id="cacc-secret"
                                        name="cacc-secret"
                                        key="cacc-secret"
                                        ref={c => {
                                            this.confirmSecretEle = c;
                                        }}
                                        required
                                    />
                                    <label htmlFor="cacc-secret">
                                        {I18n.t( 'confirm_secret' )}
                                    </label>
                                    <span className="msg error">
                                        {this.state.confirmAccSecError}
                                    </span>
                                    <button
                                        type="button"
                                        tabIndex="0"
                                        className="eye-btn"
                                        onClick={this.togglePassword}
                                    >
                                        {' '}
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="auth-f no-border">
                            <div className="auth-f-b">
                                <button
                                    type="button"
                                    tabIndex="0"
                                    className="lft flat btn"
                                    onClick={() => {
                                        setCreateAccNavPos( navPos - 1 );
                                    }}
                                >
                                    {I18n.t( 'buttons.back' )}
                                </button>
                                {this.getNav()}
                                <button
                                    type="button"
                                    tabIndex="0"
                                    form="secretForm"
                                    className={`rgt flat btn primary ${
                                        AUTH_UI_CLASSES.AUTH_CREATE_ACCOUNT_CONTINUE
                                    }`}
                                    onClick={e => {
                                        this.handleSecret( e );
                                    }}
                                >
                                    {I18n.t( 'buttons.continue' )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    getAccountPasswordContainer() {
        const { navPos, error, passwordStrength, setCreateAccNavPos } = this.props;
        const msgClassNames = classNames( 'msg', {
            error: error ? error.description : false || this.state.accPassErr
        } );
        return (
            <div className="card-main-cntr">
                <div className="auth">
                    <div className="auth-b">
                        <p className="auth-cont-1">{I18n.t( 'auth_intro.desc.password' )}</p>
                        <div className="auth-form bottom-pad">
                            <form id="passwordForm">
                                <div className="inp-grp">
                                    <input
                                        className={AUTH_UI_CLASSES.AUTH_PASSWORD_INPUT}
                                        tabIndex="0"
                                        type="password"
                                        id="acc-password"
                                        name="acc-password"
                                        key="acc-password"
                                        ref={c => {
                                            this.passwordEle = c;
                                        }}
                                        onChange={this.handleInputChange}
                                        required
                                    />
                                    <label htmlFor="acc-password">
                                        {I18n.t( 'account_password' )}
                                    </label>
                                    {this.getStrength( passwordStrength )}
                                    <span className="limit long" />
                                    <span className={msgClassNames}>
                                        {error
                                            ? error.description
                                            : false ||
                        getStrengthMsg( passwordStrength ) ||
                        this.state.accPassErr}
                                    </span>
                                    <button
                                        type="button"
                                        tabIndex="0"
                                        className="eye-btn"
                                        onClick={this.togglePassword}
                                    >
                                        {' '}
                                    </button>
                                </div>
                                <div className="inp-grp">
                                    <input
                                        className={AUTH_UI_CLASSES.AUTH_CONFIRM_PASSWORD_INPUT}
                                        tabIndex="0"
                                        type="password"
                                        id="cacc-password"
                                        name="cacc-password"
                                        key="cacc-password"
                                        ref={c => {
                                            this.confirmPasswordEle = c;
                                        }}
                                        required
                                    />
                                    <label htmlFor="cacc-password">
                                        {I18n.t( 'confirm_password' )}
                                    </label>
                                    <span className="msg error">
                                        {this.state.confirmAccPassErr}
                                    </span>
                                    <button
                                        type="button"
                                        tabIndex="0"
                                        className="eye-btn"
                                        onClick={this.togglePassword}
                                    >
                                        {' '}
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="auth-f no-border">
                            <div className="auth-f-b">
                                <button
                                    type="button"
                                    tabIndex="0"
                                    className="lft flat btn"
                                    onClick={() => {
                                        setCreateAccNavPos( navPos - 1 );
                                    }}
                                >
                                    {I18n.t( 'buttons.back' )}
                                </button>
                                {this.getNav()}
                                <button
                                    type="button"
                                    tabIndex="0"
                                    form="passwordForm"
                                    className={`rgt flat btn primary ${
                                        AUTH_UI_CLASSES.AUTH_CREATE_ACCOUNT_CONTINUE
                                    }`}
                                    onClick={e => {
                                        this.handlePassword( e );
                                    }}
                                >
                                    {I18n.t( 'buttons.continue' )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    getTitle() {
        switch ( this.props.navPos ) {
            case CONSTANTS.CREATE_ACC_NAV.WELCOME:
                return (
                    <span>
                        <b>SAFE</b> Authenticator
                    </span>
                );
            case CONSTANTS.CREATE_ACC_NAV.INVITE_CODE:
                return I18n.t( 'invite_token' );
            case CONSTANTS.CREATE_ACC_NAV.SECRET_FORM:
                return I18n.t( 'account_secret' );
            case CONSTANTS.CREATE_ACC_NAV.PASSWORD_FORM:
                return I18n.t( 'account_password' );
            default:
                return <span>Oops!!</span>;
        }
    }

    getNav() {
        const { navPos, setCreateAccNavPos } = this.props;
        const getNavPositionClassName = pos =>
            classNames( {
                active: navPos === pos
            } );

        return (
            <div className="auth-f-nav">
                <span
                    className={getNavPositionClassName( CONSTANTS.CREATE_ACC_NAV.WELCOME )}
                    onClick={() => {
                        setCreateAccNavPos( 1 );
                    }}
                >
                    {''}
                </span>
                <span
                    className={getNavPositionClassName(
                        CONSTANTS.CREATE_ACC_NAV.INVITE_CODE
                    )}
                    onClick={() => {
                        setCreateAccNavPos( 2 );
                    }}
                >
                    {''}
                </span>
                <span
                    className={getNavPositionClassName(
                        CONSTANTS.CREATE_ACC_NAV.SECRET_FORM
                    )}
                    onClick={() => {
                        setCreateAccNavPos( 3 );
                    }}
                >
                    {''}
                </span>
                <span
                    className={getNavPositionClassName(
                        CONSTANTS.CREATE_ACC_NAV.PASSWORD_FORM
                    )}
                    onClick={() => {
                        setCreateAccNavPos( 4 );
                    }}
                >
                    {''}
                </span>
            </div>
        );
    }

    getStrength( val ) {
        return (
            <span
                className="strength"
                style={{ width: `${Math.min( ( val / 16 ) * 100, 100 )}%` }}
            >
                {''}
            </span>
        );
    }

    handleInvitation( e ) {
        e.preventDefault();
        this.props.clearError();

        const inviteCode = this.inviteCode.value.trim();
        if ( !inviteCode ) {
            this.setState( { inviteError: 'Invite token required' } );
            return;
        }
        if ( this.state.inviteError ) {
            this.setState( { inviteError: null } );
        }
        this.props.setInviteCode( inviteCode );
        this.props.setCreateAccNavPos( this.props.navPos + 1 );
    }

    handleSecret( e ) {
        e.preventDefault();
        this.clearFieldMsg();

        const secret = this.secretEle.value.trim();
        const confirmSecret = this.confirmSecretEle.value.trim();
        if ( !secret ) {
            this.setState( { accSecError: 'Account Secret required' } );
            return;
        }
        if ( this.state.accSecError ) {
            this.setState( { accSecError: null } );
        }
        if ( !confirmSecret ) {
            this.setState( {
                confirmAccSecError: I18n.t( 'messages.entries_mismatch' )
            } );
            return;
        }
        if ( this.state.confirmAccSecError ) {
            this.setState( { confirmAccSecError: null } );
        }
        if ( this.props.secretStrength < CONSTANTS.PASSPHRASE_STRENGTH.WEAK ) {
            this.props.setError(
                I18n.t( 'messages.need_to_be_stronger', {
                    name: I18n.t( 'account_secret' )
                } )
            );
            return;
        }
        if ( secret !== confirmSecret ) {
            this.setState( {
                confirmAccSecError: I18n.t( 'messages.entries_mismatch' )
            } );
            return;
        }
        if ( this.state.confirmAccSecError ) {
            this.setState( { confirmAccSecError: null } );
        }
        this.props.setAccSecret( secret );
        this.props.setCreateAccNavPos( this.props.navPos + 1 );
    }

    handlePassword( e ) {
        e.preventDefault();
        this.clearFieldMsg();

        const password = this.passwordEle.value.trim();
        const confirmPassword = this.confirmPasswordEle.value.trim();
        if ( !password ) {
            this.setState( { accPassErr: 'Account Password required' } );
            return;
        }
        if ( this.state.accPassErr ) {
            this.setState( { accPassErr: null } );
        }
        if ( !confirmPassword ) {
            this.setState( {
                confirmAccPassErr: I18n.t( 'messages.entries_mismatch' )
            } );
            return;
        }
        if ( this.state.confirmAccPassErr ) {
            this.setState( { confirmAccPassErr: null } );
        }
        if (
            this.props.passwordStrength <
      CONSTANTS.PASSPHRASE_STRENGTH.SOMEWHAT_SECURE
        ) {
            this.props.setError(
                I18n.t( 'messages.need_to_be_stronger', {
                    name: I18n.t( 'account_password' )
                } )
            );
            return;
        }
        if ( password !== confirmPassword ) {
            this.setState( {
                confirmAccPassErr: I18n.t( 'messages.entries_mismatch' )
            } );
            return;
        }
        if ( this.state.confirmAccPassErr ) {
            this.setState( { confirmAccPassErr: null } );
        }
        this.props.setAccPassword( password );

        this.props.createAccount(
            this.props.userSecret,
            password,
            this.props.inviteCode
        );
    }

    togglePassword( e ) {
        const input = e.target.parentElement.childNodes.item( 'input' );
        if ( !( input && input.value ) ) {
            return;
        }
        input.type = input.type === 'text' ? 'password' : 'text';
    }

    handleInputChange( e ) {
        if ( e.keyCode === 13 ) {
            return;
        }

        this.clearFieldMsg();

        if ( this.props.navPos === CONSTANTS.CREATE_ACC_NAV.SECRET_FORM ) {
            const value = this.secretEle.value.trim();
            this.props.setSecretStrength( zxcvbn( value ).guesses_log10 );
        } else if ( this.props.navPos === CONSTANTS.CREATE_ACC_NAV.PASSWORD_FORM ) {
            const value = this.passwordEle.value.trim();
            this.props.setPasswordStrength( zxcvbn( value ).guesses_log10 );
        }
    }

    clearFieldMsg() {
        if ( this.state.confirmAccSecError ) {
            this.setState( { confirmAccSecError: null } );
        }
        if ( this.state.accSecError ) {
            this.setState( { accSecError: null } );
        }
        if ( this.state.confirmAccPassErr ) {
            this.setState( { confirmAccPassErr: null } );
        }
        if ( this.state.accPassErr ) {
            this.setState( { accPassErr: null } );
        }
        if ( this.props.error ) {
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

    login( e ) {
        e.preventDefault();
        if ( this.props.loading ) {
            return;
        }
        return this.props.push( '/' );
    }

    render() {
        return (
            <div>
                <div className="card-main-b">
                    {this.props.loading && (
                        <CardLoaderFull msg="Registering on SAFE Network">
                            {''}
                        </CardLoaderFull>
                    )}
                    <div className="card-main-h">{this.getTitle()}</div>
                    {this.getContainer()}
                </div>
                <div className="card-f">
                    {I18n.t( 'have_account_question' )}
          &nbsp;
                    <a
                        className={classNames( { disabled: this.props.loading } )}
                        tabIndex="0"
                        role="button"
                        onClick={e => this.login( e )}
                        onKeyDown={e => {
                            if ( e.keyCode === 13 ) {
                                this.login( e );
                            }
                        }}
                    >
            LOG IN
                    </a>
                </div>
            </div>
        );
    }
}
