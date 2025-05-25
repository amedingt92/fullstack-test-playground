module.exports = {
    testPathIgnorePatterns: [
        '/node_modules/',
        '/tests/e2e/' // Add this line to ignore Playwright tests
    ],
    testEnvironment: "node",
    verbose: true,
};
