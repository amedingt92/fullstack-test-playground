const API_BASE = '/api/users';

async function fetchUsers() {
    const response = await fetch(API_BASE);
    const users = await response.json();
    const list = document.getElementById('user-list');
    list.innerHTML = '';
    users.forEach(user => {
        const li = document.createElement('li');
        li.textContent = `${user.name} (${user.email})`;
        list.appendChild(li);
    });
}

document.getElementById('user-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
    });
    fetchUsers(); // Refresh list
    e.target.reset();
});

fetchUsers();
