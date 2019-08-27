import React, { ReactNode } from 'react';
import { uniqBy } from 'lodash';
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
        const [locationWithoutQuery, version] = currentLocation.split( '?v=' );

        const theList: Array<{
            link: string;
            text: string;
        }> = targetFilesArray.map( ( filesMapPath ): {
            link: string;
            text: string;
        } => {
            // get the base url out of the way
            let theLink = filesMapPath;
            if ( filesMapPath.includes( locationWithoutQuery ) ) {
              theLink = filesMapPath.split( locationWithoutQuery )[1];
            }

            if ( theLink.includes( '/' ) ) {
                // only get the next part of the tree
                theLink = theLink.split( '/' )[1];
            }

            const startLocation = locationWithoutQuery.endsWith( '/' )
                ? locationWithoutQuery
                : `${locationWithoutQuery}/`;
            const href = `${startLocation}${theLink}${
                version ? `?v=${version}` : ''
            }`;

            return {
                link: href,
                text: theLink
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
                {uniqList.length < 1 && <span>No content found at this path</span>}
            </React.Fragment>
        );
    }
}
