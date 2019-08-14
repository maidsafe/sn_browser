import React, { Component } from 'react';
// import { logger } from '$Logger';
import { Icon, Button } from 'antd';
import { CLASSES } from '$Constants';
import 'antd/lib/row/style';
import 'antd/lib/col/style';
import 'antd/lib/button/style';
import 'antd/lib/icon/style';
import styles from './customMenu.css';

const Meatball = () => (
    <svg
        width="4"
        height="17"
        viewBox="0 0 4 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M2.00098 4.45813C3.10098 4.45813 4.00098 3.55813 4.00098 2.45813C4.00098 1.35813 3.10098 0.45813 2.00098 0.45813C0.900977 0.45813 0.000976562 1.35813 0.000976562 2.45813C0.000976562 3.55813 0.900977 4.45813 2.00098 4.45813ZM2.00098 6.45813C0.900977 6.45813 0.000976562 7.35813 0.000976562 8.45813C0.000976562 9.55813 0.900977 10.4581 2.00098 10.4581C3.10098 10.4581 4.00098 9.55813 4.00098 8.45813C4.00098 7.35813 3.10098 6.45813 2.00098 6.45813ZM2.00098 12.4581C0.900977 12.4581 0.000976562 13.3581 0.000976562 14.4581C0.000976562 15.5581 0.900977 16.4581 2.00098 16.4581C3.10098 16.4581 4.00098 15.5581 4.00098 14.4581C4.00098 13.3581 3.10098 12.4581 2.00098 12.4581Z"
            fill="#42566E"
        />
    </svg>
);
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
                <Button
                    shape="circle"
                    className={`${styles.customMenuItem} ${CLASSES.SETTINGS_MENU__BUTTON}`}
                    aria-label="settings-menu-button"
                    onClick={this.handleShowingMenu}
                >
                    <Icon component={Meatball} />
                </Button>
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
