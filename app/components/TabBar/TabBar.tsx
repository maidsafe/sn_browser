/* eslint-disable */
import { remote } from 'electron';
import url from 'url';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import styles from './tabBar.css';
import MdClose from 'react-icons/lib/md/close';
import MdAdd from 'react-icons/lib/md/add';
import { logger } from '$Logger';
import { isInternalPage } from '$Utils/urlHelpers';
import { CLASSES, INTERNAL_PAGES } from '$Constants';
import { Column, Spinner, Row } from 'nessie-ui';

type TabBarProps = {
  tabInFocus: number;
  activeTab: any;
  activeTabId: any;
  setActiveTab: (...args: any[]) => any;
  selectAddressBar:  (...args: any[]) => any;
  addTab:  (...args: any[]) => any;
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
    const { windowId, addTab, addTabEnd,setActiveTab, selectAddressBar } = this.props;
    event.stopPropagation();
    const tabId = Math.random().toString( 36 );
    addTab({
      tabId,
      windowId
    });
    addTabEnd({
      tabId,
      windowId
    });
    setActiveTab({
      tabId,
      windowId
    });
    selectAddressBar({
      tabId
    });
  };
  handleTabClose(tabId, event)
  {
    console.log('tabId',tabId);
    event.stopPropagation();
    const { closeTab, windowId } = this.props;
    closeTab({ tabId, windowId });
  };
  handleTabClick(tabId, event)
  {
    console.log('tabId',tabId);
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
    console.log(tabs);
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
      return(
        <div
          key={tab.tabId}
          className={`${tabStyleClass} ${CLASSES.TAB}`}
          onClick={this.handleTabClick.bind(this,tabId)}
        >
          <Row verticalAlign="middle" gutters="S">
            <Column align="left" className={styles.favicon}>
              {tab.isLoading && <Spinner size="small" />}
              {!tab.isLoading && tab.favicon && (
                <img alt="" id="favicon-img" src={tab.favicon} />
              )}
            </Column>
            <Column className={styles.tabText} align="left">
              {title || 'New Tab'}
            </Column>
            <Column align="right" className={styles.favicon}>
              <MdClose
                className={`${styles.tabCloseButton} ${CLASSES.CLOSE_TAB}`}
                onClick={this.handleTabClose.bind(this, tabId)}
                title="Close"
              />
            </Column>
          </Row>
        </div>
      );
    });
  };
  render(){
    return(
      <div
      className={[
        styles.container,
        process.platform === 'darwin' ? styles.containerMac : ''
      ].join(' ')}
      >
        <div className={styles.tabBar}>
          {this.getTabs()}
          <div
            className={`${styles.addTab} ${CLASSES.ADD_TAB}`}
            onClick = {this.handleAddTabClick.bind(this)}
          >
            <MdAdd className={styles.tabAddButton} title="New Tab" />
          </div>
        </div>
      </div>
    )
  }
};