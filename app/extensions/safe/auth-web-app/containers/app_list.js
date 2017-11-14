import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AppList from '../components/app_list';
import * as appActions from '../actions/app';

const mapStateToProps = (state) => (
  {
    isAuthorised: state.auth.isAuthorised,
    fetchingApps: state.app.fetchingApps,
    authorisedApps: state.app.authorisedApps,
    loading: state.app.loading,
    searchResult: state.app.searchResult,
    revokeError: state.app.revokeError,
    appListError: state.app.appListError,
    reAuthoriseState: state.app.reAuthoriseState
  }
);

const mapDispatchToProps = (dispatch) => (
  bindActionCreators(appActions, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(AppList);
