import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CreateAccount from '../components/create_account';
import * as authActions from '../actions/auth';

const mapStateToProps = (state) => (
  {
    isAuthorised: state.auth.isAuthorised,
    networkStatus: state.networkState.state,
    navPos: state.auth.createAccNavPos,
    secretStrength: state.auth.secretStrength,
    passwordStrength: state.auth.passwordStrength,
    error: state.auth.error,
    userSecret: state.auth.userSecret,
    userPassword: state.auth.userPassword,
    inviteCode: state.auth.inviteCode,
    showPopupWindow: state.auth.showPopupWindow,
    loading: state.auth.loading
  }
);
const mapDispatchToProps = (dispatch) => (
  bindActionCreators(authActions, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(CreateAccount);
