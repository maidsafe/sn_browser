import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class Popup extends Component {
  static propTypes = {
    show: PropTypes.bool.isRequired,
    error: PropTypes.bool,
    title: PropTypes.string,
    desc: PropTypes.string,
    callback: PropTypes.func
  };

  constructor() {
    super();
    this.state = {
      showDetail: false
    };
  }

  render() {
    if (!this.props.show) {
      return <span>{' '}</span>;
    }
    const popupClass = classNames(
      'popup-cont',
      {
        error: this.props.error
      }
    );

    const showDetailClass = classNames(
      'detailed-desc',
      {
        show: this.state.showDetail
      }
    );

    return (
      <div className="popup">
        <div className="popup-b">
          <div className={popupClass}>
            <span className="icn">{''}</span>
            <span className="desc">{this.props.title}</span>
            {
              this.props.desc ? (
                <div className={showDetailClass}>
                  <span className="info">{this.props.desc}</span>
                  <button
                    className="head"
                    onClick={() => {
                      this.setState({ showDetail: !this.state.showDetail });
                    }}
                  >{this.state.showDetail ? 'less' : 'more'}</button>
                </div>) : null
            }
            <div className="opt">
              <button
                type="button"
                className="btn flat primary"
                onClick={() => {
                  this.props.callback();
                }}
              >Ok
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
