const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/LoginPage');
const { DashboardPage } = require('./pages/DashboardPage');

test.describe('Login Page', () => {
    test.afterEach(async ({ page }) => {
        try {
            const dashboard = new DashboardPage(page);
            if (await dashboard.logoutButton.isVisible()) {
                await dashboard.logout();
            }
        } catch (err) {
            console.warn('Logout skipped:', err.message);
        }
    });

    test('should display login form', async ({ page }) => {
        const login = new LoginPage(page);
        await login.goto();
        await expect(page.locator('h1')).toHaveText('Login');
    });

    test('should allow login with correct credentials', async ({ page }) => {
        const login = new LoginPage(page);
        await login.goto();
        await login.login('admin', 'password123');
        await expect(page).toHaveURL('http://localhost:3000/dashboard.html');
    });

    test('should show error for invalid login', async ({ page }) => {
        const login = new LoginPage(page);
        await login.goto();
        await login.login('wrong', 'wrong');
        const error = await login.getErrorMessage();
        expect(error).toContain('Invalid credentials');
    });
});
