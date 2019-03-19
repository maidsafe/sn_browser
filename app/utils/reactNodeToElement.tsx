import React from 'react';

export interface NodeObject {
    type: string;
    key?: string;
    props: {
        className?: string;
        children: Array<NodeObject> | string;
        [prop: string]: any;
    };
}

interface NodeDescription {
    type: string;
    children: Array<NodeDescription> | string;
    props?: {
        [prop: string]: any;
    };
}

export const reactNodeToElement = ( nodeObject: NodeObject ) => {
    const nodeDescription: NodeDescription = {
        type: ''
    };
    Object.keys( nodeObject ).forEach( key => {
        if ( key === 'type' ) {
            nodeDescription[key] = nodeObject[key];
            return;
        }
        if ( key === 'props' ) {
            Object.keys( nodeObject[key] ).forEach( prop => {
                if ( prop === 'children' ) {
                    nodeDescription.children = nodeObject.props.children;
                    return;
                }
                if ( nodeDescription.props ) {
                    nodeDescription.props = {
                        ...nodeDescription.props,
                        [prop]: nodeObject[key][prop]
                    };
                } else {
                    nodeDescription.props = {
                        [prop]: nodeObject[key][prop]
                    };
                }
            } );
        }
        if ( key === 'key' && nodeObject.key ) {
            if ( !nodeDescription.props ) {
                nodeDescription.props = {};
            }
            nodeDescription.props.key = nodeObject.key;
        }
    } );
    if ( Array.isArray( nodeDescription.children ) ) {
        nodeDescription.children = nodeDescription.children
            .reduce( ( acc, val ) => acc.concat( val ), [] )
            .map( child => reactNodeToElement( child ) );
    } else if (
        nodeDescription.children instanceof Object &&
    !Array.isArray( nodeDescription.children )
    ) {
        nodeDescription.children = reactNodeToElement( nodeDescription.children );
    }
    const elementType = nodeDescription.type;
    const elementProps = nodeDescription.props || [];
    const elementChildren = nodeDescription.children || null;
    return React.createElement( elementType, elementProps, elementChildren );
};
