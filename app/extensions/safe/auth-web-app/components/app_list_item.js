import React, { Component, PropTypes } from 'react';
import { Translate } from 'react-redux-i18n';

export default class ListItem extends Component {
  static propTypes = {
    data: PropTypes.shape({}),
    isDefault: PropTypes.bool,
    loading: PropTypes.bool,
    revokeApp: PropTypes.func
  };

  constructor() {
    super();
    this.toggleList = this.toggleList.bind(this);
  }

  toggleList(e) {
    e.preventDefault();
    const toggleClassName = 'expand';
    if (this.listItem.classList.contains(toggleClassName)) {
      return this.listItem.classList.remove(toggleClassName);
    }
    return this.listItem.classList.add(toggleClassName);
  }

  render() {
    const { loading, isDefault, data, revokeApp } = this.props;

    if (loading) {
      return (
        <div className="app-list-i default"><Translate value="Fetching apps" />...</div>
      );
    }
    if (isDefault) {
      return (
        <div className="app-list-i default"><Translate value="No Apps Found" /></div>
      );
    }
    return (
      <div
        className="app-list-i"
        ref={(c) => {
          this.listItem = c;
        }}
        onClick={this.toggleList}
      >
        <div className="icn">
          <span>{data.app_info.name[0]}</span>
        </div>
        <div className="ctn">
          <div className="i-cnt">
            <div className="title">
              <span>{data.app_info.name}</span>
            </div>
            <div className="vendor">
              <span>{data.app_info.vendor}</span>
            </div>
          </div>
          <div className="app-list-detail">
            <div className="permission">
              <span className="permission-h"><Translate value="Permissions" /></span>
              <ul>
                { data.containers ?
                  data.containers.map((container, index) =>
                    (
                      <li key={index}>
                        <span className="permission-icn">{''}</span>
                        <span className="permission-title">{container.cont_name}</span>
                        {
                          (container.access && container.access.length > 0) ? (
                            <div className="permission-i-ls">
                              <ul>
                                {
                                  container.access.map((item, i) => (
                                    <li key={i}>{item}</li>
                                  ))
                                }
                              </ul>
                            </div>
                          ) : null
                        }
                      </li>
                    )
                  ) : (
                    <li>
                      <span className="permission-icn safe-drive">{''}</span>
                      <span className="permission-title">No permission</span>
                    </li>
                  )
                }
              </ul>
            </div>
          </div>
        </div>
        <div className="opts">
          <div className="opt">
            <button
              type="button"
              className="btn"
              onClick={(e) => {
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
                revokeApp(data.app_info.id);
              }}
            ><Translate value="Revoke Access" /></button>
          </div>
        </div>
      </div>
    );
  }
}
