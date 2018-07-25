import React, { Component } from 'react';
import logger from 'logger';
// TODO: When I import the following, an error is thrown in CodeMirror, used by nessie-ui, that navigator is not defined
//import { Text, Column } from 'nessie-ui';

//import './authRequest.css';

export const createAuthRequestElement = (authReqData) =>
{
    let reqType = 'authReq';
    let reqTypeText = ' requests Auth Permission';
    if (authReqData.contReq)
    {
      reqType = 'contReq'; 
      reqTypeText = ' requests Container Access';
    }

    if (authReqData.mDataReq)
    {
      reqType = 'mDataReq'; 
      reqTypeText = ' requests mData Access';
    }

    const ifReqWithContainers = () => {
      if ( authReqData[reqType].containers && authReqData[reqType].containers.length )
      {
        return (
          <div>
            <a key='info_box_expander' className='info_box_expander'>Details</a>
            <div key='info_box_details' className='info_box_details'>
               <p className='blockText' key='Requested containers:'>Requested containers:</p>
               {
                 authReqData[reqType].containers.map((container) => {
                   return (
                     <div>
                       <p className='blockText' key={container.cont_name}>{container.cont_name}</p>
                       <ul key={container.cont_name + '_ul'}>
                         {
                           Object.keys(container.access).filter((permission) => container.access[permission]).map((permission) => <li key={container.cont_name + '_' + permission}>{permission}</li>)
                         }
                       </ul>
                     </div>
                   );
                 })
               }
            </div>
          </div> 
        ); 
      }
      return (<div></div>);
    };

    const ifReqShareMData = () => {
      if ( reqType === 'mDataReq' )
      {
        return (
          <div>
            <a key='info_box_expander' className="info_box_expander">Details</a>
            <div key='info_box_details' className="info_box_details">
              <p className='blockText' key='Requested Mutable Data:'>Requested Mutable Data:</p>
              {
                authReqData[reqType].mdata.map((mdatum, i) => {
                  const metaName = authReqData.metaData[i].name;
                  const metaDesc = authReqData.metaData[i].description;
                  return (
                    <div>
                      <p key={metaName + i}>{metaName}</p>
                      <p key={metaDesc + i}>{metaDesc}</p>
                      <p key={metaName + mdatum.type_tag + i}>{mdatum.type_tag}</p>
                      <p key={'Permissions:' + i}>Permissions:</p>
                      {
                        Object.keys(mdatum.perms).filter((perm) => mdatum.perms[perm]).map((perm, i) => <p key={metaName + perm + i}>{perm}</p>)
                      }
                    </div>
                  );
                })
              } 
            </div> 
          </div>
        );
      }
      return (<div></div>);
    };

    return (
      <div>
        <p className='blockText' key={authReqData[reqType].app.name}>
         { authReqData[reqType].app.name + ' ' + reqTypeText } 
        </p>
        <p className='blockText' key={authReqData[reqType].app.vendor}>
         { authReqData[reqType].app.vendor }
        </p>
        { ifReqWithContainers() }
        { ifReqShareMData() }
      </div> 
    );
};

