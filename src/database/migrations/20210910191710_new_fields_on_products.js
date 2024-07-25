exports.up = knex => knex.schema.table('products', function(table) {
      table.string('genre')
      table.integer('release_date')
      table.integer('quantity')
      table.string('state')
    }).then()
  
  
  exports.down = knex => knex.schema.table('products', function(table) {
      table.dropColumn('genre')
      table.dropColumn('release_date')
      table.dropColumn('quantity')
      table.dropColumn('state')
    }).then()
  