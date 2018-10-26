import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import classNames from 'classnames';
import AUTH_UI_CLASSES from 'extensions/safe/auth-web-app/classes';

import CardLoaderFull from './card_loader_full';
import Popup from './popup';

export default class Login extends Component
{
  static propTypes = {
      isAuthorised : PropTypes.bool,
      libErrPopup  : PropTypes.bool,
      loading      : PropTypes.bool,
      login        : PropTypes.func,
      clearError   : PropTypes.func,
      error                : PropTypes.shape( {
          code        : PropTypes.number,
          description : PropTypes.string
      } )
  };

  static contextTypes = {
      router : PropTypes.object.isRequired
  };

  constructor()
  {
      super();
      this.title = 'Sign in to manage your apps';
      this.handleSubmit = this.handleSubmit.bind( this );
      this.state = {
          libErrPopup : false,
          libErr      : true
      };
  }

  componentWillMount()
  {
      if ( this.props.isAuthorised )
      {
          return this.props.push( '/' );
      }
      if ( this.props.error )
      {
          this.props.clearError();
      }
      this.setState( { libErrPopup: this.props.libErrPopup } );
  }

  componentDidMount()
  {
      setTimeout( () =>
      {
          this.secretEle.focus();
      }, 100 );
  }

  componentWillUpdate( nextProps )
  {
      if ( nextProps.isAuthorised )
      {
          return this.props.push( '/' );
      }
  }

  togglePassword( e )
  {
      const input = e.target.parentElement.childNodes.item( 'input' );
      if ( !( input && input.value ) )
      {
          return;
      }
      input.type = ( input.type === 'text' ) ? 'password' : 'text';
  }

  handleSubmit( e )
  {
      e.preventDefault();
      const { login, clearError } = this.props;
      clearError();
      const secret = this.secretEle.value.trim();
      const password = this.passwordEle.value.trim();
      if ( !secret || !password )
      {
          return;
      }
      login( secret, password );
  }

  render()
  {
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
                          show={ this.state.libErrPopup }
                          error={ this.state.libErr }
                          callback={ () =>
                          {
                              this.setState( { libErrPopup: false } );
                          } }
                          title={ I18n.t( 'messages.failed_to_load_lib_title' ) }
                          desc={ I18n.t( 'messages.failed_to_load_lib' ) }
                      />
                      {this.props.loading &&
                      <CardLoaderFull msg="Signing in, please wait!">{''}</CardLoaderFull>
                      }
                      <div className="auth">
                          <div className="auth-b login-b">
                              <div className="auth-form">
                                  <form onSubmit={ this.handleSubmit }>
                                      <div className="inp-grp" key={"accountSecret"}>
                                          <input
                                          key={"userName"}
                                              className={ AUTH_UI_CLASSES.AUTH_SECRET_INPUT }
                                              type="password"
                                              id="acc-secret"
                                              name="acc-secret"
                                              ref={ ( c ) =>
                                              {
                                                  this.secretEle = c;
                                              } }
                                              required
                                          />
                                          <label key={"accountSecretLabel"} htmlFor="acc-secret">Account Secret</label>
                                          { error && error.code !== -3 &&
                                              <span className="msg error">{ error.description }</span>
                                          }
                                          <button
                                          key={"toggleSecret"}
                                              type="button"
                                              tabIndex="-1"
                                              className="eye-btn"
                                              onClick={ this.togglePassword }
                                          >{' '}</button>
                                      </div>
                                      <div className="inp-grp" key={"accountPassword"}>
                                          <input
                                          key={"accPassword"}
                                              className={ AUTH_UI_CLASSES.AUTH_PASSWORD_INPUT }
                                              type="password"
                                              id="acc-password"
                                              name="acc-password"
                                              ref={ ( c ) =>
                                              {
                                                  this.passwordEle = c;
                                              } }
                                              required
                                          />
                                          <label key={"accountPasswordLabel"} htmlFor="acc-password">Account Password</label>
                                          { error && error.code === -3 &&
                                              <span className="msg error">{ error.description }</span>
                                          }
                                          <button
                                          key={"togglePassword"}
                                              type="button"
                                              tabIndex="-1"
                                              className="eye-btn"
                                              onClick={ this.togglePassword }
                                          >{' '}</button>
                                      </div>
                                      <div className="btn-grp" key={"submitLogin"}>
                                          <button
                                          key={"loginEvent"}
                                              type="submit"
                                              className={ `btn primary long ${AUTH_UI_CLASSES.AUTH_LOGIN_BUTTON}` }
                                              disabled={ this.props.libErrPopup }
                                          >Log in</button>
                                      </div>
                                  </form>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
              <div className="card-f">
          Don&lsquo;t have an account? <a
              className={  `${classNames(
                  {
                      disabled: this.props.loading || this.props.libErrPopup
                  } ) } ${AUTH_UI_CLASSES.CREATE_ACCOUNT_BUTTON}` }
              onClick={ ( e ) =>
                      {
                          e.preventDefault();
                          if ( this.props.loading || this.props.libErrPopup )
                          {
                              return;
                          }
                          return this.props.push( '/create-account' );
                      } }
          >CREATE ACCOUNT</a>
              </div>
          </div>
      );
  }
}
