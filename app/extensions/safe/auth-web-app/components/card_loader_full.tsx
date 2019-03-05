import * as React from "react";

interface propTypes {
    msg: string;
}

export default class CardLoaderFull extends React.Component<propTypes>
{
    render()
    {
        return (
            <div className="full-loader">
                <div className="full-loader-b">
                    <div className="full-loader-ib">
                        <span className="full-loader-i" />
                        <span className="full-loader-msg">
                            {this.props.msg}
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}
