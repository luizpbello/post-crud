/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) =>
  knex.schema.createTable("posts", (table) => {
    table.increments("post_id").unique();
    table.integer("author").unsigned().notNullable();
    table.string("title", 50);
    table.binary("content");

    table.foreign("author").references("user_id").inTable("users").onDelete('SET NULL');
  });

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => knex.schema.dropTable("posts");
