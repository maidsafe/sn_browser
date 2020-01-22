import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Input } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import styles from './editor.css';

import { logger } from '$Logger';
import { uploadFiles as uploadFilesOnNetwork } from '$Extensions/safe/actions/aliased';

function mapStateToProperties( state ) {
    return {
        tabs: state.tabs
    };
}
function mapDispatchToProperties( dispatch ) {
    const actions = {
        uploadFiles: uploadFilesOnNetwork
    };
    return bindActionCreators( actions, dispatch );
}

interface EditorProps {
    targetName: string;
    isActiveTab: boolean;
    uploadFiles: Function;
}
export class EditorComponent extends Component<
EditorProps,
{ files: Array<string>; hasError: boolean; theError: string }
> {
    static defaultProps = {
        history: [],
        targetName: ''
    };

    constructor( props ) {
        super( props );

        this.state = {
            files: [],
            hasError: false,
            theError: null
        };
    }

    render() {
        if ( this.state && this.state.hasError ) {
            const error = this.state.theError;

            // You can render any custom fallback UI
            return (
                <div>
                    <h4>Something went wrong in Editor.tsx</h4>
                    <span>
                        {JSON.stringify( error, ['message', 'arguments', 'type', 'name'] )}
                    </span>
                </div>
            );
        }

        // const { history, windowId, addTabEnd } = this.props;
        const { files } = this.state;
        const { targetName } = this.props;
        return (
            <Container maxWidth="sm">
                <Typography variant="h3">{`Edit ${targetName}`}</Typography>

                <div className={styles.uploadArea}>
                    <div className="targetDir">
                        {`Pending upload: ${files[0] || 'Nothing'}`}
                    </div>

                    <input
                        webkitdirectory="true"
                        directory="true"
                        style={{ display: 'none' }}
                        id="raised-button-file"
                        onChange={this.handleOnSelectFiles}
                        type="file"
                        ref={( c ) => {
                            this.input = c;
                        }}
                    />
                    <div className={styles.uploadAreaButton}>
                        <Button variant="contained" color="primary">
                            <label htmlFor="raised-button-file">
                                {files.length < 1 &&
                  'Click to choose a directory to upload for this site.'}
                                {files.length > 0 && 'Change directory'}
                            </label>
                        </Button>
                    </div>

                    {files.length > 0 && (
                        <div className={styles.uploadAreaButton}>
                            <Button
                                variant="contained"
                                color="secondary"
                                // className={styles.button}
                                onClick={this.handleUploadFiles}
                            >
                Upload
                            </Button>
                        </div>
                    )}
                </div>
            </Container>
        );
    }

    // why does this break?
    // <List>
    //     {
    //         files.map( file => {
    //         return (
    //             <ListItem button key={file}>
    //                 <ListItemText primary={file} />
    //             </ListItem>
    //         )
    //     } )}
    // </List>

    handleOnSelectFiles = () => {
        const { uploadFiles } = this.props;

        const fileList = this.input.files;

        const files = [...fileList].map( ( file ) => {
            return `${file.path}/`; // its a directory only ATM, so we need ot ensure we dont write the dir itself
        } );

        // TODO: Dont use compeontn state, use global 'editor' state
        this.setState( { files } );
    };

    handleUploadFiles = () => {
        const { uploadFiles, targetName } = this.props;
        logger.info(
            'Triggering upload of:',
            this.state.files,
            'and syncing to',
            targetName
        );

        // TODO make it work for more than one folder
        uploadFiles( this.state.files[0], targetName );
    };
}

export const Editor = connect(
    mapStateToProperties,
    mapDispatchToProperties
)( EditorComponent );
