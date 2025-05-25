// tests/e2e/users.e2e.spec.js
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/LoginPage');
const { DashboardPage } = require('./pages/DashboardPage');
const { UsersPage } = require('./pages/UsersPage');

test.describe('User Management', () => {
    test.beforeEach(async ({ page }) => {
        const login = new LoginPage(page);
        await login.goto();
        await login.login('admin', 'password123');

        const dashboard = new DashboardPage(page);
        await dashboard.navigateToUsers();
    });

    test('should add a user', async ({ page }) => {
        const users = new UsersPage(page);
        const name = `E2E User ${Date.now()}`;
        const email = `e2e${Date.now()}@example.com`;
        const userId = await users.addUser(name, email);
        expect(await users.isUserListed(name, email)).toBeTruthy();
    });

    test('should edit a user', async ({ page }) => {
        const users = new UsersPage(page);
        const name = `EditMe ${Date.now()}`;
        const email = `editme${Date.now()}@example.com`;
        const id = await users.addUser(name, email);

        const newName = `${name} Updated`;
        const newEmail = `updated${Date.now()}@example.com`;
        await users.editUser(id, newName, newEmail);
        expect(await users.isUserListed(newName, newEmail)).toBeTruthy();
    });

    test('should delete a user', async ({ page }) => {
        const users = new UsersPage(page);
        const name = `DeleteMe ${Date.now()}`;
        const email = `deleteme${Date.now()}@example.com`;
        const id = await users.addUser(name, email);
        await users.deleteUser(id);
        expect(await users.isUserListed(name, email)).toBeFalsy();
    });
});
