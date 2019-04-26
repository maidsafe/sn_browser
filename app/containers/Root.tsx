import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { BrowserWindow } from './BrowserWindow';
import { App } from './App';

interface Props {
    store: Store;
}

export class Root extends Component<Props> {
    render() {
        const { store } = this.props;
        return (
            <Provider store={store}>
                <App>
                    <BrowserWindow />
                </App>
            </Provider>
        );
    }
}
