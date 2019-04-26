import React from 'react';

export const Error = props => {
    const { error } = props;
    const pageStyle = {
        width: '100%',
        paddingTop: '3px',
        paddingBottom: '3px',
        display: 'flex',
        flex: 'none',
        alignContent: 'center',
        boxSizing: 'border-box',
        borderRight: '0',
        overflow: 'auto'
    };
    const constainerStyle = {
        margin: '0 auto'
    };
    const contentStyle = {
        textAlign: 'center'
    };
    return (
        <div style={pageStyle}>
            <div style={constainerStyle}>
                <h3 key="header" style={contentStyle}>
                    {error.header}
                </h3>
                {error.subHeader && (
                    <h4 key="subHeader" style={contentStyle}>
                        {error.subHeader}
                    </h4>
                )}
            </div>
        </div>
    );
};
