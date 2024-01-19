const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig');

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-jsdom',
    transform: {
        '^.+\\.(ts|tsx)?$': 'ts-jest',
        '^.+\\.(js|jsx)$': 'babel-jest'
    },
    moduleNameMapper: {
        '\\.(css|less|scss|sss|styl)$': 'ts-jest',
        ...pathsToModuleNameMapper(compilerOptions.paths)
    },
    modulePaths: ['<rootDir>'],

    setupFilesAfterEnv: ['<rootDir>/tests/setupTests.ts']
};
