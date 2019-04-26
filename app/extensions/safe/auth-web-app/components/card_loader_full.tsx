import React from 'react';

interface PropTypes {
    msg: string;
}

export const CardLoaderFull = ( props: PropTypes ) => {
    return (
        <div className="full-loader">
            <div className="full-loader-b">
                <div className="full-loader-ib">
                    <span className="full-loader-i" />
                    <span className="full-loader-msg">{props.msg}</span>
                </div>
            </div>
        </div>
    );
};
