module.exports = {
    development: {
        client: "sqlite3",
        connection: {
            filename: "./dev.sqlite3",
        },
        useNullAsDefault: true,
        migrations: {
            directory: "./db/migrations",
        },
        seeds: {
            directory: "./db/seeds",
        },
    },
    test: {
        client: "sqlite3",
        connection: {
            filename: ":memory:",
        },
        useNullAsDefault: true,
        migrations: {
            directory: "./db/migrations",
        },
        seeds: {
            directory: "./db/seeds",
        },
    },
};
