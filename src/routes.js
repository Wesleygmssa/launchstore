const express = require('express');
const routes = express.Router(); 
const multer = require('./app/middlewares/multer');//configuração de receber imagens
const ProductsControllers = require('./app/controllers/ProductController');
const HomeController = require('./app/controllers/HomeController');
const SearchController = require('./app/controllers/SearchController');





//home
routes.get('/',HomeController.index)

//Search
routes.get('/products/search', SearchController.index);//search for products

//products
routes.get('/products/create', ProductsControllers.create);//display form
routes.get('/products/:id', ProductsControllers.show) // product display
routes.get('/products/:id/edit', ProductsControllers.edit);// pagina editar


routes.post('/products', multer.array("photos", 6),ProductsControllers.post); //camingo do formulario salvar
routes.put('/products', multer.array("photos", 6), ProductsControllers.put);  //update formulario

routes.delete('/products', ProductsControllers.delete);//delete formualario usando mais como button no formulario





//alias atalhos
routes.get('/ads/create', function( req, res){
    return res.redirect("/products/create")
});





module.exports = routes