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
    async post(req, res) {

        const keys = Object.keys(req.body)
        for (key of keys) {
            if (req.body[key] == '') {
                return res.send('Please, fill all fields!')
            }
        }
        //check photos
        if (req.files.length == 0) {
            return res.send('Please, send at least one image');
        }
        //save data form
        let results = await Product.create(req.body);
        const productId = results.rows[0].id;

        const filesPromise = req.files.map(function (file) {
            File.create({ ...file, product_id: productId });
        });
        //wait promises
        await Promise.all(filesPromise);

        return res.redirect(`products/${productId}/edit`);
    },
    async show(req, res) {
        let results = await Product.find(req.params.id);// encontrando objeto
        const product = results.rows[0];// recendo o objeto ID
        if (!product) return res.send("product not found")// se não existir o produto

        const { day, hour, minutes, month } = date(product.updated_at);
        product.published = {//um objeto
            day: `${day}/${month}`,
            hour: `${hour}h${minutes}`,
        }
        product.oldPrice = formatPrice(product.old_price);
        product.price = formatPrice(product.price);

         results = await Product.files(product.id);
         const files = results.rows.map(file => ({ 
            ...file, 
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}` }));

          
        return res.render('products/show', { product, files });
    },
    async edit(req, res) {
        let results = await Product.find(req.params.id);
        const product = results.rows[0];
        if (!product) return res.send("Product not found!");
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
        if (req.files.length != 0) { // verication campo de fotos
            const newFilesPromise = req.files.map(file =>
                File.create({ ...file, product_id: req.body.id }))
            await Promise.all(newFilesPromise)
        }

        if (req.body.removed_files) {
            const removed_files = req.body.removed_files.split(",")//[1,2,3]
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
        return res.redirect(`/products/${req.body.id}`);

    },
    async delete(req, res) {
        let results = await File.find(req.body.id)// encontrar um arquivo
        const files = results.rows // passnado resultado em forma de array
        if (files) {
            const removeFilesPromise = files.map(file => File.delete(file.id))

            await Promise.all(removeFilesPromise)
        }

        await Product.delete(req.body.id)

        return res.redirect('/')
    }
}