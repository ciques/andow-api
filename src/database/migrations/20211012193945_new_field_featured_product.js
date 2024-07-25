exports.up = knex => knex.schema.table('products', function(table) {
    table.boolean('featured')
}).then()


exports.down = knex => knex.schema.table('products', function(table) {
    table.dropColumn('featured')
}).then()
