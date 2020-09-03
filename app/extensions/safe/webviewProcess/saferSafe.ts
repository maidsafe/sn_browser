import { Safe } from 'sn_nodejs';

/**
 * Override the nodejs filesystem API to prevent file system access byt apps, and require them to use the browser's File APIs.
 */
export class SaferSafe extends Safe {
    files_container_create = (
        location?: any,
        destination?: string,
        recursive: boolean,
        del: boolean,
        updateNrs: boolean,
        dryRun: boolean
    ): void => {
        if ( location && !( location instanceof File ) ) {
            throw new Error( `
            "location", if passed, must be a File object.
            ` );
        }

        if ( location ) {
            // Please use "Safe.files_container_create_from_raw" and the native browser "FileReader" API: https://developer.mozilla.org/en-US/docs/Web/API/FileReader
            throw new Error( `
            The "location" argument cannot be used on "files_container_create" in the browser yet.
            ` );
        }

        return Reflect.apply( Safe.prototype.files_container_create, this, [
            null,
            null,
            del,
            updateNrs,
            dryRun,
        ] );
    };

    files_container_sync = (
        location?: any,
        destination?: string,
        recursive: boolean,
        del: boolean,
        updateNrs: boolean,
        dryRun: boolean
    ): void => {
        if ( location && !( location instanceof File ) ) {
            throw new Error( `
            "location", if passed, must be a File object.
            ` );
        }

        if ( location ) {
            // TODO: enable Files object use
            throw new Error( `
                The "location" argument cannot be used on "files_container_sync" in the browser yet.
                ` );
        }

        return Reflect.apply( Safe.prototype.files_container_sync, this, [
            null,
            null,
            del,
            updateNrs,
            dryRun,
        ] );
    };

    files_container_add = (
        location: string,
        destination: string,
        force: boolean,
        updateNrs: boolean,
        dryRun: boolean
    ): void => {
        if ( typeof location !== 'string' ) {
            throw new Error( `
            The "location" must be a "safe:" url string.
            ` );
        }

        if ( !location.startsWith( 'safe:' ) ) {
            throw new Error( `
                "location" must start with "safe:" 
                ` );
        }

        return Reflect.apply( Safe.prototype.files_container_add, this, [
            location,
            destination,
            force,
            updateNrs,
            dryRun,
        ] );
    };
}
