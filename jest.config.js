module.exports = {
    testURL                : 'http://localhost/',
    verbose                : true,
    moduleFileExtensions   : [ 'js', 'jsx', 'json' ],
    setupFiles             : [ 'raf/polyfill', '<rootDir>/tests_setup.js' ],
    testPathIgnorePatterns : [ 'node_modules' ],
    moduleDirectories      : [ 'app', 'test', 'node_modules' ],
    moduleNameMapper       : {
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$' :
            '<rootDir>/mocks/fileMock.js',
        '\\.(css|less|scss)$' : '<rootDir>/mocks/fileMock.js',
        '^@Package$'          : '<rootDir>/package.json',
        '^spectron-lib(.*)$'  : '<rootDir>/__e2e__/lib$1',
        '^@Actions(.*)$'      : '<rootDir>/app/actions$1',
        '^@Components(.*)$'   : '<rootDir>/app/components$1',
        '^@Containers(.*)$'   : '<rootDir>/app/containers$1',
        '^@Constants$'        : '<rootDir>/app/constants.js',
        '^@Extensions(.*)$'   : '<rootDir>/app/extensions$1',
        '^@logger$'           : '<rootDir>/app/logger.js',
        '^@Reducers(.*)$'     : '<rootDir>/app/reducers$1',
        '^@Store(.*)$'        : '<rootDir>/app/store',
        '^@Utils(.*)$'        : '<rootDir>/app/utils$1'
    }
};
