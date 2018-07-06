import React, { Component } from 'react';
// import styles from './browser.css';
import { CLASSES, isRunningSpectronTestProcess } from 'appConstants';
import { SAFE } from 'extensions/safe/constants';
import { Column, Icon, Grid } from 'nessie-ui';
import logger from 'logger';
import styles from './webIdButtons.css'

export const wrapAddressbarButtons = ( AddressBarButtons, extensionFunctionality = {} ) =>
{
    return class wrappedAddressbarButtons extends Component {
        constructor(props) {
            super(props);
        }

        static defaultProps =
        {
            peruseApp            : {
                webIds: []
            }
        }

        handleIdClick = ( webId, event ) =>
        {
            const { setCurrentWebId } = this.props;
            setCurrentWebId( webId.id );
        }

        handleIdButtonClick = ( webId, event ) =>
        {
            const { setCurrentWebId } = this.props;
            console.log('clickedIdButton')
            this.props.updateActiveTab( { url: 'http://localhost:1234' } );

        }

        handleMouseEnter = ( ) =>
        {
            const { getAvailableWebIds, showWebIdDropdown, peruseApp } = this.props;

            logger.info('Icon hovered... triggering getWebIds');
            if( peruseApp.appStatus === SAFE.APP_STATUS.AUTHORISED )
            {
                getAvailableWebIds();
            }

            showWebIdDropdown( true );
        }

        handleMouseLeave = ( ) =>
        {
            const { showWebIdDropdown } = this.props;

            showWebIdDropdown( false );
        }

        render() {
            const { peruseApp } = this.props;
            const { showingWebIdDropdown, webIds, appStatus } = peruseApp;

            const handleIdClick = this.handleIdClick;
            const webIdsList = webIds.map( webId =>
            {
                const nickname = webId["#me"].nick || webId["#me"].name;

                if( webId.isSelected ){

                  return (
                      <li
                          onClick={ handleIdClick.bind( this, webId )  }
                          key={webId.id}
                          className={styles.selectedWebId}
                          >{ nickname }
                      </li>
                  )
              }

              return ( <li
                  onClick={ handleIdClick.bind( this, webId ) }
                  key={webId.id}
                  className={styles.webId}
                  >
                      { nickname }
                  </li> )
            });

            let webIdDropdownContents;

            if( appStatus !== SAFE.APP_STATUS.AUTHORISED )
            {
                webIdDropdownContents = <li key="noAuth">Authorise to display your WebIds.</li>;
            }
            else if( webIdsList.length > 0 )
            {
                webIdDropdownContents = webIdsList;
            } else
            {
                webIdDropdownContents = <li  key="noId">No WebIds Found.</li>;

            }




            return (
                <Grid gutters="M">
                    <Column align="center" verticalAlign="middle">
                        <AddressBarButtons {...this.props}/>
                    </Column>
                    <Column size="icon-M" align="center" verticalAlign="middle">
                        <div onMouseEnter={ this.handleMouseEnter }
                            onMouseLeave={ this.handleMouseLeave }
                            onClick={ this.handleIdButtonClick }
                            >
                                <Icon
                                    theme="navigation"
                                    type="account"
                                    size="S"
                                    style={{cursor:'pointer'}}
                                />
                                {
                                    showingWebIdDropdown &&
                                    <ul className={styles.webIdList}>

                                        {webIdDropdownContents}

                                    </ul>
                                }
                        </div>
                    </Column>

                </Grid>
            )
        }
    }
}
