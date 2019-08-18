import React, { ReactNode } from 'react';
import { uniq } from 'lodash';
import { logger } from '$Logger';
// import styles from './filesContainer.css';

interface FilesContainerProps {
    filesMap: {
        [path: string]: {
            created: string;
            link: string;
            modified: string;
            size: number;
            type: string;
        };
    };
    currentLocation?: string;
}

export class FilesContainer extends React.PureComponent<
FilesContainerProps,
{}
> {
    render() {
        const { filesMap, currentLocation } = this.props;

        const targetFilesArray = Object.keys( filesMap );

        const filteredTargetFilesArray = targetFilesArray.filter( ( thePath ) =>
            thePath.startsWith( currentLocation )
        );

        const theList: Array<string> = filteredTargetFilesArray.map(
            ( filesMapPath ): string => {
                let linkToNextChild = filesMapPath.split( currentLocation )[1];

                linkToNextChild = linkToNextChild.split( '/' )[0];

                return linkToNextChild;
            }
        );

        const uniqList = uniq( theList );

        return (
            <React.Fragment>
                <h2>{`${currentLocation} contains:`}</h2>
                <ul>
                    {uniqList.map( ( link ) => {
                        return (
                            <li>
                                <a href={link}>{link}</a>
                            </li>
                        );
                    } )}
                </ul>
            </React.Fragment>
        );
    }
}
