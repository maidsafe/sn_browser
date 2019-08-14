import * as React from 'react';
import classNames from 'classnames';
import { AUTH_UI_CLASSES } from '$Extensions/safe/auth-web-app/classes';
import { I18n } from 'react-redux-i18n';
import { parseAppName, getAppIconClassName } from '../utils';
import { Popup } from './popup';
import { CardLoaderFull } from './card_loader_full';
import { CONSTANTS } from '../constants';

interface AppInfoOptions {
  id: string;
  name: string;
  vendor: string;
}
interface AuthorisedAppsoptions {
  [index: number]: { app_info: AppInfoOptions };
}
interface SearchResultOptions {
  [index: number]: { app_info: AppInfoOptions };
}
interface PropTypes {
  fetchingApps: boolean;
  authorisedApps: AuthorisedAppsoptions;
  searchResult: SearchResultOptions;
  searchApp: (...args: Array<any>) => any;
  clearSearch: (...args: Array<any>) => any;
  clearAppError: (...args: Array<any>) => any;
  getAuthorisedApps: (...args: Array<any>) => any;
  revokeError: (...args: Array<any>) => any;
  appListError: (...args: Array<any>) => any;
  reAuthoriseState: (...args: Array<any>) => any;
  setReAuthoriseState: (...args: Array<any>) => any;
  getAccountInfo: (...args: Array<any>) => any;
}

interface ContextTypes {
  router: object;
}

export class AppList extends React.Component<PropTypes, ContextTypes> {
  constructor() {
    super();
    this.title = I18n.t('authorised_apps_title');
    this.getSearchContainer = this.getSearchContainer.bind(this);
    this.getNoAppsContainer = this.getNoAppsContainer.bind(this);
    this.getReAuthoriseState = this.getReAuthoriseState.bind(this);
    this.getApps = this.getApps.bind(this);
    this.resetPopup = this.resetPopup.bind(this);
    this.state = {
      searchActive: false,
      showPopup: false,
      popupTitle: null,
      popupDesc: null,
      isError: false
    };
  }

  componentDidMount() {
    if (!this.props.isAuthorised) {
      return this.props.push('/login');
    }
    this.props.getAuthorisedApps();
    this.props.getAccountInfo();
  }

  componentWillUpdate(nextProps) {
    if (!nextProps.isAuthorised) {
      return this.props.push('/login');
    }
    if (this.state.showPopup) {
      return;
    }
    if (this.props.revokeError) {
      this.setState({
        showPopup: true,
        popupTitle: I18n.t('messages.err_revoke_app'),
        popupDesc: this.props.revokeError,
        isError: true
      });
    } else if (this.props.appListError) {
      this.setState({
        showPopup: true,
        popupTitle: I18n.t('messages.err_fetch_apps'),
        popupDesc: this.props.appListError,
        isError: true
      });
    }
  }

  componentDidUpdate() {
    // focus search
    if (this.state.searchActive && !this.searchInput.value) {
      this.searchInput.focus();
    }
  }

  getNoAppsContainer() {
    return (
      <div className="no-apps">
        <h3 className="no-apps-h">{I18n.t('messages.no_apps_yet')}</h3>
        <div className="no-apps-img" />
        <div className="no-apps-down">
          <h3 className="no-apps-down-h">
            {I18n.t('messages.get_sample_app')}
          </h3>
          <a
            rel="noopener noreferrer"
            href={I18n.t('urls.safe_examples')}
            target="_blank"
            className="no-apps-down-lnk"
          >
            {I18n.t('urls.safe_examples')}
          </a>
        </div>
      </div>
    );
  }

  getSearchContainer() {
    const searchClassNames = classNames('app-list-search', {
      active: this.state.searchActive
    });
    return (
      <div className={searchClassNames}>
        <button
          type="button"
          className="app-list-search-icn"
          aria-label={I18n.t('aria.search_app_list')}
          onClick={() => {
            this.setState({ searchActive: true });
          }}
        >
          {''}
        </button>
        <div className="app-list-search-ipt">
          <input
            key="search-input"
            type="text"
            aria-label={I18n.t('aria.search_app_list_input')}
            ref={(c) => {
              this.searchInput = c;
            }}
            onChange={(e) => {
              this.props.searchApp(e.target.value);
            }}
          />
          <button
            key="search-button"
            type="button"
            className="app-list-search-cancel"
            aria-label={I18n.t('aria.search_app_list_cancel')}
            onClick={() => {
              this.setState({ searchActive: false });
              this.searchInput.value = '';
              this.props.clearSearch();
            }}
          >
            {''}
          </button>
        </div>
      </div>
    );
  }

