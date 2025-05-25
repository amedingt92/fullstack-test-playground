document.addEventListener('DOMContentLoaded', () => {
    const userList = document.getElementById('userList');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const addUserForm = document.getElementById('addUserForm');

    // Load users on page load
    loadUsers();

    // Handle form submission for adding a user
    addUserForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        if (!name || !email) {
            alert('Name and email are required.');
            return;
        }

        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email }),
            });

            if (response.ok) {
                nameInput.value = '';
                emailInput.value = '';
                await loadUsers();  // Refresh list after adding
            } else {
                const error = await response.json();
                alert(error.error || 'Failed to add user.');
            }
        } catch (err) {
            console.error('Error adding user:', err);
            alert('Network error: Failed to add user.');
        }
    });

    // Load users from backend and display
    async function loadUsers() {
        userList.innerHTML = '<li>Loading users...</li>';
        try {
            const response = await fetch('/api/users');
            if (!response.ok) throw new Error('Failed to load users');
            const users = await response.json();

            if (users.length === 0) {
                userList.innerHTML = '<li>No users found.</li>';
                return;
            }

            userList.innerHTML = '';
            users.forEach(user => {
                const li = document.createElement('li');
                li.setAttribute('data-id', user.id);
                li.innerHTML = `
                    <span class="name">${user.name}</span> (<span class="email">${user.email}</span>)
                    <button class="editBtn">Edit</button>
                    <button class="deleteBtn">Delete</button>
                `;
                userList.appendChild(li);

                li.querySelector('.editBtn').addEventListener('click', () => editUser(user.id, user.name, user.email));
                li.querySelector('.deleteBtn').addEventListener('click', () => deleteUser(user.id));
            });
        } catch (err) {
            console.error('Error loading users:', err);
            userList.innerHTML = '<li>Failed to load users.</li>';
        }
    }

    // Handle user edit with real PUT to backend
    async function editUser(id, currentName, currentEmail) {
        const newName = prompt('Enter new name:', currentName);
        const newEmail = prompt('Enter new email:', currentEmail);
        if (!newName || !newEmail) {
            alert('Both name and email are required.');
            return;
        }

        try {
            const response = await fetch(`/api/users/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName, email: newEmail }),
            });

            if (response.ok) {
                await loadUsers();  // Refresh list after successful edit
            } else {
                const error = await response.json();
                alert(error.error || 'Failed to update user.');
            }
        } catch (err) {
            console.error('Error updating user:', err);
            alert('Network error: Failed to update user.');
        }
    }

    // Handle user delete with real DELETE to backend
    async function deleteUser(id) {
        if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            const response = await fetch(`/api/users/${id}`, { method: 'DELETE' });
            if (response.ok) {
                await loadUsers();  // Refresh list after successful delete
            } else {
                const error = await response.json();
                alert(error.error || 'Failed to delete user.');
            }
        } catch (err) {
            console.error('Error deleting user:', err);
            alert('Network error: Failed to delete user.');
        }
    }
});
