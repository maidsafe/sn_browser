import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { reconnect } from '../actions/safeBrowserApplication_actions';
import { Button, Spin } from 'antd';
import 'antd/lib/button/style';
import 'antd/lib/spin/style';
import PropTypes from 'prop-types';
import logger from 'logger';
import './wrapNotifier.less'

function mapStateToProps( state )
{
    return {
        isConnecting : state.safeBrowserApp.isConnecting
    };
}

function mapDispatchToProps( dispatch )
{
    const actions =
        {
            reconnect
        };
    return bindActionCreators( actions, dispatch );
}


const wrapNotifier = ( Notifier, extensionFunctionality = {} ) =>
{
    class WrapNotifier extends Component
    {
        constructor()
        {
            super();
            this.state = { countdown: 0 };
        }

        componentWillReceiveProps( nextProps )
        {
            const { countdown } = this.state;
            if ( nextProps.handleReconnect && countdown <= 0 )
            {
                const fifteenSecs = Date.now() + 15000;

                const intervalID = setInterval( () =>
                {
                    const currentSecs = Date.now();
                    const remainingMs = fifteenSecs - currentSecs;
                    const remainingSecs = Math.ceil( remainingMs / 1000 );
                    this.setState( { countdown: remainingSecs } );
                    if ( remainingSecs <= 0 )
                    {
                        clearInterval( intervalID );
                    }
                }, 1000 );
            }
        }

        render()
        {
            const { handleReconnect, reconnect, isConnecting } = this.props;
            const { countdown } = this.state;

            return (
                <div>
                    <Notifier
                        { ...this.props }
                    />
                    { handleReconnect &&
                        <div
                            className="container"
                        >
                            <Button
                                type="default"
                                size="large"
                                loading={ isConnecting }
                                onClick={ () =>
                                {
                                    if ( !isConnecting )
                                    {
                                        return reconnect()
                                    }
                                } }
                            >
                                { !isConnecting && countdown > 0 &&
                                    `Reconnecting in ${countdown} seconds`
                                }
                                { countdown <= 0 &&
                                    'Reconnect'
                                }
                            </Button>
                        </div>
                    }
                </div>
            );
        }
    }

    const hookedUpInput = connect( mapStateToProps, mapDispatchToProps )( WrapNotifier );

    return hookedUpInput;
};

export default wrapNotifier;
