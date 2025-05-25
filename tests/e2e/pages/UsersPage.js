// tests/e2e/pages/UsersPage.js
class UsersPage {
    constructor(page) {
        this.page = page;
        this.userList = page.locator('#userList');
        this.nameInput = page.locator('#name');
        this.emailInput = page.locator('#email');
        this.addButton = page.locator('#addUserBtn');
    }

    async addUser(name, email) {
        await this.nameInput.fill(name);
        await this.emailInput.fill(email);
        await Promise.all([
            this.page.waitForResponse(resp => resp.url().includes('/api/users') && resp.status() === 201),
            this.addButton.click()
        ]);
        await this.page.waitForSelector(`#userList li:has-text("${name} (${email})")`);
        const userItem = this.page.locator(`#userList li:has-text("${name} (${email})")`);
        const id = await userItem.getAttribute('data-id');
        return id;
    }

    async editUser(id, newName, newEmail) {
        const userItem = this.page.locator(`#userList li[data-id="${id}"]`);
        const editButton = userItem.locator('button', { hasText: 'Edit' });

        let dialogCount = 0;
        const dialogHandler = async dialog => {
            dialogCount++;
            if (dialogCount === 1) {
                await dialog.accept(newName);
            } else if (dialogCount === 2) {
                await dialog.accept(newEmail);
                this.page.off('dialog', dialogHandler);
            } else {
                await dialog.dismiss();
            }
        };
        this.page.on('dialog', dialogHandler);

        await editButton.click();

        // Just wait for the updated DOM state (faster & avoids network timeout)
        await this.page.waitForSelector(`#userList li:has-text("${newName} (${newEmail})")`);
    }



    async deleteUser(id) {
        const userItem = this.page.locator(`#userList li[data-id="${id}"]`);
        const deleteButton = userItem.locator('button', { hasText: 'Delete' });

        this.page.once('dialog', dialog => dialog.accept()); // Confirm deletion
        await Promise.all([
            this.page.waitForResponse(resp => resp.url().includes(`/api/users/${id}`) && resp.status() === 200),
            deleteButton.click()
        ]);

        await this.page.waitForSelector(`#userList li[data-id="${id}"]`, { state: 'detached' });
    }

    async isUserListed(name, email) {
        return await this.page.locator(`#userList li:has-text("${name} (${email})")`).count() > 0;
    }
}

module.exports = { UsersPage };
