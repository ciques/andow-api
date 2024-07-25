const knex = require('../database')
const aws = require('aws-sdk')

require('dotenv').config()

aws.config.update({
    secretAccessKey: process.env.AWS_SECRET,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    region: process.env.AWS_REGION
})

module.exports = {    
    async listProduct(req, res, next) {
        try {
            const payload = req.body
            console.log(payload)

            const results = knex('products')
                .modify(function(queryBuilder) {
                    if(payload.filterPost) {
                        queryBuilder.where('title', 'ilike', `%${payload.filterPost.toLowerCase()}%`)
                            .orWhere('artist', 'ilike', `%${payload.filterPost.toLowerCase()}%`)
                            .orWhere('genre', 'ilike', `%${payload.filterPost.toLowerCase()}%`)
                            .orWhere('type', 'ilike', `%${payload.filterPost.toLowerCase()}%`)
                    }
                    if(payload.order == 'pricedesc') {
                        queryBuilder.orderBy('price', 'desc')
                    }
                    if(payload.order == 'pricecres') {
                        queryBuilder.orderBy('price')
                    }
                    if(payload.order == 'artist') {
                        queryBuilder.orderBy('artist')
                    }
                    if(payload.order == 'name') {
                        queryBuilder.orderBy('title')
                    }
                    if(payload.featured) {
                        queryBuilder.where('featured', true)
                    }
                })
                .paginate({ perPage: payload.pageSize, currentPage: payload.page });
                 


            results.then(function(results) {
                //query success
                res.send(results);
              })
              .then(null, function(err) {
                //query fail
                res.status(500).send(err);
              });

        } catch (error) {
            next(error)
        }

    },

    async addProduct(req, res, next) {
        const product = req.body

        if(!product.title) {
            return res.status(400).send({error: 'Título não informado'})
        }

        if(!product.type) {
            return res.status(400).send({error: 'Tipo não informado'})
        }

        if(!product.genre) {
            return res.status(400).send({error: 'Genero não informado'})
        }

        if(!product.state) {
            return res.status(400).send({error: 'Estado não informado'})
        }

        if(!product.price) {
            return res.status(400).send({error: 'Preço não informado'})
        }

        try {
            const results = await knex('products').insert({   
                title : product.title,
                artist: product.artist ?? null,
                type: product.type,
                price: product.price ?? null,
                genre: product.genre,
                release_date: product.release_date ?? null,
                state: product.state,
                featured: product.featured
            }).returning('*')

            return res.json(results[0])

        } catch (error) {
            next(error)
        }
        
        next();
    },

    async removeProduct(req, res, next) {
        const product = req.body

        try {
            const results = await knex('products').where('id', product.id).del();

            //deleta a imagem também            
            var s3 = new aws.S3();
            var params = {  Bucket: process.env.BUCKET_NAME, Key: product.image_url };
            s3.deleteObject(params, function(err, data) {
            if (err) console.log(err, err.stack);  // error
            else     console.log(data);                 // deleted
            });

            //deleta também todos comentários do produto
            await knex('comments').where('product_id', product.id).del();

            return res.json({message: 'Success deleted disco' + product.id})

        } catch (error) {
            next(error)
        }
        
        next();
    },

    async updateProduct(req, res, next) {
        const product = req.body.product

        try {
            const results = await knex('products')
                .where({ id: product.id })
                .update({   
                    title: product.title,
                    artist: product.artist,
                    type: product.type,
                    price: product.price,
                    genre: product.genre,
                    release_date: product.release_date,
                    state: product.state,
                    featured: product.featured
                }, ['*'])
            console.log(results);

            if(product.imageUpdate) {
                var s3 = new aws.S3();
                var params = {  Bucket: process.env.BUCKET_NAME, Key: product.imageUpdate };
                s3.deleteObject(params, function(err, data) {
                if (err) console.log(err, err.stack);  // error
                else     console.log(data);                 // deleted
                });
            }

            return res.json({message: 'disco atualizado ' + results})

        } catch (error) {
            next(error)
        }
        
        next();
    },

    async showProduct(req, res, next) {
        const id = req.body.id

        try {
            const results = await knex.select('*', 'products.id as id').from('products').leftJoin('comments', 'products.id', 'comments.user_id')
                .where({ 'products.id': id })

            console.log(results);
            return res.json(results)

        } catch (error) {
            next(error)
        }
        
        next();
    },

    async listCategories(req, res, next) {
        const artists = []
        const genres = []
        const types = []
        try {
            const artistsB = await knex('products')
                .distinct('artist').whereNotNull('artist')
                .orderBy('artist')         
            const genresB = await knex('products')
                .distinct('genre').whereNotNull('genre')
                .orderBy('genre')
            const typesB = await knex('products')
                .distinct('type').whereNotNull('type')
                .orderBy('type')
                

            artistsB.forEach(e => {
               artists.push(e.artist) 
            });

            genresB.forEach(e => {
                genres.push(e.genre) 
             });

            typesB.forEach(e => {
                types.push(e.type) 
            });

            return res.json({
                artists,
                genres,
                types 
            })  

        } catch (error) {
            next(error)
        }

    },

    async productComment(req, res, next) {
        const request = req.body

        try {
            const results = await knex('comments').insert({
                comment: request.question,
                product_id: request.productId,
                user_id: req.userId
            }).returning('*')

            console.log(results)

            return res.json({
                results
            })  
        }
        catch (error) {
            next(error)
        }
    },

    async listComments(req, res, next) {
        const request = req.body

        try {
            const results = await knex('comments').leftJoin('users', 'comments.user_id', 'users.id')
                .where({product_id: request.id}).select('comments.id as id', 'comment', 'user_id', 'product_id', 'comments.created_at', 'name')

            console.log(results)

            return res.json({
                comments: results
            })  
        }
        catch (error) {
            next(error)
        }
    }

}