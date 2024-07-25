
const { onUpdateTrigger } = require('../../../knexfile')

exports.up = knex => knex.schema.createTable('comments', table => {
    table.increments('id')
    table.text('comment')
    table.integer('user_id')
    table.integer('product_id')
    table.boolean('aproved')
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
}).then(() => knex.raw(onUpdateTrigger('comments')))

exports.down = knex => knex.schema.dropTable('comments')    