module.exports = {
    verbose                : true,
    testMatch              : ['**/test/**/*'],
    moduleFileExtensions   : ['js', 'jsx'],
    setupFiles   : ['<rootDir>/test/setup.js'],
    // unmockedModulePathPatterns: ["node_modules/babel-core"],
    testPathIgnorePatterns : ['node_modules', '<rootDir>/app/extensions'],
    moduleDirectories      : ['app', 'test', 'node_modules', 'app/node_modules'],
    moduleNameMapper       : {
        "electron": "<rootDir>/mocks/electron.js",
        "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
        "<rootDir>/mocks/fileMock.js",
        "\\.(css|scss)$": "<rootDir>/mocks/fileMock.js",
        '^appPackage$'      : '<rootDir>/package.json',
        // "\\.(css)$": "<rootDir>/node_modules/jest-css-modules",
        '^@actions(.*)$'    : '<rootDir>/app/actions$1',
        '^@components(.*)$' : '<rootDir>/app/components$1',
        '^@containers(.*)$' : '<rootDir>/app/containers$1',
        '^appConstants$'  : '<rootDir>/app/constants.js',
        '^@extensions(.*)$' : '<rootDir>/app/extensions$1',
        '^@logger(.*)$'     : '<rootDir>/app/logger$1',
        '^@reducers(.*)$'   : '<rootDir>/app/reducers$1',
        '^@store(.*)$'      : '<rootDir>/app/store',
        '^@utils(.*)$'      : '<rootDir>/app/utils$1'
    }
};
