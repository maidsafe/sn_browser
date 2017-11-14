import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import CONSTANTS from '../../constants';
import NetworkStatus from './network_status';
import AccountInfo from './account_info';

export default class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    networkState: PropTypes.number,
    isAuthorised: PropTypes.bool,
    fetchingAccountInfo: PropTypes.bool,
    accountInfo: PropTypes.objectOf(PropTypes.shape({
      done: PropTypes.number.isRequired,
      available: PropTypes.number.isRequired
    })),
    logout: PropTypes.func,
    getAccountInfo: PropTypes.func,
    setNetworkConnecting: PropTypes.func
  };

  constructor() {
    super();
    this.getHeaderOptions = this.getHeaderOptions.bind(this);
  }

  getHeaderOptions() {
    const { isAuthorised, logout } = this.props;
    if (!isAuthorised) {
      return null;
    }
    return (
      <div className="h-opt">
        <button
          type="button"
          className="logout"
          onClick={() => {
            logout();
          }}
        >Logout</button>
      </div>
    );
  }

  render() {
    const {
      networkState,
      isAuthorised,
      accountInfo,
      fetchingAccountInfo,
      setNetworkConnecting,
      getAccountInfo } = this.props;

    const appLogoClassname = classNames(
      'h-app-logo',
      {
        'safe-auth-icon': !isAuthorised
      }
    );
    return (
      <div className="root">
        <header>
          <div className="h-app-name">{''}</div>
          <div className={appLogoClassname}>{ isAuthorised ?
            <NetworkStatus status={networkState} /> : null }
          </div>
          {this.getHeaderOptions()}
          { (networkState === CONSTANTS.NETWORK_STATUS.DISCONNECTED) && isAuthorised ? (
            <div className="nw-state-alert">
              <div className="nw-status-alert-b">
                You have been disconnected from the network.
                <button
                  type="button"
                  onClick={() => {
                    setNetworkConnecting();
                  }}
                >Reconnect now</button>.
              </div>
            </div>
            ) : null }
        </header>
        <div className="base">
          <div className="card-main">
            {this.props.children}
          </div>
          {isAuthorised ?
            <AccountInfo
              isLoading={fetchingAccountInfo}
              done={accountInfo.done}
              available={accountInfo.available}
              refresh={() => { getAccountInfo(); }}
            /> : null}
        </div>
      </div>
    );
  }
}
