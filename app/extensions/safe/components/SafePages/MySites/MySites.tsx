import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Typography from '@material-ui/core/Typography';

import styles from './mysites.css';

import { NrsRegistryBar } from '$Extensions/safe/components/NrsRegistryBar';
import { registerNrsName as registerNrsNameOnNetwork } from '$Extensions/safe/actions/aliased';
import { setNameAsMySite as setNameAsMySiteOnNetwork } from '$Extensions/safe/actions/pWeb_actions';
import { PROTOCOLS } from '$Constants';
import { SAFE_PAGES } from '$Extensions/safe/rendererProcess/internalPages';
import { logger } from '$Logger';

function mapStateToProperties( state ) {
    return {
        mySites: state.pWeb.mySites
    };
}
function mapDispatchToProperties( dispatch ) {
    const actions = {
        registerNrsName: registerNrsNameOnNetwork,
        setNameAsMySite: setNameAsMySiteOnNetwork
    };
    return bindActionCreators( actions, dispatch );
}

interface MySitesProps {
    register: string;
    tabId: string;
    tabLoad: Function;
    updateTabUrl: Function;
    registerNrsName: Function;
    setNameAsMySite: Function;
}
export class MySitesComponent extends Component<
MySitesProps,
{ files: Array<string>; hasError: boolean; theError: string }
> {
    static defaultProps = {
        mySites: []
    };

    constructor( props ) {
        super( props );

        this.state = {
            // files: [],
            hasError: false,
            theError: null
        };
    }

    render() {
        const {
            mySites,
            register,
            registerNrsName,
            setNameAsMySite,
            updateTabUrl,
            tabId
        } = this.props;

        if ( this.state && this.state.hasError ) {
            const error = this.state.theError;

            // You can render any custom fallback UI
            return (
                <div>
                    <h4>Something went wrong in MySites.tsx</h4>
                    <span>
                        {JSON.stringify( error, ['message', 'arguments', 'type', 'name'] )}
                    </span>
                </div>
            );
        }

        return (
            <React.Fragment>
                {register && (
                    <div className={styles.createSiteBar}>
                        <NrsRegistryBar
                            address={register}
                            setNameAsMySite={setNameAsMySite}
                            registerNrsName={registerNrsName}
                            updateTabUrl={updateTabUrl}
                            tabId={tabId}
                        />
                    </div>
                )}
                <div className={styles.mySitesPage}>
                    <Typography variant="h3">My Sites</Typography>
                    <List aria-label="main">
                        {mySites.map( ( site ) => {
                            const handleSiteClick = ( event ) => {
                                updateTabUrl( { tabId, url: `${PROTOCOLS.SAFE}://${site}` } );
                            };

                            const handleEditClick = ( event ) => {
                                updateTabUrl( {
                                    tabId,
                                    url: `${PROTOCOLS.INTERNAL_PAGES}://${SAFE_PAGES.EDIT_SITE}/${site}`
                                } );
                            };

                            return (
                                <ListItem button key={site} onClick={handleSiteClick}>
                                    <ListItemText primary={site} />
                                    <ListItemSecondaryAction>
                                        <IconButton
                                            onClick={handleEditClick}
                                            edge="end"
                                            aria-label="edit"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            );
                        } )}
                    </List>
                </div>
            </React.Fragment>
        );
    }
}

export const MySites = connect(
    mapStateToProperties,
    mapDispatchToProperties
)( MySitesComponent );
