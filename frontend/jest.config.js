module.exports = {
    testEnvironment: 'jest-environment-jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    testMatch: ["**/__tests__/**/*.test.[jt]s?(x)"],
    moduleNameMapper: {
        '\\.(css|less|scss|sass|svg)$': 'identity-obj-proxy'
    },
    testPathIgnorePatterns: ['/node_modules/', '/.next/'],
};

