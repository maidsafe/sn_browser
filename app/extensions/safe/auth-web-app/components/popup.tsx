import * as React from 'react';
import classNames from 'classnames';

interface PropTypes {
  show: boolean;
  error?: boolean;
  title?: string;
  desc?: string;
  callback?: (...args: Array<any>) => any;
}

export class Popup extends React.Component<PropTypes> {
  constructor() {
    super();
    this.state = {
      showDetail: false
    };
  }

  render() {
    if (!this.props.show) {
      return <span />;
    }
    const popupClass = classNames('popup-cont', {
      error: this.props.error
    });

    const showDetailClass = classNames('detailed-desc', {
      show: this.state.showDetail
    });

    return (
      <div className="popup">
        <div className="popup-b">
          <div className={popupClass}>
            <span className="icn" />
            <span className="desc">{this.props.title}</span>
            {this.props.desc ? (
              <div className={showDetailClass}>
                <span className="info">{this.props.desc}</span>
                <button
                  className="head"
                  onClick={() => {
                    this.setState({
                      showDetail: !this.state.showDetail
                    });
                  }}
                >
                  {this.state.showDetail ? 'less' : 'more'}
                </button>
              </div>
            ) : null}
            <div className="opt">
              <button
                type="button"
                className="btn flat primary"
                onClick={() => {
                  this.props.callback();
                }}
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
