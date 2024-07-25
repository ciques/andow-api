const knex = require('../database')

module.exports = {
    async login(req, res) {
        const results = await knex('users')

        return res.json(results)
    }
}