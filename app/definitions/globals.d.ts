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
        macAllWindowsClosed: boolean;
    }
}

declare interface NodeError extends Error {
    line: string;
    file: string;
}

// Enable import of css in typescript
declare module '*.css' {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const content: any;
    /* eslint-disable-next-line import/no-default-export */
    export default content;
}
