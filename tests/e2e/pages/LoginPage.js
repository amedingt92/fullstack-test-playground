class LoginPage {
    constructor(page) {
        this.page = page;
        this.usernameInput = page.locator('#username');
        this.passwordInput = page.locator('#password');
        this.loginButton = page.locator('#loginForm button');
        this.errorMessage = page.locator('#errorMessage');
    }

    async goto() {
        await this.page.goto('http://localhost:3000/login.html');
    }

    async login(username, password) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async getErrorMessage() {
        return await this.errorMessage.textContent();
    }
}

module.exports = { LoginPage };
