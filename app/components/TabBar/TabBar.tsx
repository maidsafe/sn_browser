/* eslint-disable */
import { remote } from 'electron';
import url from 'url';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import styles from './tabBar.css';
import { Button, Row, Col, Icon } from 'antd';
import 'antd/lib/icon/style';
import 'antd/lib/button/style';
import 'antd/lib/row/style';
import 'antd/lib/col/style';
import { I18n } from 'react-redux-i18n';

import { logger } from '$Logger';
import { isInternalPage } from '$Utils/urlHelpers';
import { CLASSES, INTERNAL_PAGES } from '$Constants';

type TabBarProps = {
  tabInFocus: number;
  activeTab: any;
  activeTabId: any;
  setActiveTab: (...args: any[]) => any;
  selectAddressBar:  (...args: any[]) => any;
  addTabNext:  (...args: any[]) => any;
  addTabEnd:  (...args: any[]) => any;
  closeTab: (...args: any[]) => any;
  windowId: any;
  windows : {};
  tabs: any[];
};
type TabBarState = {
  tabInFocus: number;
};
export default class TabBar extends Component<TabBarProps, TabBarState>{
  static default ={
    tabs : [],
    tabInFocus: 0
    // have to add tab in focus
  };
  constructor(props){
    super(props);
    this.state ={
      tabInFocus: 0
    };
    this.handleAddTabClick = this.handleAddTabClick.bind(this);
  };
  handleAddTabClick(event)
  {
    event.stopPropagation();
    const { windowId, addTabEnd, selectAddressBar } = this.props;
    event.stopPropagation();
    const tabId = Math.random().toString( 36 );
    addTabEnd({
      tabId,
      windowId
    });
    selectAddressBar({
      tabId
    });
  };
  handleTabClose(tabId, event)
  {
    event.stopPropagation();
    const { closeTab, windowId } = this.props;
    closeTab({ tabId, windowId });
  };
  handleTabClick(tabId, event)
  {
    event.stopPropagation();
    const { setActiveTab, windowId } = this.props;
    setActiveTab({
      tabId,
      windowId
    });
  };
  getTabs = () => {
    const {tabs, windowId, activeTabId} = this.props;
    const currentWindow = Object.keys(this.props.windows.openWindows).length>=1 ? this.props.windows.openWindows[windowId] : {};
    return tabs.map((tab, i)=>{
      let title= tab.title;
      let tabId = tab.tabId;
      if (isInternalPage(tab)) {
        const urlObj = url.parse(tab.url);
        switch (urlObj.host) {
          case INTERNAL_PAGES.HISTORY: {
            title = 'History';
            break;
          }
          case INTERNAL_PAGES.BOOKMARKS: {
            title = 'Bookmarks';
            break;
          }
          default: {
            title = null;
            break;
          }
        }
      }
      let tabStyleClass = styles.tab;
      if (tabId === activeTabId) {
        tabStyleClass = `${styles.activeTab} ${CLASSES.ACTIVE_TAB}`;
      }
      return (
          <div
              key={tab.tabId}
              className={`${tabStyleClass} ${CLASSES.TAB}`}
              onClick={this.handleTabClick.bind( this, tabId )}
          >
              <Row align="middle" justify="space-between" type="flex">
                  <Col>
                      <div className={styles.faviconContainer}>
                          {tab.isLoading && (
                              <Icon type="loading" className={styles.loadingIcon} />
                          )}
                          {!tab.isLoading && tab.favicon && (
                              <img
                                  alt=""
                                  className={styles.favicon}
                                  id="favicon-img"
                                  src={tab.favicon}
                              />
                          )}
                      </div>
                  </Col>
                  <Col className={styles.tabText}>{title || 'New Tab'}</Col>
                  <Col>
                      <Icon
                          className={`${CLASSES.CLOSE_TAB} ${styles.closeTab}`}
                          size="small"
                          shape="circle"
                          type="close"
                          title={I18n.t( 'close-tab' )}
                          aria-label={I18n.t( 'aria.close-tab' )}
                          onClick={this.handleTabClose.bind( this, tabId )}
                      />
                  </Col>
              </Row>
          </div>
      );
    });
  };
  render(){
      return (
          <div
              className={[
                  styles.container,
                  process.platform === 'darwin' ? styles.containerMac : ''
              ].join( ' ' )}
          >
              <div className={styles.tabBar}>
                  {this.getTabs()}
                  <Icon
                      className={`${CLASSES.ADD_TAB} ${styles.addTab}`}
                      size="small"
                      type="plus"
                      title={I18n.t( 'add-tab' )}
                      aria-label={I18n.t( 'aria.add-tab' )}
                      onClick={this.handleAddTabClick.bind( this )}
                  />
              </div>
          </div>
      );
  }
};
