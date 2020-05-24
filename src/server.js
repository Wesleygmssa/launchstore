const express = require('express') 
const nunjucks = require('nunjucks') 
const routes = require('./routes') // chamando rotas
const server = express()  
const methodOverride = require('method-override') // usando o metodo put

server.use(express.urlencoded({extended:true}))
server.use(express.static('public'))
server.use(methodOverride('_method'))
server.use(routes) 


//template engine
server.set('view engine', 'njk') 

nunjucks.configure('src/app/views', { 
    express: server,
    autoescape: false, // - pegando formatação html 
    noCache: true // - tirando o cache
})


//servidor
server.listen(5000, function () {
    console.log('Server is running')
})



