module.exports = {
    verbose                : true,
    moduleFileExtensions   : ['js', 'jsx', 'json'],
    setupFiles   : ['raf/polyfill','<rootDir>/tests_setup.js'],
    testPathIgnorePatterns : ['node_modules'],
    moduleDirectories      : ['app', 'test', 'node_modules', 'app/node_modules'],
    moduleNameMapper       : {
        "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
        "<rootDir>/mocks/fileMock.js",
        "\\.(css|less|scss)$": "<rootDir>/mocks/fileMock.js",
        '^appPackage$'      : '<rootDir>/package.json',
        '^spectron-lib(.*)$'      : '<rootDir>/__e2e__/lib$1',
        '^@actions(.*)$'    : '<rootDir>/app/actions$1',
        '^@components(.*)$' : '<rootDir>/app/components$1',
        '^@containers(.*)$' : '<rootDir>/app/containers$1',
        '^appConstants$'  : '<rootDir>/app/constants.js',
        '^@extensions(.*)$' : '<rootDir>/app/extensions$1',
        '^@logger$'     : '<rootDir>/app/logger.js',
        '^@reducers(.*)$'   : '<rootDir>/app/reducers$1',
        '^@store(.*)$'      : '<rootDir>/app/store',
        '^@utils(.*)$'      : '<rootDir>/app/utils$1'
    }
};
