import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class AccountInfo extends Component {
  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    done: PropTypes.number.isRequired,
    available: PropTypes.number,
    refresh: PropTypes.func.isRequired
  };

  render() {
    const { done, available, isLoading, refresh } = this.props;
    const total = done + available;
    const totalStr = (typeof available === 'string') ? '' : `/${total}`;
    const safePercentage = total / 2;
    const warnPercentage = Math.floor(total / 1.1);
    const statusClassName = classNames(
      'acc-info-status',
      {
        safer: (done > 0 && done < safePercentage),
        okay: (done > safePercentage && done < warnPercentage),
        danger: (done > warnPercentage),
      }
    );
    return (
      <div className="acc-info">
        <div className="acc-info-b">
          <div className={statusClassName}>
            <span className="label">Account Status:</span>
            <span className="val">{done || 0}{totalStr}</span>
            <button
              type="button"
              className="refresh"
              disabled={isLoading}
              onClick={() => {
                refresh();
              }}
            >{''}</button>
            <div className="tooltip">The number of store and modify operations completed on this account</div>
          </div>
          <div className="timer"><span className="val">02:00</span></div>
        </div>
      </div>
    );
  }
}
