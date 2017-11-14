import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import App from '../components/app';
import { logout } from '../actions/auth';
import { getAccountInfo } from '../actions/app';
import { setNetworkConnecting } from '../actions/network_state';

const mapStateToProps = (state) => (
  {
    networkState: state.networkState.state,
    isAuthorised: state.auth.isAuthorised,
    loading: state.app.loading,
    accountInfo: state.app.accountInfo,
    fetchingAccountInfo: state.app.fetchingAccountInfo
  }
);

const mapDispatchToProps = (dispatch) => (
  bindActionCreators({ logout, setNetworkConnecting, getAccountInfo }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(App);
