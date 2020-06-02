const { formatPrice } = require('../../lib/utils');
const Product = require("../models/Product");
const File = require('../models/File');

module.exports = {
   async index(req, res) {
      try {

       let results,
        params = {} // passando o objeto results =  await Product.search(params);

         const { filter, category} = req.query // desconstruindo obejto

         if(!filter) return res.redirect('/'); // se não tiver filter retorna para pagina principal

         params.filter = filter

         if(category){
            params.category = category
         }
         // console.log(params.category)
         results =  await Product.search(params); // recebendo dados da pesquisa
            async function getImage(productID){
            let results = await File.find(productID)//pegando todos arquivos
            const files = results.rows.map( file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`); // caminho src
            return files[0]; // retornando somente os caminhos
        }

         const productsPromisse = results.rows.map(async product =>{// formatação dos dados
            product.image =  await getImage(product.id);
            product.oldPrice = formatPrice(product.old_price);
            product.price = formatPrice(product.price);
            return product
         })

         const products = await Promise.all(productsPromisse); // esperar e receber todos os produtos
         const search = { // 
            term: req.query.filter, //termo de pesquisa que fou usado no input
            total: products.length //pegando total, 
         }
       
         const categories = products.map(product =>( 
            { //formatação dos dados
            id: product.category_id, 
            name: product.category_name
            }
         )).reduce((categoriesFiltered, category )=>{ // reduzir a quantidade

            const found = categoriesFiltered.some(cat => cat.id == category.id );

            if(!found){
               categoriesFiltered.push(category)
            }

            return categoriesFiltered
         }, []);// [{id: , name}] // reduzido
         // console.log(categories[0].name)
         return res.render('search/index', { products, search, categories});
      }

      catch (err) {
         console.log(err)
      }
   }
}
