import * as React from 'react';
import classNames from 'classnames';
import { AUTH_UI_CLASSES } from '$Extensions/safe/auth-web-app/classes';

import { I18n } from 'react-redux-i18n';
import { CONSTANTS } from '../constants';
import { NetworkStatus } from './network_status';
import { AccountInfo } from './account_info';

interface AccountInfoOptions {
  done: number;
  available: number;
}

interface PropTypes {
  children: JSX.Element;
  networkState: number;
  isAuthorised: boolean;
  fetchingAccountInfo: boolean;
  accountInfo: AccountInfoOptions;
  logout: (...args: Array<any>) => any;
  getAccountInfo: (...args: Array<any>) => any;
  setNetworkConnecting: (...args: Array<any>) => any;
}

export class App extends React.Component<PropTypes> {
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
          className={`logout ${AUTH_UI_CLASSES.AUTH_LOGOUT_BUTTON}`}
          aria-label={I18n.t('buttons.logout')}
          onClick={() => {
            logout();
          }}
        >
          {I18n.t('buttons.logout')}
        </button>
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
      getAccountInfo
    } = this.props;

    const appLogoClassname = classNames('h-app-logo', {
      'safe-auth-icon': !isAuthorised
    });

    return (
      <div className="root">
        <header>
          <div className="h-app-name" />
          <div className={appLogoClassname}>
            {isAuthorised ? <NetworkStatus status={networkState} /> : null}
          </div>
          {this.getHeaderOptions()}
          {networkState === CONSTANTS.NETWORK_STATUS.DISCONNECTED &&
          isAuthorised ? (
            <div className="nw-state-alert">
              <div className="nw-status-alert-b">
                {I18n.t('messages.disconnected')}
                <button
                  type="button"
                  aria-label={I18n.t('buttons.reconnect')}
                  onClick={() => {
                    setNetworkConnecting();
                  }}
                >
                  {I18n.t('buttons.reconnect')}
                </button>
              </div>
            </div>
          ) : null}
        </header>
        <div className="base">
          <div className="card-main">{this.props.children}</div>
          {isAuthorised ? (
            <AccountInfo
              isLoading={fetchingAccountInfo}
              done={accountInfo.done}
              available={accountInfo.available}
              refresh={() => {
                getAccountInfo();
              }}
            />
          ) : null}
        </div>
      </div>
    );
  }
}
