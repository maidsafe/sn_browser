import * as React from 'react';
import { Translate } from 'react-redux-i18n';

interface ListItemOptions {
  data: { object };
  isDefault: boolean;
  loading: boolean;
  revokeApp: (...args: Array<any>) => any;
}

export class ListItem extends React.Component<ListItemOptions> {
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
        <div className="app-list-i default">
          <Translate value="messages.fetching_apps" />
          ...
        </div>
      );
    }
    if (isDefault) {
      return (
        <div className="app-list-i default">
          <Translate value="messages.no_apps" />
        </div>
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
              <span className="permission-h">
                <Translate value="permissions" />
              </span>
              <ul>
                {data.containers ? (
                  data.containers.map((container, index) => (
                    <li key={index}>
                      <span className="permission-icn" />
                      <span className="permission-title">
                        {container.cont_name}
                      </span>
                      {container.access && container.access.length > 0 ? (
                        <div className="permission-i-ls">
                          <ul>
                            {container.access.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </li>
                  ))
                ) : (
                  <li>
                    <span className="permission-icn safe-drive" />
                    <span className="permission-title">
                      <Translate value="no_permissions" />
                    </span>
                  </li>
                )}
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
            >
              <Translate value="buttons.revoke_access" />
            </button>
          </div>
        </div>
      </div>
    );
  }
}
