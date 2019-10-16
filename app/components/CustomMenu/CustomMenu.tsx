import React, { Component } from 'react';
// import { logger } from '$Logger';
import MoreVertRoundedIcon from '@material-ui/icons/MoreVertRounded';
import { IconButton } from '@material-ui/core';
import { CLASSES } from '$Constants';
import styles from './customMenu.css';

interface CustomMenuProps {
    isVisible?: boolean;
    menuItems?: Array<any>;
    showMenu: ( ...args: Array<any> ) => any;
    hideMenu: ( ...args: Array<any> ) => any;
    windowId: number;
}
/**
 * A menu which will be displayed / hidden based upon isVisisble prop.
 * An ordered array of menu items can be passed in as an array of nodes to be displayed, each within their own Row.
 */
export class CustomMenu extends Component<CustomMenuProps, {}> {
    static defaultProps = {
        isVisible: false,
        menuItems: []
    };

    handleShowingMenu = ( event ) => {
        event.nativeEvent.stopImmediatePropagation();
        const { showMenu, hideMenu, isVisible, windowId } = this.props;
        if ( isVisible ) {
            hideMenu( { windowId } );
        } else {
            showMenu( { windowId } );
            const windowClickListener = ( _event ) => {
                hideMenu( { windowId } );
            };
            window.addEventListener( 'click', windowClickListener, {
                once: true
            } );
        }
    };

    render() {
        const { isVisible, menuItems } = this.props;
        return (
            <div>
                <IconButton
                    size="small"
                    className={`${styles.customMenuItem} ${CLASSES.SETTINGS_MENU__BUTTON}`}
                    aria-label="settings-menu-button"
                    onClick={this.handleShowingMenu}
                >
                    <MoreVertRoundedIcon />
                </IconButton>
                {isVisible && (
                    <div className={`${styles.menuContainer} ${CLASSES.SETTINGS_MENU}`}>
                        <div className={styles.menu}>
                            {menuItems.map( ( item, i ) => item )}
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
