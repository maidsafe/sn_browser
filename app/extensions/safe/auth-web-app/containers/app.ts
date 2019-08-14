import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import { withRouter } from 'react-router';
import { App } from '../components/app';
import { logout } from '../actions/auth';
import { getAccountInfo } from '../actions/app';
import { setNetworkConnecting } from '../actions/network_state';

const mapStateToProps = (state) => ({
  networkState: state.networkState.state,
  isAuthorised: state.auth.isAuthorised,
  loading: state.app.loading,
  accountInfo: state.app.accountInfo,
  fetchingAccountInfo: state.app.fetchingAccountInfo
});

const mapDispatchToProps = (dispatch) => ({
  push: (path) => dispatch(push(path)),
  ...bindActionCreators(
    { logout, setNetworkConnecting, getAccountInfo },
    dispatch
  )
});

export const AppContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
