import { logger } from '$Logger';
import { Store } from 'redux';
import * as safeBrowsingMainProcesses from './safe/main-process';

const allMainProcessPackages = [safeBrowsingMainProcesses];

export const preAppLoad = ( store: Store ): void => {
    allMainProcessPackages.forEach(
        ( extension ): void => {
            if ( extension.preAppLoad ) {
                extension.preAppLoad( store );
            }
        }
    );
};

export const onAppReady = ( store ): void => {
    allMainProcessPackages.forEach(
        ( extension ): void => {
            if ( extension.onAppReady ) {
                extension.onAppReady( store );
            }
        }
    );
};

export const onReceiveUrl = ( store, url ): void => {
    allMainProcessPackages.forEach(
        ( extension ): void => {
            if ( extension.onReceiveUrl ) {
                extension.onReceiveUrl( store, url );
            }
        }
    );
};
