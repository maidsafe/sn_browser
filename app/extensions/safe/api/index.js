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
        protocols  : ['safe', 'localhost']

    },
    {
        name       : 'safeCipherOpt',
        isInternal : true,
        manifest   : cipherOpt.manifest,
        methods    : cipherOpt,
        protocols  : ['safe', 'localhost']

    },
    {
        name       : 'safeImmutableData',
        isInternal : true,
        manifest   : imdata.manifest,
        methods    : imdata,
        protocols  : ['safe', 'localhost']

    },
    {
        name       : 'safeCrypto',
        isInternal : true,
        manifest   : crypto.manifest,
        methods    : crypto,
        protocols  : ['safe', 'localhost']

    },
    {
        name       : 'safeCryptoSignKeyPair',
        isInternal : true,
        manifest   : cryptoSignKeyPair.manifest,
        methods    : cryptoSignKeyPair,
        protocols  : ['safe', 'localhost']

    },
    {
        name       : 'safeCryptoPubSignKey',
        isInternal : true,
        manifest   : cryptoPubSignKey.manifest,
        methods    : cryptoPubSignKey,
        protocols  : ['safe', 'localhost']

    },
    {
        name       : 'safeCryptoSecSignKey',
        isInternal : true,
        manifest   : cryptoSecSignKey.manifest,
        methods    : cryptoSecSignKey,
        protocols  : ['safe', 'localhost']

    },
    {
        name       : 'safeCryptoEncKeyPair',
        isInternal : true,
        manifest   : cryptoEncKeyPair.manifest,
        methods    : cryptoEncKeyPair,
        protocols  : ['safe', 'localhost']

    },
    {
        name       : 'safeCryptoSecEncKey',
        isInternal : true,
        manifest   : cryptoSecEncKey.manifest,
        methods    : cryptoSecEncKey,
        protocols  : ['safe', 'localhost']

    },
    {
        name       : 'safeCryptoPubEncKey',
        isInternal : true,
        manifest   : cryptoPubEncKey.manifest,
        methods    : cryptoPubEncKey,
        protocols  : ['safe', 'localhost']

    },
    {
        name       : 'safeMutableData',
        isInternal : true,
        manifest   : mdata.manifest,
        methods    : mdata,
        protocols  : ['safe', 'localhost']

    },
    {
        name       : 'safeMutableDataEntries',
        isInternal : true,
        manifest   : mdataEntries.manifest,
        methods    : mdataEntries,
        protocols  : ['safe', 'localhost']

    },
    {
        name       : 'safeMutableDataMutation',
        isInternal : true,
        manifest   : mdataMutation.manifest,
        methods    : mdataMutation,
        protocols  : ['safe', 'localhost']

    },
    {
        name       : 'safeMutableDataPermissions',
        isInternal : true,
        manifest   : mdataPermissions.manifest,
        methods    : mdataPermissions,
        protocols  : ['safe', 'localhost']

    },
    {
        name       : 'safeNfs',
        isInternal : true,
        manifest   : nfs.manifest,
        methods    : nfs,
        protocols  : ['safe', 'localhost']

    },
    {
        name       : 'safeNfsFile',
        isInternal : true,
        manifest   : nfsFile.manifest,
        methods    : nfsFile,
        protocols  : ['safe', 'localhost']

    }
];
