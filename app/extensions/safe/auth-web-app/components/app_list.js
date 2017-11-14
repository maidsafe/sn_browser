import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';
import { parseAppName, getAppIconClassName } from '../utils';
import Popup from './popup';
import CardLoaderFull from './card_loader_full';
import CONSTANTS from '../../constants';

export default class AppList extends Component {
  static propTypes = {
    fetchingApps: PropTypes.bool.isRequired,
    authorisedApps: PropTypes.arrayOf(PropTypes.shape({
      app_info: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        vendor: PropTypes.string,
      })
    })),
    searchResult: PropTypes.arrayOf(PropTypes.shape({
      app_info: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        vendor: PropTypes.string,
      })
    })),
    searchApp: PropTypes.func,
    clearSearch: PropTypes.func,
    clearAppError: PropTypes.func,
    getAuthorisedApps: PropTypes.func,
    revokeError: PropTypes.string,
    appListError: PropTypes.string,
    reAuthoriseState: PropTypes.number,
    setReAuthoriseState: PropTypes.func,
    getAccountInfo: PropTypes.func
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  constructor() {
    super();
    this.title = 'Authorised Apps';
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
    this.props.getAuthorisedApps();
    this.props.getAccountInfo();
  }

  componentWillUpdate(nextProps) {
    if (!nextProps.isAuthorised) {
      return this.context.router.push('/login');
    }
    if (this.state.showPopup) {
      return;
    }
    if (this.props.revokeError) {
      this.setState({
        showPopup: true,
        popupTitle: 'Unable to revoke app. Please try again.',
        popupDesc: this.props.revokeError,
        isError: true
      });
    } else if (this.props.appListError) {
      this.setState({
        showPopup: true,
        popupTitle: 'Unable to fetch registered apps. Please try again.',
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
        <h3 className="no-apps-h">Looks like you haven&lsquo;t authorised any apps yet.</h3>
        <div className="no-apps-img">{''}</div>
        <div className="no-apps-down">
          <h3 className="no-apps-down-h">Download sample applications here...</h3>
          <a
            rel="noopener noreferrer"
            href="https://github.com/maidsafe/safe_examples/releases"
            target="_blank"
            className="no-apps-down-lnk"
          >https://github.com/maidsafe/safe_examples/releases</a>
        </div>
      </div>
    );
  }

  getSearchContainer() {
    const searchClassNames = classNames(
      'app-list-search',
      {
        active: this.state.searchActive
      }
    );
    return (
      <div className={searchClassNames}>
        <button
          type="button"
          className="app-list-search-icn"
          onClick={() => {
            this.setState({ searchActive: true });
          }}
        >{''}</button>
        <div className="app-list-search-ipt">
          <input
            type="text"
            name="appListSearch"
            ref={(c) => {
              this.searchInput = c;
            }}
            onChange={(e) => {
              this.props.searchApp(e.target.value);
            }}
          />
          <button
            type="button"
            className="app-list-search-cancel"
            onClick={() => {
              this.setState({ searchActive: false });
              this.searchInput.value = '';
              this.props.clearSearch();
            }}
          >{''}</button>
        </div>
      </div>
    );
  }

  getNoMatchingAppsContainer() {
    return (
      <div className="no-apps">
        No apps match the search criteria
      </div>
    );
  }

  getApps() {
    const { authorisedApps, searchResult } = this.props;
    let apps = [];

    if (authorisedApps.length === 0) {
      return this.getNoAppsContainer();
    }
    const appList = (this.state.searchActive &&
    this.searchInput.value) ? searchResult : authorisedApps;
    if (appList.length === 0) {
      return this.getNoMatchingAppsContainer();
    }
    apps = appList.sort((a, b) => {
      if (a.app_info.name < b.app_info.name) return -1;
      if (a.app_info.name > b.app_info.name) return 1;
      return 0;
    }).map((app, i) => (
      <Link key={i} to={`/app_details?id=${app.app_info.id}&index=${i}`}>
        <div className="app-list-i">
          <div className="app-list-i-b">
            <div className={getAppIconClassName(i)}>{app.app_info.name.slice(0, 2)}</div>
            <div className="app-list-i-name">{parseAppName(app.app_info.name)}</div>
          </div>
        </div>
      </Link>
    ));
    return apps;
  }

  getReAuthoriseState() {
    const { reAuthoriseState, setReAuthoriseState } = this.props;
    const iconClassName = classNames(
      'icn',
      {
        lock: reAuthoriseState === CONSTANTS.RE_AUTHORISE.STATE.LOCK,
        unlock: reAuthoriseState === CONSTANTS.RE_AUTHORISE.STATE.UNLOCK
      }
    );
    const message = (reAuthoriseState === CONSTANTS.RE_AUTHORISE.STATE.LOCK) ?
      CONSTANTS.RE_AUTHORISE.LOCK_MSG : CONSTANTS.RE_AUTHORISE.UNLOCK_MSG;

    return (
      <div className="reauthorise-state">
        <button
          className={iconClassName}
          onClick={() => {
            const state = (reAuthoriseState === CONSTANTS.RE_AUTHORISE.STATE.LOCK) ?
              CONSTANTS.RE_AUTHORISE.STATE.UNLOCK : CONSTANTS.RE_AUTHORISE.STATE.LOCK;
            setReAuthoriseState(state);
          }}
        >{''}</button>
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
        <div className="card-main-h">{ this.title }</div>
        <div className="card-main-cntr">
          { this.getReAuthoriseState() }
          { fetchingApps ? <CardLoaderFull msg="Fetching registered apps">{''}</CardLoaderFull> : null }
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
          <div className="app-list">
            { authorisedApps.length === 0 ? null : this.getSearchContainer() }
            { this.getApps() }
          </div>
        </div>
      </div>
    );
  }
}
