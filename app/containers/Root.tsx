import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import Routes from '../Routes';

interface Props {
    store: Store;
    history: {};
}

export default class Root extends Component<Props> {
    render() {
        const { store, history } = this.props;
        return (
            <Provider store={store}>
                <ConnectedRouter history={history}>
                    <Routes />
                </ConnectedRouter>
            </Provider>
        );
    }
}
