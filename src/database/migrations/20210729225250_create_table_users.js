const { onUpdateTrigger } = require('../../../knexfile')

exports.up = knex => knex.schema.createTable('users', table => {
    table.increments('id')
    table.string('name')
    table.string('email').unique().notNullable()
    table.string('password').notNullable()
    table.boolean('is_admin').defaultTo(false)
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
}).then(() => knex.raw(onUpdateTrigger('users')))

exports.down = knex => knex.schema.dropTable('users')

