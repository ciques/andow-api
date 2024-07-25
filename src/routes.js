const express = require('express')
const routes = express.Router()
// const multer = require('multer')
// const multerConfig = require("./config/multer");

const authMiddleware = require('./middlewares/auth')
const AuthController = require ('./controllers/AuthController')
const ProductsController = require ('./controllers/ProductsController')
const ImagesController = require ('./controllers/ImagesController')

// Open
routes.post('/register', AuthController.register)
routes.post('/userRegister', AuthController.userRegister)
routes.post('/login', AuthController.login)
routes.post('/listProducts', ProductsController.listProduct)
routes.post('/product', ProductsController.showProduct)
routes.get('/listCategories', ProductsController.listCategories)
routes.post('/listComments', ProductsController.listComments)


// Autheticated
routes.post('/productComment', authMiddleware.verify, ProductsController.productComment)
routes.post('/refresh', authMiddleware.verify, authMiddleware.refresh)

// Admin 
// routes.post('/uploadImages',  authMiddleware.verify, authMiddleware.isAdmin, multer(multerConfig).single("image"), ImagesController.uploadImages)
routes.post('/addProducts', authMiddleware.verify, authMiddleware.isAdmin, ProductsController.addProduct)
routes.post('/removeProducts', authMiddleware.verify, authMiddleware.isAdmin, ProductsController.removeProduct)
routes.post('/updateProducts', authMiddleware.verify, authMiddleware.isAdmin, ProductsController.updateProduct)
routes.post('/loginAdmin', authMiddleware.verify, authMiddleware.isAdmin, authMiddleware.refresh)

module.exports = routes