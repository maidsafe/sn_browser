import React, { Component, PropTypes } from 'react';

export default class AuthLoader extends Component {
  static propTypes = {
    cancelAuthReq: PropTypes.func.isRequired
  };

  render() {
    const { cancelAuthReq } = this.props;
    return (
      <div className="auth-loader">
        <h3 className="title">
          {window.location.hash.slice(1) === '/create-account' ? 'Registering you on the' : 'Authorising with'} SAFE Network!
        </h3>
        <span className="loader">{' '}</span>
        <div className="opt">
          <div className="opt-i">
            <button
              type="button"
              className="btn primary"
              name="cancel"
              onClick={() => {
                cancelAuthReq();
              }}
            >Cancel</button>
          </div>
        </div>
      </div>
    );
  }
}
