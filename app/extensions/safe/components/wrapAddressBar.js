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

        handleMouseEnter = ( ) =>
        {
            const { showWebIdDropdown } = this.props;

            showWebIdDropdown( true );
        }

        handleMouseLeave = ( ) =>
        {
            const { showWebIdDropdown } = this.props;

            showWebIdDropdown( false );
        }

        render() {
            const { peruseApp } = this.props;
            const { showingWebIdDropdown, webIds } = peruseApp;

            const handleIdClick = this.handleIdClick;

            const webIdDropdownContents = webIds.map( webId =>
            {
              if( webId.isSelected ){

                  return (
                      <li
                          onClick={ handleIdClick.bind( this, webId )  }
                          key={webId.id}
                          className={styles.selectedWebId}
                          >{ webId.name }
                      </li>
                  )
              }

              return ( <li
                  onClick={ handleIdClick.bind( this, webId ) }
                  key={webId.id}
                  className={styles.webId}
                  >
                      { webId.name }
                  </li> )
            });

            return (
                <Grid gutters="S">
                    <Column>
                        <AddressBarButtons {...this.props}/>
                    </Column>
                    <Column size="icon-L">
                        <div onMouseEnter={ this.handleMouseEnter }
                            onMouseLeave={ this.handleMouseLeave }
                            >
                                <Icon
                                    theme="light"
                                    type="account"
                                    size="L"
                                    style={{cursor:'pointer'}}
                                />
                                {
                                    showingWebIdDropdown &&
                                    <ul className={styles.webIdList}>
                                        { webIdDropdownContents }
                                    </ul>
                                }
                        </div>
                    </Column>

                </Grid>
            )
        }
    }
}
