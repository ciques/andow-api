const knexfile = require('../../knexfile')
const knex = require('knex')(knexfile)

const { attachPaginate } = require('knex-paginate');
attachPaginate();

module.exports = knex