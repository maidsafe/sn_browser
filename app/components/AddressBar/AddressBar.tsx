import React, { Component } from 'react';
import { Box, Grid } from '@material-ui/core';
import { CLASSES } from '$Constants';
import { ButtonsLHS } from '$Components/AddressBar/ButtonsLHS';
import { ButtonsRHS } from '$Components/AddressBar/ButtonsRHS';
import { Input } from '$Components/AddressBar/Input';
// import { logger } from '$Logger';
import styles from './addressBar.css';

interface AddressBarProps {
    address?: string;
    activeTab?: {
        tabId?: string;
        url?: string;
    };
    tabId: string;
    onSelect: ( ...args: Array<any> ) => any;
    onFocus: ( ...args: Array<any> ) => any;
    onBlur: ( ...args: Array<any> ) => any;
    updateTabWebId: ( ...args: Array<any> ) => any;
    windowId: number;
    addBookmark: ( ...args: Array<any> ) => any;
    isBookmarked: boolean;
    updateTabUrl: ( ...args: Array<any> ) => any;
    addTabNext: ( ...args: Array<any> ) => any;
    addTabEnd: ( ...args: Array<any> ) => any;
    removeBookmark: ( ...args: Array<any> ) => any;
    hideSettingsMenu: ( ...args: Array<any> ) => any;
    showSettingsMenu: ( ...args: Array<any> ) => any;
    settingsMenuIsVisible: boolean;
    isSelected: boolean;
    tabBackwards: ( ...args: Array<any> ) => any;
    tabForwards: ( ...args: Array<any> ) => any;
    tabShouldReload: ( ...args: Array<any> ) => any;
    focusWebview: ( ...args: Array<any> ) => any;
    setActiveTab: ( ...args: Array<any> ) => any;
}

export class AddressBar extends Component<AddressBarProps, {}> {
    static defaultProps = {
        address: '',
        isSelected: false,
        settingsMenuIsVisible: false,
        editingUrl: false
    };

    handleBack = () => {
        const { tabBackwards, tabId } = this.props;
        const timeStamp = new Date().getTime();
        tabBackwards( { tabId, timeStamp } );
    };

    handleForward = () => {
        const { tabForwards, tabId } = this.props;
        const timeStamp = new Date().getTime();
        tabForwards( { tabId, timeStamp } );
    };

    handleRefresh = ( event ) => {
    // TODO: if cmd or so clicked, hard.
        event.stopPropagation();
        const { tabShouldReload, tabId } = this.props;
        tabShouldReload( { tabId, shouldReload: true } );
    };

    getSettingsMenuItems = () => {
        const { windowId, addTabEnd } = this.props;
        const tabId = Math.random().toString( 36 );
        const addATab = ( tab ) => {
            addTabEnd( { url: `safe-browser://${tab}`, windowId, tabId } );
        };
        return [
            <Grid
                container
                direction="column"
                alignItems="flex-start"
                spacing={1}
                className={styles.itemContainer}
            >
                <Grid item>
                    <div
                        role="menuitem"
                        tabIndex={0}
                        key="Bookmarks"
                        className={`${styles.menuItem} ${CLASSES.SETTINGS_MENU__BOOKMARKS}`}
                        onClick={() => addATab( 'bookmarks' )}
                        onKeyPress={() => addATab( 'bookmarks' )}
                    >
            Bookmarks
                    </div>
                </Grid>
                <Grid item>
                    <div
                        role="menuitem"
                        tabIndex={0}
                        key="History"
                        className={`${styles.menuItem} ${CLASSES.SETTINGS_MENU__HISTORY}`}
                        onClick={() => addATab( 'history' )}
                        onKeyPress={() => addATab( 'history' )}
                    >
            History
                    </div>
                </Grid>
            </Grid>
        ];
    };

    render() {
        const { props } = this;
        const {
            address,
            addTabEnd,
            addTabNext,
            updateTabUrl,
            addBookmark,
            updateTabWebId,
            removeBookmark,
            isBookmarked,
            activeTab,
            tabId,
            settingsMenuIsVisible,
            showSettingsMenu,
            hideSettingsMenu,
            focusWebview,
            windowId,
            setActiveTab
        } = this.props;
        const canGoBackwards = activeTab ? activeTab.historyIndex > 0 : false;
        const canGoForwards = activeTab
            ? activeTab.historyIndex < activeTab.history.length - 1
            : false;
        return (
            <Box className={`${styles.container} js-address`}>
                <Grid container alignItems="center" spacing={1} justify="space-around">
                    <Grid item>
                        <ButtonsLHS
                            addTabEnd={addTabEnd}
                            activeTab={activeTab}
                            updateTabWebId={updateTabWebId}
                            handleBack={this.handleBack}
                            canGoForwards={canGoForwards}
                            canGoBackwards={canGoBackwards}
                            handleForward={this.handleForward}
                            handleRefresh={this.handleRefresh}
                            {...props}
                        />
                    </Grid>
                    <Grid item className={styles.addressBarCol}>
                        <Input {...this.props} />
                    </Grid>
                    <Grid item>
                        <ButtonsRHS
                            address={address}
                            addTabEnd={addTabEnd}
                            tabId={tabId}
                            isBookmarked={isBookmarked}
                            addBookmark={addBookmark}
                            removeBookmark={removeBookmark}
                            menuItems={this.getSettingsMenuItems()}
                            showSettingsMenu={showSettingsMenu}
                            settingsMenuIsVisible={settingsMenuIsVisible}
                            hideSettingsMenu={hideSettingsMenu}
                            focusWebview={focusWebview}
                            windowId={windowId}
                            setActiveTab={setActiveTab}
                        />
                    </Grid>
                </Grid>
            </Box>
        );
    }
}
