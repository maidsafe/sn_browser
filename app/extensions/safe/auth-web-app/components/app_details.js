import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { parseAppName, getAppIconClassName } from '../utils';
import CardLoaderFull from './card_loader_full';
import { parseUrl } from 'query-string';
import { I18n } from 'react-redux-i18n';

export default class AppDetails extends Component {
    static propTypes = {
        revoked: PropTypes.bool,
        loading: PropTypes.bool,
        revokeError: PropTypes.string,
        location: PropTypes.shape({
            query: PropTypes.shape({
                id: PropTypes.string,
                index: PropTypes.string
            })
        }),
        router: PropTypes.shape({
            push: PropTypes.func
        }),
        authorisedApps: PropTypes.arrayOf(
            PropTypes.shape({
                app_info: PropTypes.shape({
                    id: PropTypes.string,
                    name: PropTypes.string,
                    vendor: PropTypes.string
                })
            })
        ),
        getAuthorisedApps: PropTypes.func,
        revokeApp: PropTypes.func
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor() {
        super();
        this.getContainers = this.getContainers.bind(this);
    }

    componentWillMount() {
        if (this.props.authorisedApps.length === 0) {
            this.props.getAuthorisedApps();
        }
    }

    componentWillUpdate(nextProps) {
        if (!nextProps.isAuthorised) {
            return this.props.push('/login');
        }
    }

    componentDidUpdate() {
        if (this.props.revoked || this.props.revokeError) {
            return this.props.push('/');
        }
    }

    getContainers(app) {
        return app.containers.map((cont, ci) => {
            let contName = cont.cont_name;
            if (contName === `apps/${app.app_info.id}`) {
                contName = I18n.t('own_container_title');
            }
            return (
                <div key={`cont-${ci}`} className="app-detail-permission">
                    <div className="app-detail-permission-b">
                        <h3 title={contName}>{contName}</h3>
                        <ul>
                            {Object.keys(cont.access).map((access, ai) => {
                                if (!cont.access[access]) {
                                    return null;
                                }
                                return (
                                    <li key={`access-${ai}`}>
                                        {access.replace(/-|_/g, ' ')}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            );
        });
    }

    render() {
        const { location, authorisedApps, revokeApp } = this.props;
        const query = parseUrl(location.search).query;
        const appId = query.id;
        const appIndex = query.index;
        if (!(appId && appIndex)) {
            this.props.push('/');
            return <span>{''}</span>;
        }
        const appDetail = authorisedApps.filter(
            app => appId === app.app_info.id
        )[0];
        if (!appDetail) {
            return <span>{''}</span>;
        }
        const appName = parseAppName(appDetail.app_info.name);
        return (
            <div className="card-main-b">
                <div className="card-main-h-2">
                    <span className={getAppIconClassName(appIndex)}>
                        {appDetail.app_info.name.slice(0, 2)}
                    </span>
                    <b>{appName}</b> Permissions
                </div>
                <div className="card-main-cntr">
                    {this.props.loading && (
                        <CardLoaderFull msg={I18n.t('messages.revoking')}>
                            {''}
                        </CardLoaderFull>
                    )}
                    <div className="app-detail">
                        <div className="app-detail-b">
                            <div className="app-detail-keys">
                                <div className="app-detail-key-i">
                                    <span className="app-detail-key">
                                        {I18n.t('app_detail.name')}:
                                    </span>
                                    <span className="app-detail-value">
                                        {appName}
                                    </span>
                                </div>
                                <div className="app-detail-key-i">
                                    <span className="app-detail-key">
                                        {I18n.t('app_detail.vendor')}:
                                    </span>
                                    <span className="app-detail-value">
                                        {appDetail.app_info.vendor}
                                    </span>
                                </div>
                            </div>
                            <div className="app-detail-permissions">
                                {this.getContainers(appDetail)}
                            </div>
                            <div className="app-detail-f">
                                <button
                                    type="button"
                                    className="lft btn flat"
                                    onClick={() => {
                                        this.props.push('/');
                                    }}
                                >
                                    {I18n.t('buttons.back')}
                                </button>
                                <button
                                    type="button"
                                    className="rgt btn flat danger"
                                    onClick={() => {
                                        revokeApp(appId);
                                    }}
                                >
                                    {I18n.t('buttons.revoke_access')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
