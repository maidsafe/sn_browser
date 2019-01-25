import React, { Component } from 'react';
import logger from 'logger';
import { CLASSES } from 'appConstants';

// TODO: When I import the following, an error is thrown in CodeMirror, used by nessie-ui, that navigator is not defined
// import { Text, Column } from 'nessie-ui';

// import './authRequest.css';
//
const createAppContainersElement = containers =>
    (
        <div key="req_containers_parent_div">
            <a key="info_box_expander" className="info_box_expander" tabIndex="0">Details</a>
            <div key="info_box_details" className="info_box_details">
                <p className="blockText" key="requested_containers">With access to the following containers:</p>
                {
                    containers.map( ( container, i ) =>
                        (
                            <div key={ `${ container.cont_name }_parent_${ i }` }>
                                <p className="blockText" key={ container.cont_name }>{container.cont_name}</p>
                                <ul key={ `${ container.cont_name }_ul` }>
                                    {
                                        Object.keys( container.access ).filter( permission => container.access[permission] ).map( permission => <li key={ `${ container.cont_name }_${ permission }` }>{permission}</li> )
                                    }
                                </ul>
                            </div>
                        ) )
                }
            </div>
        </div>
    );

export const createAuthRequestElement = authReqData =>
{
    let reqType = 'authReq';
    let reqTypeText = ' requests authorisation.';
    if ( authReqData.authReq && authReqData.isAuthorised )
    {
        reqTypeText = ' is asking to be reauthorised, since you previously granted authorisation.';
    }
    if ( authReqData.contReq )
    {
        reqType = 'contReq';
        reqTypeText = ' requests container access.';
    }

    if ( authReqData.mDataReq )
    {
        reqType = 'mDataReq';
        reqTypeText = ' requests to share access to data created for you by another app.';
    }

    const ifReqWithContainers = () =>
    {
        if ( authReqData.isAuthorised &&
             authReqData.previouslyAuthorisedContainers &&
             authReqData.previouslyAuthorisedContainers.length )
        {
            return createAppContainersElement( authReqData.previouslyAuthorisedContainers );
        }
        if ( authReqData[reqType].containers && authReqData[reqType].containers.length )
        {
            logger.info( 'auth req containers: ', authReqData[reqType].containers );
            const containers = authReqData[reqType].containers.slice( 0 );
            if ( authReqData[reqType].app_container )
            {
                const ownContainer = {
                    access : {
                        delete             : true,
                        insert             : true,
                        manage_permissions : true,
                        read               : true,
                        update             : true
                    },
                    cont_name : `apps/${ authReqData[reqType].app.id }`
                };
                containers.push( ownContainer );
            }
            return createAppContainersElement( containers );
        }
        return ( <div key="empty_containers_req" /> );
    };

    const ifReqShareMData = () =>
    {
        if ( reqType === 'mDataReq' )
        {
            return (
                <div key="share_mdata_parent_div">
                    <a key="info_box_expander" className="info_box_expander" tabIndex="0">Details</a>
                    <div key="info_box_details" className="info_box_details">
                        <p className="blockText" key="requested_mdata">Requested Mutable Data:</p>
                        {
                            authReqData[reqType].mdata.map( ( mdatum, i ) =>
                            {
                                const metaName = authReqData.metaData[i].name;
                                const metaDesc = authReqData.metaData[i].description;
                                return (
                                    <div key={ `${ metaName }_parent_${ i }` }>
                                        <p key={ metaName + i }>{metaName}</p>
                                        <p key={ metaDesc + i }>{metaDesc}</p>
                                        <p key={ metaName + mdatum.type_tag + i }>{mdatum.type_tag}</p>
                                        <p key={ `Permissions:${ i }` }>Permissions:</p>
                                        {
                                            Object.keys( mdatum.perms ).filter( perm => mdatum.perms[perm] ).map( ( perm, i ) => <p key={ metaName + perm + i }>{perm}</p> )
                                        }
                                    </div>
                                );
                            } )
                        }
                    </div>
                </div>
            );
        }
        return ( <div key="empty_share_mdata" /> );
    };

    return (
        <div>
            <p className={ `blockText ${ CLASSES.NOTIFIER_TEXT }` } key={ authReqData[reqType].app.name }>
                { `${ authReqData[reqType].app.name } ${ reqTypeText }` }
            </p>
            <p className="blockText" key={ authReqData[reqType].app.vendor }>
                { authReqData[reqType].app.vendor }
            </p>
            { ifReqWithContainers() }
            { ifReqShareMData() }
        </div>
    );
};
