exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex("users").del()
        .then(() => {
            // Inserts seed entries
            return knex("users").insert([
                { name: "Alice", email: "alice@example.com" },
                { name: "Bob", email: "bob@example.com" },
                { name: "Charlie", email: "charlie@example.com" },
            ]);
        });
};
