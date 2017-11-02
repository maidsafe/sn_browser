module.exports = {
  verbose: true,
  testMatch: ['**/test/**/*'],
  "moduleFileExtensions": ["js", "jsx"],
  "moduleDirectories": ["app", "test", "node_modules"],
  "moduleNameMapper": {
     "^@actions(.*)$": "<rootDir>/app/actions$1",
     "^@reducers(.*)$": "<rootDir>/app/reducers$1",
     "^@components(.*)$": "<rootDir>/app/components$1",
     "^@logger(.*)$": "<rootDir>/app/logger$1"
   }
};
