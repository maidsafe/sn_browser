
import React, { Component } from "react";
import { CLASSES } from "@Constants";
// import { Column, Grid } from 'nessie-ui';
import ButtonsLHS from "@Components/AddressBar/ButtonsLHS";
import ButtonsRHS from "@Components/AddressBar/ButtonsRHS";
import Input from "@Components/AddressBar/Input";
import logger from "logger";
import { Row, Col } from "antd";
import "antd/lib/row/style";
import "antd/lib/col/style";
import styles from "./addressBar.css";

interface AddressBarProps {
    address?: string,
    isSelected?: boolean,
    settingsMenuIsVisible?: boolean,
    activeTab?: {
        url?: string
    },
    windowId: number,
    isBookmarked: boolean,
    addTab: ( ...args: any[] ) => any,
    addBookmark: ( ...args: any[] ) => any,
    removeBookmark: ( ...args: any[] ) => any,
    onBlur: ( ...args: any[] ) => any,
    onSelect: ( ...args: any[] ) => any,
    onFocus: ( ...args: any[] ) => any,
    tabBackwards: ( ...args: any[] ) => any,
    tabForwards: ( ...args: any[] ) => any,
    showSettingsMenu: ( ...args: any[] ) => any,
    hideSettingsMenu: ( ...args: any[] ) => any,
    focusWebview: ( ...args: any[] ) => any,
    updateTab: ( ...args: any[] ) => any
}
export default class AddressBar extends Component<AddressBarProps, {}> {
    static defaultProps = {
        address: "",
        isSelected: false,
        settingsMenuIsVisible: false,
        editingUrl: false
    };

    handleBack = () => {
        const { tabBackwards, windowId } = this.props;
        tabBackwards( { windowId } );
    };

    handleForward = () => {
        const { tabForwards, windowId } = this.props;
        tabForwards( { windowId } );
    };

    handleRefresh = () => {
    // TODO: if cmd or so clicked, hard.
        event.stopPropagation();
        const { updateTab, windowId } = this.props;
        updateTab( { windowId, shouldReload: true } );
    };

    getSettingsMenuItems = () => {
        const { addTab, windowId } = this.props;
        const addATab = tab => {
            addTab( { url: `safe-browser://${tab}`, isActiveTab: true, windowId } );
        };
        return [
            <Row
                key="menuItem-bookmarks"
                type="flex"
                justify="start"
                align="middle"
            >
                <div
                    role="menuitem"
                    tabIndex={0}
                    className={`${styles.menuItem} ${CLASSES.SETTINGS_MENU__BOOKMARKS}`}
                    onClick={() => addATab( "bookmarks" )}
                >
          Bookmarks
                </div>
            </Row>,
            <Row key="menuItem-history" type="flex" justify="start" align="middle">
                <div
                    role="menuitem"
                    tabIndex={0}
                    className={`${styles.menuItem} ${CLASSES.SETTINGS_MENU__HISTORY}`}
                    onClick={() => addATab( "history" )}
                >
          History
                </div>
            </Row>
        ];
    };

    render() {
        const props = this.props;
        const {
            address,
            addTab,
            addBookmark,
            removeBookmark,
            isBookmarked,
            activeTab,
            updateTab,
            settingsMenuIsVisible,
            showSettingsMenu,
            hideSettingsMenu,
            focusWebview,
            windowId
        } = this.props;
        const canGoBackwards = activeTab ? activeTab.historyIndex > 0 : false;
        const canGoForwards = activeTab
            ? activeTab.historyIndex < activeTab.history.length - 1
            : false;
        return (
            <div className={`${styles.container} js-address`}>
                <Row
                    className={styles.addressBar}
                    type="flex"
                    justify="start"
                    align="middle"
                    gutter={{ xs: 4, sm: 8, md: 12 }}
                >
                    <Col>
                        <ButtonsLHS
                            activeTab={activeTab}
                            updateTab={updateTab}
                            handleBack={this.handleBack}
                            canGoForwards={canGoForwards}
                            canGoBackwards={canGoBackwards}
                            handleForward={this.handleForward}
                            handleRefresh={this.handleRefresh}
                            {...props}
                        />
                    </Col>
                    <Col className={styles.addressBarCol}>
                        <Input {...this.props} />
                    </Col>
                    <Col>
                        <ButtonsRHS
                            address={address}
                            addTab={addTab}
                            isBookmarked={isBookmarked}
                            addBookmark={addBookmark}
                            removeBookmark={removeBookmark}
                            menuItems={this.getSettingsMenuItems()}
                            showSettingsMenu={showSettingsMenu}
                            settingsMenuIsVisible={settingsMenuIsVisible}
                            hideSettingsMenu={hideSettingsMenu}
                            focusWebview={focusWebview}
                            windowId={ windowId }
                        />
                    </Col>
                </Row>
            </div>
        );
    }
}
