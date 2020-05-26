const express = require('express');
const routes = express.Router(); 
const multer = require('./app/middlewares/multer');//configuração de receber imagens
const ProductsControllers = require('./app/controllers/ProductController');
const HomeController = require('./app/controllers/HomeController');




routes.get('/',HomeController.index)


routes.get('/products/create', ProductsControllers.create);//exibe formulario 
routes.get('/products/:id', ProductsControllers.show)
routes.get('/products/:id/edit', ProductsControllers.edit);

routes.post('/products', multer.array("photos", 6),ProductsControllers.post); //create new
routes.put('/products', multer.array("photos", 6), ProductsControllers.put);  //update

routes.delete('/products', ProductsControllers.delete);//delete


//alias atalhos
routes.get('/ads/create', function( req, res){
    return res.redirect("/products/create")
})

module.exports = routes