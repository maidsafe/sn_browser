import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import { Grid, IconButton } from '@material-ui/core';
import BookmarkBorderRoundedIcon from '@material-ui/icons/BookmarkBorderRounded';
import BookmarkRoundedIcon from '@material-ui/icons/BookmarkRounded';
import { extendComponent } from '$Utils/extendComponent';
import { wrapAddressBarButtonsRHS } from '$Extensions/components';
import { CustomMenu } from '$Components/CustomMenu';
import { CLASSES } from '$Constants';

interface ButtonsRHSProps {
    address?: string;
    addTabEnd: ( ...args: Array<any> ) => any;
    isBookmarked: boolean;
    addBookmark: ( ...args: Array<any> ) => any;
    removeBookmark: ( ...args: Array<any> ) => any;
    menuItems: Array<React.ReactNode>;
    showSettingsMenu: ( ...args: Array<any> ) => any;
    settingsMenuIsVisible: boolean;
    hideSettingsMenu: ( ...args: Array<any> ) => any;
    focusWebview: ( ...args: Array<any> ) => any;
    windowId: number;
    setActiveTab: ( ...args: Array<any> ) => any;
    tabId: string;
}
/**
 * Left hand side buttons for the Address Bar
 * @extends Component
 */
class ButtonsRHS extends Component<ButtonsRHSProps, {}> {
    static defaultProps = {
        address: '',
        isSelected: false,
        editingUrl: false
    };

    handleBookmarking = () => {
        const { address, addBookmark, removeBookmark, isBookmarked } = this.props;
        if ( isBookmarked ) {
            removeBookmark( { url: address } );
        } else {
            addBookmark( { url: address } );
        }
    };

    render() {
        const {
            isBookmarked,
            settingsMenuIsVisible,
            showSettingsMenu,
            hideSettingsMenu,
            menuItems,
            focusWebview,
            windowId,
            tabId
        } = this.props;
        return (
            <Grid container direction="row" justify="space-evenly" spacing={1}>
                <Grid item>
                    <IconButton
                        size="small"
                        className={`${CLASSES.BOOKMARK_PAGE}`}
                        onClick={this.handleBookmarking}
                        aria-label={
                            isBookmarked
                                ? I18n.t( 'aria.is_bookmarked' )
                                : I18n.t( 'aria.not_bookmarked' )
                        }
                        onKeyDown={( e ) => {
                            if ( e.keyCode === 13 ) {
                                this.handleBookmarking();
                            }
                        }}
                    >
                        {isBookmarked ? (
                            <BookmarkRoundedIcon />
                        ) : (
                            <BookmarkBorderRoundedIcon />
                        )}
                    </IconButton>
                </Grid>
                <Grid item>
                    <CustomMenu
                        isVisible={settingsMenuIsVisible}
                        menuItems={menuItems}
                        showMenu={showSettingsMenu}
                        hideMenu={hideSettingsMenu}
                        windowId={windowId}
                        aria-label={I18n.t( 'aria.settings_menu' )}
                        onBlur={() => focusWebview( { tabId, shouldFocus: true } )}
                    />
                </Grid>
            </Grid>
        );
    }
}
export const ExtendedButtonsRHS = extendComponent(
    ButtonsRHS,
    wrapAddressBarButtonsRHS
);
