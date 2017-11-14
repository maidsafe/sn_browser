import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Login from '../components/login';
import {
  login,
  clearAuthLoader,
  clearError,
  hideLibErrPopup } from '../actions/auth';

const mapStateToProps = (state) => (
  {
    networkState: state.networkState.state,
    error: state.auth.error,
    loading: state.auth.loading,
    isAuthorised: state.auth.isAuthorised,
    libErrPopup: state.auth.libErrPopup
  }
);

const mapDispatchToProps = (dispatch) => (
  bindActionCreators({
    login,
    clearAuthLoader,
    clearError,
    hideLibErrPopup }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(Login);
