const knex = require('../database')
const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')
const { v4: uuidv4 } = require('uuid')




module.exports = {
  async uploadImages(req, res, next){
    console.log(req.body.id)
    try {
      const results = await knex('products')
        .where({ id: req.body.id })
        .update({   
          image_url: req.file.location,
        }, ['*'])

      return res.json({url: req.file.location})
    } catch(error) {
      next(error)
    }
  } 
    
} 