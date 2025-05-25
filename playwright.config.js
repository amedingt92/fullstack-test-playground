// playwright.config.js
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
    testDir: './tests/e2e', // E2E tests location
    timeout: 30000,         // Max test timeout (30s)
    expect: {
        timeout: 5000       // Expect assertions timeout
    },
    reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
    use: {
        baseURL: 'http://localhost:3000',
        headless: true,
        screenshot: 'only-on-failure',
        video: 'retain-on-failure'
    }
});