  getNoMatchingAppsContainer() {
    return (
      <div className="no-apps">{I18n.t('messages.empty_search_result')}</div>
    );
  }

  getApps() {
    const { authorisedApps, searchResult } = this.props;
    let apps = [];

    if (authorisedApps.length === 0) {
      return this.getNoAppsContainer();
    }
    const appList =
      this.state.searchActive && this.searchInput.value
        ? searchResult
        : authorisedApps;
    if (appList.length === 0) {
      return this.getNoMatchingAppsContainer();
    }
    apps = appList
      .sort((a, b) => {
        if (a.app_info.name < b.app_info.name) return -1;
        if (a.app_info.name > b.app_info.name) return 1;
        return 0;
      })
      .map((app, i) => {
        const path = `/app_details?id=${app.app_info.id}&index=${i}`;
        return (
          <div key={i}>
            <a
              tabIndex="0"
              onClick={() => {
                this.props.push(path);
              }}
            >
              <div className="app-list-i">
                <div className="app-list-i-b">
                  <div className={getAppIconClassName(i)}>
                    {app.app_info.name.slice(0, 2)}
                  </div>
                  <div className="app-list-i-name">
                    {parseAppName(app.app_info.name)}
                  </div>
                </div>
              </div>
            </a>
          </div>
        );
      });
    return apps;
  }

  getReAuthoriseState() {
    const { reAuthoriseState, setReAuthoriseState } = this.props;
    const iconClassName = classNames('icn', {
      lock: reAuthoriseState === CONSTANTS.RE_AUTHORISE.STATE.LOCK,
      unlock: reAuthoriseState === CONSTANTS.RE_AUTHORISE.STATE.UNLOCK
    });
    const message =
      reAuthoriseState === CONSTANTS.RE_AUTHORISE.STATE.LOCK
        ? CONSTANTS.RE_AUTHORISE.LOCK_MSG
        : CONSTANTS.RE_AUTHORISE.UNLOCK_MSG;

    return (
      <div className="reauthorise-state">
        <button
          className={iconClassName}
          aria-label={
            reAuthoriseState
              ? I18n.t('aria.reauth_unlock')
              : I18n.t('aria.reauth_lock')
          }
          onClick={() => {
            const state =
              reAuthoriseState === CONSTANTS.RE_AUTHORISE.STATE.LOCK
                ? CONSTANTS.RE_AUTHORISE.STATE.UNLOCK
                : CONSTANTS.RE_AUTHORISE.STATE.LOCK;
            setReAuthoriseState(state);
          }}
        >
          {''}
        </button>
        <span className="msg">{message}</span>
      </div>
    );
  }

  resetPopup() {
    this.setState({
      showPopup: false,
      popupTitle: null,
      popupDesc: null
    });
  }

  render() {
    const { fetchingApps, authorisedApps, clearAppError } = this.props;
    const { showPopup, isError, popupDesc, popupTitle } = this.state;

    return (
      <div className="card-main-b">
        <div className="card-main-h">{this.title}</div>
        <div className="card-main-cntr">
          {this.getReAuthoriseState()}
          {fetchingApps ? (
            <CardLoaderFull msg={I18n.t('messages.fetching_apps')}>
              {''}
            </CardLoaderFull>
          ) : null}
          <Popup
            show={showPopup}
            error={isError}
            callback={() => {
              clearAppError();
              this.resetPopup();
            }}
            title={popupTitle}
            desc={popupDesc}
          />
          <div className={`app-list ${AUTH_UI_CLASSES.AUTH_APP_LIST}`}>
            {authorisedApps.length === 0 ? null : this.getSearchContainer()}
            {this.getApps()}
          </div>
        </div>
      </div>
    );
  }
}
