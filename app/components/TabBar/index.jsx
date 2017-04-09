// @flow
import React, { Component }     from 'react';
import PropTypes                from 'prop-types';
import { ipcRenderer, ipcMain }          from 'electron';

// import { Link }                 from 'react-router';
import styles                   from './tabBar.css';
import MdClose                from 'react-icons/lib/md/close';
import MdAdd                    from 'react-icons/lib/md/add';

export default class TabBar extends Component {

    static defaultProps =
    {
        tabInFocus : 0
    }

    // static propTypes =
    // {
    //     addTab :
    // }

    constructor( props )
    {
        super( props );
        this.state =
        {
            tabInFocus : 0 //to update when many tabs can exist
        }
    }


    handleTabClick( tabData, event )
    {
        event.stopPropagation();
        console.log( 'handleTabClick', event.target, event.currentTarget  );

        // if( event.target )
        this.props.setActiveTab( tabData.key );
        this.props.updateAddress( tabData.url );
    }

    handleTabClose( tabData, event )
    {
        event.stopPropagation();
        // event.preventDefault();
        const { closeTab } = this.props;
        //
        //
        console.log( 'closeing tab:' , tabData.key );
        closeTab( { index: tabData.key } );

    }

    handleAddTabClick( event )
    {
        event.stopPropagation();
        // const { addTab } = this.props;
        const { addTab, updateAddress } = this.props;
        const newTabUrl = 'about:blank';
        event.preventDefault();
        addTab( { url: newTabUrl, isActiveTab: true } );
        updateAddress( newTabUrl );

        // console.log( 'ipcRenderer'  , ipcRenderer );

        // ipcRenderer.send( 'command', 'file:new-tab' );
        // ipcMain.send( 'command', 'file:new-tab' );
        // console.log( 'addtab clicked' );
        // this.props.setActiveTab( tabData.key );
        // this.props.updateAddress( tabData.url );
    }

    render()
    {

        const { tabs } = this.props;
        // const { tabInFocus }  = this.state;

        // console.log( "props in TabBar component", this.props );

            return (
            <div className={styles.container}>
                <div className={styles.tabBar}>
                    {
                        tabs.map( ( tab, i ) =>
                        {
                            if( tab.get( 'isClosed') )
                                return;

                            let isActiveTab = tab.get('isActiveTab')
                            let tabStyleClass  = styles.tab;
                            let tabData     = { key: i, url: tab.get('url') };
                            if( isActiveTab )
                            {
                                tabStyleClass = styles.activeTab;
                            }
                            return (<div key={ i } className={ tabStyleClass } onClick={ this.handleTabClick.bind(this, tabData  ) }>
                                        <div className={styles.tabBox}>
                                            <span className={ styles.tabText }>{ tab.get('title') || 'New Tab' }</span>
                                            <MdClose className={ styles.tabCloseButton }
                                                onClick={ this.handleTabClose.bind( this, tabData ) } />
                                        </div>
                                    </div>)
                        })
                    }
                    <div className={ styles.addTab } onClick={ this.handleAddTabClick.bind(this) }>
                        <div className={styles.tabBox}>
                            <MdAdd className={ styles.tabAddButton } />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
