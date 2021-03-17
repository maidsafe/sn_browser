module.exports = {
    testURL: 'http://localhost/',
    verbose: true,
    moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx', 'node'],
    setupFiles: ['raf/polyfill', '<rootDir>/tests_setup.js'],
    testPathIgnorePatterns: ['node_modules'],
    moduleDirectories: ['app', 'test', 'node_modules'],
    moduleNameMapper: {
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
            '<rootDir>/mocks/fileMock.ts',
        '\\.(css|less|scss)$': '<rootDir>/mocks/fileMock.ts',
    },
};
