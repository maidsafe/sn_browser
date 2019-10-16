import React, { ReactNode, Component } from 'react';
import { remote } from 'electron';
import { I18n } from 'react-redux-i18n';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import {
    createStyles,
    fade,
    Theme,
    withStyles
} from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import { CLASSES } from '$Constants';
// import { logger } from '$Logger';
import { extendComponent } from '$Utils/extendComponent';
import { wrapAddressBarInput } from '$Extensions/components';
import styles from './input.css';

interface AddressBarInputProps {
    address?: string;
    isSelected?: boolean;
    windowId: number;
    tabId?: string;
    onBlur: ( ...args: Array<any> ) => any;
    onSelect: ( ...args: Array<any> ) => any;
    onFocus: ( ...args: Array<any> ) => any;
    updateTabUrl: ( ...args: Array<any> ) => any;
    extensionStyles: {};
    addonBefore: Array<ReactNode>;
    addonAfter: Array<ReactNode>;
}
interface AddressBarInputState {
    address: any;
    editingUrl: boolean;
}
interface AddressBarInputState {
    address: any;
    editingUrl: boolean;
}

const BootstrapInput = withStyles( ( theme: Theme ) =>
    createStyles( {
        input: {
            fontSize: 16,
            paddingLeft: '10px',
            transition: theme.transitions.create( ['border-color', 'box-shadow'] ),
            // Use the system font instead of the default Roboto font.
            fontFamily: [
                '-apple-system',
                'BlinkMacSystemFont',
                '"Segoe UI"',
                'Roboto',
                '"Helvetica Neue"',
                'Arial',
                'sans-serif',
                '"Apple Color Emoji"',
                '"Segoe UI Emoji"',
                '"Segoe UI Symbol"'
            ].join( ',' ),
            '&:focus': {
                boxShadow: `${fade( theme.palette.primary.main, 0.25 )} 0 0 0 0.2rem`,
                borderColor: theme.palette.primary.main,
                borderRadius: '2px'
            }
        }
    } )
)( InputBase );

/**
 * Left hand side buttons for the Address Bar
 * @extends Component
 */
class AddressBarInput extends Component<
AddressBarInputProps,
AddressBarInputState
> {
    static defaultProps = {
        address: '',
        isSelected: false,
        editingUrl: false
    };

    constructor( props ) {
        super( props );
        this.handleChange = this.handleChange.bind( this );
        this.handleKeyPress = this.handleKeyPress.bind( this );
        this.state = {
            address: props.address
        };
    }

    componentWillReceiveProps( nextProps ) {
        if (
            nextProps.address !== this.props.address &&
      nextProps.address !== this.state.address
        ) {
            this.setState( { address: nextProps.address } );
        }
    }

    isInFocussedWindow = () => {
        const { BrowserWindow } = remote;
        const focusedWindow = BrowserWindow.getFocusedWindow();
        if ( !focusedWindow ) {
            return false;
        }
        const focussedWindowId = BrowserWindow.getFocusedWindow().id;
        const currentWindowId = remote.getCurrentWindow().id;
        return focussedWindowId === currentWindowId;
    };

    handleChange( event ) {
        const { onSelect, tabId } = this.props;
        this.setState( { address: event.target.value } );
        if ( onSelect ) {
            onSelect( { tabId } );
        }
    }

    handleFocus = ( event ) => {
        const { onFocus, tabId } = this.props;
        onFocus( { tabId } );
        event.target.select();
    };

    handleBlur = () => {
        const { onBlur, tabId } = this.props;
        onBlur( { tabId } );
    };

    handleKeyPress( event ) {
        const { tabId } = this.props;
        if ( event.key !== 'Enter' ) {
            return;
        }
        const input = event.target.value;
        const timeStamp = new Date().getTime();
        this.props.updateTabUrl( { tabId, url: input, timeStamp } );
    }

    handleClick = () => {
        const { onSelect, isSelected, tabId } = this.props;
        if ( isSelected ) {
            onSelect();
        }
    };

    render() {
        const { isSelected, addonBefore, addonAfter } = this.props;
        const { address } = this.state;
        return (
            <Paper className={CLASSES.ADDRESS_INPUT} square={false}>
                <Grid container>
                    <Grid item className={styles.addonBefore}>
                        {addonBefore}
                    </Grid>
                    <Grid item>
                        <BootstrapInput
                            fullWidth
                            aria-label={I18n.t( 'aria.address_bar' )}
                            value={address}
                            type="text"
                            onFocus={this.handleFocus}
                            onBlur={this.handleBlur}
                            onChange={this.handleChange}
                            onKeyPress={this.handleKeyPress}
                        />
                    </Grid>
                    {// comment hiding this as we don't need to show beaker icon for now as toggle Experimental has been disabled
                        false && <Grid item>{addonAfter}</Grid>}
                </Grid>
            </Paper>
        );
    }
}
export const ExtendedInput = extendComponent(
    AddressBarInput,
    wrapAddressBarInput
);
