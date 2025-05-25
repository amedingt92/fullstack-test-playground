class DashboardPage {
    constructor(page) {
        this.page = page;
        this.usersLink = page.locator('a[href="/dashboard.html"]');  // Previously '/index.html'
        this.logoutButton = page.locator('button', { hasText: 'Logout' });
    }

    async goto() {
        await this.page.goto('http://localhost:3000/dashboard.html');
    }

    async navigateToUsers() {
        await this.usersLink.click();
    }

    async logout() {
        await this.logoutButton.click();
    }
}

module.exports = { DashboardPage };
