import React, { ReactNode } from 'react';
import { uniqBy } from 'lodash';

import { logger } from '$Logger';
// import styles from './filesContainer.css';

interface FilesContainerProperties {
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
FilesContainerProperties,
Record<string, unknown>
> {
    render() {
        const { filesMap, currentLocation } = this.props;

        const targetFilesArray = Object.keys( filesMap );
        const [locationWithoutQuery, version] = currentLocation.split( '?v=' );

        const theList: Array<{
            link: string;
            text: string;
        }> = targetFilesArray.map( ( filesMapPath ): {
            link: string;
            text: string;
        } => {
            // get the base url out of the way
            let theLinkText = filesMapPath;
            // only get the next part of the tree
            theLinkText = theLinkText.startsWith( '/' )
                ? `/${theLinkText.split( '/' )[1]}`
                : theLinkText.split( '/' )[0];

            const href = `${theLinkText}${version ? `?v=${version}` : ''}`;

            return {
                link: href,
                text: theLinkText,
            };
        } );

        const uniqList = uniqBy( theList, ( item ) => item.link );
        return (
            <React.Fragment>
                {uniqList.length > 0 && (
                    <React.Fragment>
                        <h2>{`${locationWithoutQuery} contains:`}</h2>
                        <ul>
                            {uniqList.map( ( linkObject ) => {
                                return (
                                    <li key={linkObject.link}>
                                        <a href={linkObject.link}>{linkObject.text}</a>
                                    </li>
                                );
                            } )}
                        </ul>
                    </React.Fragment>
                )}
                {uniqList.length === 0 && <span>No content found at this path</span>}
            </React.Fragment>
        );
    }
}
