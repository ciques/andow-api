exports.up = knex => knex.schema.table('products', function(table) {
    table.string('image_url')

}).then()


exports.down = knex => knex.schema.table('products', function(table) {
    table.dropColumn('image_url')
}).then()
