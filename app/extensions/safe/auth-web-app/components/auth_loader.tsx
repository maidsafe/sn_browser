import React from 'react';
import { I18n } from 'react-redux-i18n';

interface PropTypes {
    cancelAuthReq: ( ...args: Array<any> ) => any;
}

export const AuthLoader = ( props: PropTypes ) => {
    const { cancelAuthReq } = props;
    return (
        <div className="auth-loader">
            <h3 className="title">
                {window.location.hash.slice( 1 ) === '/create-account'
                    ? I18n.t( 'registering' )
                    : I18n.t( 'authorising' )}{' '}
        SAFE Network!
            </h3>
            <span className="loader" />
            <div className="opt">
                <div className="opt-i">
                    <button
                        type="button"
                        className="btn primary"
                        onClick={() => {
                            cancelAuthReq();
                        }}
                    >
                        {I18n.t( 'buttons.cancel' )}
                    </button>
                </div>
            </div>
        </div>
    );
};
