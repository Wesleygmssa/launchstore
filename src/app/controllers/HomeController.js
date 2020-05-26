const { formatPrice} = require('../../lib/utils');
const Product = require("../models/Product");
const File = require('../models/File');

module.exports = { 
   async index(req, res){
       let results = await Product.all();
       const products = results.rows
       if(!products) return res.send("product not found!");

          //console.log(products[0])// todos produtos
       async function getImage(productID){
           let results = await File.find(productID)//pegando todos arquivos
           const files = results.rows.map( file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`)

            return files[0]; // retornando somente os caminhos
       }

       const productsPromise = products.map( async product =>{ // retorna uma array
           product.image = await getImage(product.id)// recebendi a imagem
           product.old_price = formatPrice(product.old_price).replace("R$", "R$ ")
           product.price = formatPrice(product.price).replace("R$", "R$ ")
           return product
       }).filter((product, index) => index > 2 ? false : true);

       const lastedAdded = await Promise.all(productsPromise);
       console.log(lastedAdded)
       return res.render('home/index',{products:lastedAdded})
    }

   
}