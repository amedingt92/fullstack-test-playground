exports.up = function (knex) {
    return knex.schema.createTable("users", (table) => {
        table.increments("id").primary();
        table.string("name").notNullable();
        table.string("email").notNullable().unique();
        table.timestamps(true, true); // created_at and updated_at
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable("users");
};
