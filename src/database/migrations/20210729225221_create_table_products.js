
const { onUpdateTrigger } = require('../../../knexfile')

exports.up = knex => knex.schema.createTable('products', table => {
    table.increments('id')
    table.string('title')
    table.string('artist')
    table.float('price')
    table.string('type')
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
}).then(() => knex.raw(onUpdateTrigger('products')))

exports.down = knex => knex.schema.dropTable('products')    