import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AppDetails from '../components/app_details';
import { getAuthorisedApps, revokeApp } from '../actions/app';

const mapStateToProps = (state) => (
  {
    isAuthorised: state.auth.isAuthorised,
    fetchingApps: state.app.fetchingApps,
    authorisedApps: state.app.authorisedApps,
    loading: state.app.loading,
    revoked: state.app.revoked,
    revokeError: state.app.revokeError
  }
);

const mapDispatchToProps = (dispatch) => (
  bindActionCreators({ getAuthorisedApps, revokeApp }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(AppDetails);
