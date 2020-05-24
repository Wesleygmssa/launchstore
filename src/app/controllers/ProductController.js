const { formatPrice, date } = require('../../lib/utils');
const Category = require("../models/Category");
const Product = require("../models/Product");
const File = require('../models/File');




module.exports = {


    create(req, res) {

        Category.all() //pegar categorias
            .then(function (results) {// qunado vc tiver pronto então faz alguma coisa
                const categories = results.rows

                return res.render("products/create.njk", { categories });

            }).catch(function (err) {// tratamento de erro
                throw new Error(err)
            })


    },
    //forma more update de receber data
    async post(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == '') {
                return res.send('Please, fill all fields!')
            }
        }

        if(req.files.length == 0){// check photos
            return res.send('Please, send at least one image');
        }

        // esperando a promise responder para continuar
        let results = await Product.create(req.body);
        const productId = results.rows[0].id;

        //array de promessas,
        //o map ele retorna um array
        const filesPromise = req.files.map(function (file){ 
            File.create({...file, product_id: productId});
        });
        
        await Promise.all(filesPromise);//espera um array de promessas

        return res.redirect(`products/${productId}/edit`);
    },
    async show(req, res){
        let results = await Product.find(req.params.id);// encontrando objeto
        const product = results.rows[0];// recendo o objeto
       
        if(!product) return res.send("product not found")// se não existir o produto

        const {day, hour, minutos, month} = date(product.update_at);
        product.published = {
            day: `${day}/${month}`,
            hour: `${hour}h${minutos}`,
           
        }
        product.old_price = formatPrice(product.old_price);
        product.price = formatPrice(product.price);

    

        return res.render('products/show',{product});
    },
    async edit(req, res) {
    
        let results = await Product.find(req.params.id);
        const product = results.rows[0];
    
        if (!product) return res.send("Produto não encontrado!");
    
        product.old_price = formatPrice(product.old_price);
        product.price = formatPrice(product.price);
    
        results = await Category.all();
        const categories = results.rows;
    
        results = await Product.files(product.id);
        let files = results.rows;
        files = files.map(file => ({ ...file, src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}` }));
    
        return res.render("products/edit", { product, categories, files });
    },

    async put(req, res) {

        const keys = Object.keys(req.body)// verificado campos form

        for (key of keys) { 
            if (req.body[key] == '' && key != "removed_files") {
                return res.send('Please, fill all fields!')
            }
        }

        if(req.files.length != 0){ // verication campo de fotos
            const newFilesPromise = req.files.map(file => 
                File.create({...file, product_id: req.body.id}))

                await Promise.all(newFilesPromise)
        }

         if(req.body.removed_files){
             const  removed_files = req.body.removed_files.split(",")//[1,2,3]
             const lastIndex = removed_files.length - 1;
             removed_files.splice(lastIndex, 1) // [1,2]

             const removedFilesPromise = removed_files.map(id => File.delete(id));

             await Promise.all(removedFilesPromise);
         }

        // mandando number limpo para banco de dados.
        req.body.price = req.body.price.replace(/\D/g, "");

        if (req.body.old_price != req.body.price) {
            const oldProduct = await Product.find(req.body.id); //get price olad
            req.body.old_price = oldProduct.rows[0].price;
        }
        await Product.update(req.body);


        return res.redirect(`/products/${req.body.id}/edit`);

    },

    async delete(req, res) {

        let results = await File.find(req.body.id)
        const files = results.rows
       

        if(files) {
            const removeFilesPromise = files.map(file => File.delete(file.id))
            
            await Promise.all(removeFilesPromise)
        }
        
        await Product.delete(req.body.id)

        return res.redirect('/')
    }
}