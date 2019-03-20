declare namespace NodeJS {
    interface Global {
        port: number;
        preloadFile: string;
        appDir: string;
        isCI: boolean;
        startedRunningMock: boolean;
        shouldStartAsMockFromFlagsOrPackage: boolean;
        isRunningSpectronTestProcessingPackagedApp: boolean;
        SAFE_NODE_LIB_PATH: string;
        SPECTRON_TEST: boolean;
    }
}

declare interface NodeError extends Error {
    line: string;
    file: string;
}

// Enable import of css in typescript
declare module '*.css' {
    const content: any;
    /* eslint-disable-next-line import/no-default-export */
    export default content;
}
