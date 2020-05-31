const { formatPrice } = require('../../lib/utils');
const Product = require("../models/Product");
const File = require('../models/File');

module.exports = {
   async index(req, res) {
      try {

       let results,
        params = {}

         const { filter, category} = req.query
         if(!filter) return res.redirect('/');

         params.filter = filter

         if(category){

            params.category = category
         }

         console.log(params.category)
         results =  await Product.search(params)

         async function getImage(productID){
            let results = await File.find(productID)//pegando todos arquivos
            const files = results.rows.map( file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`); // caminho src
 
             return files[0]; // retornando somente os caminhos
        }


         const productsPromisse = results.rows.map(async product =>{
            product.img =  await getImage(product.id)
            product.oldPrice = formatPrice(product.old_price)
            product.price = formatPrice(product.price)

            return product
         })

         const products = await Promise.all(productsPromisse)

         const search = {
            term: req.query.filter,
            total: products.length
         }

         const categories = products.map(product =>({
            id: product.category_id,
            name: product.category_name
         }))

         return res.render('search/index', { products, search, categories});
      }

      catch (err) {
         console.log(err)
      }
   }
}