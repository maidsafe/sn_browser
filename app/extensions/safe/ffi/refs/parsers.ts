import ref from 'ref-napi';
import ArrayType from 'ref-array';
import * as types from './types';

export const parseArray = ( type, arrayBuf, length ) => {
    if ( length === 0 ) {
        return [];
    }
    const arrayPtr = ref.reinterpret( arrayBuf, type.size * length );
    const ArrayType_ = ArrayType( type );
    return ArrayType_( arrayPtr );
};

export const parseAppExchangeInfo = ( appExchangeInfo ) => ( {
    id: appExchangeInfo.id,
    scope: appExchangeInfo.scope,
    name: appExchangeInfo.name,
    vendor: appExchangeInfo.vendor
} );

const parsePermissionSet = ( perms ) => ( {
    read: perms.read,
    insert: perms.insert,
    update: perms.update,
    delete: perms.delete,
    manage_permissions: perms.manage_permissions
} );

export const parseContainerPermissions = ( containerPermissions ) => ( {
    cont_name: containerPermissions.cont_name,
    access: parsePermissionSet( containerPermissions.access )
} );

export const parseContainerPermissionsArray = (
    containerPermissionsArray,
    length
) => {
    const res = [];
    let i = 0;
    const contArray = parseArray(
        types.ContainerPermissions,
        containerPermissionsArray,
        length
    );
    for ( i = 0; i < contArray.length; i++ ) {
        res.push( parseContainerPermissions( contArray[i] ) );
    }
    return res;
};

export const parseRegisteredApp = ( registeredApp ) => ( {
    app_info: parseAppExchangeInfo( registeredApp.app_info ),
    containers: parseContainerPermissionsArray(
        registeredApp.containers,
        registeredApp.containers_len
    ),
    containers_len: registeredApp.containers_len,
    containers_cap: registeredApp.containers_cap
} );

export const parseRegisteredAppArray = ( registeredAppArray, length ) => {
    const res = [];
    let i = 0;
    const registeredApps = parseArray(
        types.RegisteredApp,
        registeredAppArray,
        length
    );
    for ( i = 0; i < registeredApps.length; i++ ) {
        res.push( parseRegisteredApp( registeredApps[i] ) );
    }
    return res;
};

export const parseAuthReq = ( authRequest ) => ( {
    app: parseAppExchangeInfo( authRequest.app ),
    app_container: authRequest.app_container,
    containers: parseContainerPermissionsArray(
        authRequest.containers,
        authRequest.containers_len
    ),
    containers_len: authRequest.containers_len,
    containers_cap: authRequest.containers_cap
} );

export const parseContainerReq = ( containersRequest ) => ( {
    app: parseAppExchangeInfo( containersRequest.app ),
    containers: parseContainerPermissionsArray(
        containersRequest.containers,
        containersRequest.containers_len
    ),
    containers_len: containersRequest.containers_len,
    containers_cap: containersRequest.containers_cap
} );

const parseXorName = ( string ) => {
    const b = new Buffer( string );
    if ( b.length !== 32 ) throw Error( 'XOR Names _must be_ 32 bytes long.' );
    const name = types.XorName( b );
    return new Buffer( name ).toString( 'hex' );
};

const parseShareMData = ( shareMData ) => ( {
    type_tag: shareMData.type_tag,
    name: parseXorName( shareMData.name ),
    perms: parsePermissionSet( shareMData.perms )
} );

const parseSharedMDataArray = ( shareMData, length ) => {
    const res = [];
    let i = 0;
    const mdatas = parseArray( types.ShareMData, shareMData, length );
    for ( i = 0; i < mdatas.length; i++ ) {
        res.push( parseShareMData( mdatas[i] ) );
    }
    return res;
};

export const parseShareMDataReq = ( shareMDataRequest ) => ( {
    app: parseAppExchangeInfo( shareMDataRequest.app ),
    mdata: parseSharedMDataArray( shareMDataRequest.mdata, shareMDataRequest.mdata_len ),
    mdata_len: shareMDataRequest.mdata_len
} );

const parseUserMetaData = ( meta ) => ( {
    name: meta.name,
    description: meta.description
} );

export const parseUserMetaDataArray = ( metaArray, length ) => {
    const res = [];
    let i = 0;
    const metaData = parseArray( types.UserMetadata, metaArray, length );
    for ( i = 0; i < metaData.length; i++ ) {
        res.push( parseUserMetaData( metaData[i] ) );
    }
    return res;
};

const parseAppAccessInfo = ( appAccess ) => {
    let signKey = types.U8Array( new Buffer( appAccess.sign_key ) );
    signKey = new Buffer( signKey ).toString( 'hex' );
    return {
        sign_key: signKey,
        permissions: parsePermissionSet( appAccess.permissions ),
        app: appAccess.name
    // TODO: Why does uncommenting the following line break shareMData requests?
    // app_id: appAccess.app_id
    };
};

export const parseAppAccess = ( appAccess, length ) => {
    const res = [];
    let i = 0;
    const info = parseArray( types.AppAccess, appAccess, length );
    for ( i = 0; i < info.length; i++ ) {
        res.push( parseAppAccessInfo( info[i] ) );
    }
    return res;
};
