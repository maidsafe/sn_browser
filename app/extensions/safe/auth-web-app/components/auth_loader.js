import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';

export default class AuthLoader extends Component {
  static propTypes = {
    cancelAuthReq: PropTypes.func.isRequired
  };

  render() {
    const { cancelAuthReq } = this.props;
    return (
      <div className="auth-loader">
        <h3 className="title">
          {window.location.hash.slice(1) === '/create-account' ? I18n.t( 'registering' ) : I18n.t( 'authorising' ) } SAFE Network!
        </h3>
        <span className="loader">{' '}</span>
        <div className="opt">
          <div className="opt-i">
            <button
              type="button"
              className="btn primary"
              onClick={() => {
                cancelAuthReq();
              }}
            >{ I18n.t( 'buttons.cancel' ) }</button>
          </div>
        </div>
      </div>
    );
  }
}
