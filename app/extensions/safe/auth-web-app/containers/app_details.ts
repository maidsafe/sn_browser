import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { bindActionCreators } from 'redux';
import { AppDetails } from '../components/app_details';
import { getAuthorisedApps, revokeApp } from '../actions/app';

const mapStateToProps = (state) => ({
  isAuthorised: state.auth.isAuthorised,
  fetchingApps: state.app.fetchingApps,
  authorisedApps: state.app.authorisedApps,
  loading: state.app.loading,
  revoked: state.app.revoked,
  revokeError: state.app.revokeError
});

const mapDispatchToProps = (dispatch) => ({
  push: (path) => dispatch(push(path)),
  ...bindActionCreators({ getAuthorisedApps, revokeApp }, dispatch)
});

export const AppDetailsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AppDetails);
