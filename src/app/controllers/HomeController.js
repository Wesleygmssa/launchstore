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
           let results = await Product.files(productID)//pegando todos arquivos
           const files = results.rows.map( file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`); // caminho src

            return files[0]; // retornando somente os caminhos
       }

       //usando map e inserindo dados no objeto product 
       const productsPromise = products.map( async product =>{ // retorna uma array
           product.image = await getImage(product.id);// recebendi a imagem
           product.oldPrice = formatPrice(product.old_price);
           product.price = formatPrice(product.price);
           return product
       }).filter((product, index) => index > 2 ? false : true);// se for falso pare. pegando só 3 produtos


       const lastAdded = await Promise.all(productsPromise); // fazendo com q realmente seja executada
      console.log(lastAdded);

       return res.render('home/index',{products:lastAdded});
    }

   
}