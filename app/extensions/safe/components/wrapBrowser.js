import React, { Component } from 'react';
// import styles from './browser.css';
import { CLASSES, isRunningSpectronTestProcess } from 'appConstants';
import { SAFE } from 'extensions/safe/constants';

// jsx css as babel not currently parsing css files here.
const spectronAreaButton = {
    width   : '1px',
    height  : '10px',
    display : 'inline-block',
};

const spectronArea = {
    backgroundColor : 'blue',
    display         : 'block',
    width           : '100%',
    height          : '10px'
};

const browserContainer = {
    textAlign     : 'center',
    height        : '100%',
    display       : 'flex',
    flexDirection : 'column',
    position      : 'relative'
};

const wrapBrowser = ( BrowserComponent, extensionFunctionality = {} ) =>
    class wrappedSafeBrowser extends Component
    {
      static defaultProps =
      {
          addressBarIsSelected : false,
          tabs                 : [],
          bookmarks            : [],
          notifications        : []
      }


      handleSpectronTestSaveState = ( ) =>
      {
          const { setSaveConfigStatus } = this.props;

          setSaveConfigStatus( SAFE.SAVE_STATUS.TO_SAVE );
      }

      handleSpectronTestReadState = ( ) =>
      {
          const { setReadConfigStatus } = this.props;

          setReadConfigStatus( SAFE.READ_STATUS.TO_READ );
      }

      render()
      {
          const { safeBrowserApp } = this.props;

          return (
              <div style={ browserContainer }>
                  {
                      isRunningSpectronTestProcess &&
                      <div
                          className={ `${CLASSES.SPECTRON_AREA}` }
                          // hard setting style just now, as babel is not parsing css
                          style={ spectronArea }
                      >
                          <button
                              style={ spectronAreaButton }
                              className={ `${CLASSES.SPECTRON_AREA__SPOOF_SAVE}` }
                              onClick={ this.handleSpectronTestSaveState }
                          />
                          <button
                              style={ spectronAreaButton }
                              className={ `${CLASSES.SPECTRON_AREA__SPOOF_LOAD}` }
                              onClick={ this.handleSpectronTestReadState }
                          />
                      </div>

                  }
                  <BrowserComponent { ...this.props } />
              </div>
          );
      }
    };

export default wrapBrowser;
