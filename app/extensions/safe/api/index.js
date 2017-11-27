const app = require( './app' );
const cipherOpt = require( './cipher_opt' );
const imdata = require( './immutable_data' );
const crypto = require( './crypto' );
const cryptoEncKeyPair = require( './crypto_encryption_key_pair' );
const cryptoSecEncKey = require( './crypto_secret_encryption_key' );
const cryptoPubEncKey = require( './crypto_public_encryption_key' );
const cryptoSignKeyPair = require( './crypto_sign_key_pair' );
const cryptoPubSignKey = require( './crypto_public_sign_key' );
const cryptoSecSignKey = require( './crypto_secret_sign_key' );
const mdata = require( './mutable_data' );
const mdataEntries = require( './mutable_data_entries' );
const mdataMutation = require( './mutable_data_mutation' );
const mdataPermissions = require( './mutable_data_permissions' );
const nfs = require( './emulations/nfs' );
const nfsFile = require( './emulations/nfs_file' );

module.exports = [
    {
        name       : 'safeApp',
        isInternal : true,
        manifest   : app.manifest,
        methods    : app,
        protocols  : ['safe']

    },
    {
        name       : 'safeCipherOpt',
        isInternal : true,
        manifest   : cipherOpt.manifest,
        methods    : cipherOpt,
        protocols  : ['safe']

    },
    {
        name       : 'safeImmutableData',
        isInternal : true,
        manifest   : imdata.manifest,
        methods    : imdata,
        protocols  : ['safe']

    },
    {
        name       : 'safeCrypto',
        isInternal : true,
        manifest   : crypto.manifest,
        methods    : crypto,
        protocols  : ['safe']

    },
    {
        name       : 'safeCryptoSignKeyPair',
        isInternal : true,
        manifest   : cryptoSignKeyPair.manifest,
        methods    : cryptoSignKeyPair,
        protocols  : ['safe']

    },
    {
        name       : 'safeCryptoPubSignKey',
        isInternal : true,
        manifest   : cryptoPubSignKey.manifest,
        methods    : cryptoPubSignKey,
        protocols  : ['safe']

    },
    {
        name       : 'safeCryptoSecSignKey',
        isInternal : true,
        manifest   : cryptoSecSignKey.manifest,
        methods    : cryptoSecSignKey,
        protocols  : ['safe']

    },
    {
        name       : 'safeCryptoEncKeyPair',
        isInternal : true,
        manifest   : cryptoEncKeyPair.manifest,
        methods    : cryptoEncKeyPair,
        protocols  : ['safe']

    },
    {
        name       : 'safeCryptoSecEncKey',
        isInternal : true,
        manifest   : cryptoSecEncKey.manifest,
        methods    : cryptoSecEncKey,
        protocols  : ['safe']

    },
    {
        name       : 'safeCryptoPubEncKey',
        isInternal : true,
        manifest   : cryptoPubEncKey.manifest,
        methods    : cryptoPubEncKey,
        protocols  : ['safe']

    },
    {
        name       : 'safeMutableData',
        isInternal : true,
        manifest   : mdata.manifest,
        methods    : mdata,
        protocols  : ['safe']

    },
    {
        name       : 'safeMutableDataEntries',
        isInternal : true,
        manifest   : mdataEntries.manifest,
        methods    : mdataEntries,
        protocols  : ['safe']

    },
    {
        name       : 'safeMutableDataMutation',
        isInternal : true,
        manifest   : mdataMutation.manifest,
        methods    : mdataMutation,
        protocols  : ['safe']

    },
    {
        name       : 'safeMutableDataPermissions',
        isInternal : true,
        manifest   : mdataPermissions.manifest,
        methods    : mdataPermissions,
        protocols  : ['safe']

    },
    {
        name       : 'safeNfs',
        isInternal : true,
        manifest   : nfs.manifest,
        methods    : nfs,
        protocols  : ['safe']

    },
    {
        name       : 'safeNfsFile',
        isInternal : true,
        manifest   : nfsFile.manifest,
        methods    : nfsFile,
        protocols  : ['safe']

    }
];
