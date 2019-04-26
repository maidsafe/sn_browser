import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { CreateAccount } from '../components/create_account';
import * as authActions from '../actions/auth';

const mapStateToProps = state => ( {
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
} );
const mapDispatchToProps = dispatch => ( {
    push: path => dispatch( push( path ) ),
    ...bindActionCreators( authActions, dispatch )
} );

export const CreateAccountContainer = withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )( CreateAccount )
);
