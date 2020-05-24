const db = require("../../config/db");


module.exports = {
    all(){// pegando tudo tabela categories// retornando promise
     return  db.query(`
     SELECT * FROM  categories
     `);
    }
}