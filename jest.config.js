module.exports = {
    verbose              : true,
    testMatch            : ['**/test/**/*'],
    moduleFileExtensions : ['js', 'jsx'],
    testPathIgnorePatterns : ['node_modules', '<rootDir>/app/extensions'],
    moduleDirectories    : ['app', 'test', 'node_modules', 'app/node_modules'],
    moduleNameMapper     : {
        '^appPackage$'    : '<rootDir>/package.json',
        '^@actions(.*)$'    : '<rootDir>/app/actions$1',
        '^@components(.*)$' : '<rootDir>/app/components$1',
        '^@containers(.*)$' : '<rootDir>/app/containers',
        '^@constants(.*)$' : '<rootDir>/app/constants',
        '^@extensions(.*)$'   : '<rootDir>/app/extensions$1',
        '^@logger(.*)$'     : '<rootDir>/app/logger$1',
        '^@reducers(.*)$'   : '<rootDir>/app/reducers$1',
        '^@store(.*)$'      : '<rootDir>/app/store',
        '^@utils(.*)$'     : '<rootDir>/app/utils$1'
    }
};
