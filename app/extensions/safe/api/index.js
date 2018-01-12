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

// NOTE: We add http here, but note that all http reqs are blocked outside of the whitelisted `localhost/127.0.0.1`;
module.exports = [
    {
        name       : 'safeApp',
        isInternal : true,
        manifest   : app.manifest,
        methods    : app,
        protocols  : ['safe', 'http', 'https']

    },
    {
        name       : 'safeCipherOpt',
        isInternal : true,
        manifest   : cipherOpt.manifest,
        methods    : cipherOpt,
        protocols  : ['safe', 'http', 'https']

    },
    {
        name       : 'safeImmutableData',
        isInternal : true,
        manifest   : imdata.manifest,
        methods    : imdata,
        protocols  : ['safe', 'http', 'https']

    },
    {
        name       : 'safeCrypto',
        isInternal : true,
        manifest   : crypto.manifest,
        methods    : crypto,
        protocols  : ['safe', 'http', 'https']

    },
    {
        name       : 'safeCryptoSignKeyPair',
        isInternal : true,
        manifest   : cryptoSignKeyPair.manifest,
        methods    : cryptoSignKeyPair,
        protocols  : ['safe', 'http', 'https']

    },
    {
        name       : 'safeCryptoPubSignKey',
        isInternal : true,
        manifest   : cryptoPubSignKey.manifest,
        methods    : cryptoPubSignKey,
        protocols  : ['safe', 'http', 'https']

    },
    {
        name       : 'safeCryptoSecSignKey',
        isInternal : true,
        manifest   : cryptoSecSignKey.manifest,
        methods    : cryptoSecSignKey,
        protocols  : ['safe', 'http', 'https']

    },
    {
        name       : 'safeCryptoEncKeyPair',
        isInternal : true,
        manifest   : cryptoEncKeyPair.manifest,
        methods    : cryptoEncKeyPair,
        protocols  : ['safe', 'http', 'https']

    },
    {
        name       : 'safeCryptoSecEncKey',
        isInternal : true,
        manifest   : cryptoSecEncKey.manifest,
        methods    : cryptoSecEncKey,
        protocols  : ['safe', 'http', 'https']

    },
    {
        name       : 'safeCryptoPubEncKey',
        isInternal : true,
        manifest   : cryptoPubEncKey.manifest,
        methods    : cryptoPubEncKey,
        protocols  : ['safe', 'http', 'https']

    },
    {
        name       : 'safeMutableData',
        isInternal : true,
        manifest   : mdata.manifest,
        methods    : mdata,
        protocols  : ['safe', 'http', 'https']

    },
    {
        name       : 'safeMutableDataEntries',
        isInternal : true,
        manifest   : mdataEntries.manifest,
        methods    : mdataEntries,
        protocols  : ['safe', 'http', 'https']

    },
    {
        name       : 'safeMutableDataMutation',
        isInternal : true,
        manifest   : mdataMutation.manifest,
        methods    : mdataMutation,
        protocols  : ['safe', 'http', 'https']

    },
    {
        name       : 'safeMutableDataPermissions',
        isInternal : true,
        manifest   : mdataPermissions.manifest,
        methods    : mdataPermissions,
        protocols  : ['safe', 'http', 'https']

    },
    {
        name       : 'safeNfs',
        isInternal : true,
        manifest   : nfs.manifest,
        methods    : nfs,
        protocols  : ['safe', 'http', 'https']

    },
    {
        name       : 'safeNfsFile',
        isInternal : true,
        manifest   : nfsFile.manifest,
        methods    : nfsFile,
        protocols  : ['safe', 'http', 'https']

    }
];
