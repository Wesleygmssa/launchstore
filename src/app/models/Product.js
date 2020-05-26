const db = require('../../config/db')// pegando a exportação do banco de dados

module.exports = {
    all(){
        return db.query(`
        SELECT * FROM products ORDER BY updated_at DESC
        `)
    },
    create(data) { // retornando para post

        const query = `  
        INSERT INTO products(
            category_id,
            user_id,
            name,
            description,
            old_price,
            price,
            quantity,
            status
          
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
          RETURNING id`

        //R$ 1,23
       data.price =   data.price.replace(/\D/g, "");
        // 123
        //123 / 100

        const values = [
            data.category_id,
            data.user_id || 1,
            data.name,
            data.description,
            data.old_price || data.price,
            data.price,
            data.quantity,
            data.status || 1,
           
        ];


       return db.query(query, values)// retornando uma promise
    },
    find(id){ // encontrar o id selecionado
        
        return db.query('SELECT * FROM products WHERE id = $1',[id]);
    },
    update(data){ // retornando para put, atualziação
        const query = `

        UPDATE products SET
        category_id=($1),
        user_id=($2),
        name=($3),
        description=($4),
        old_price=($5),
        price=($6),
        quantity=($7),
        status=($8)

        WHERE id = $9
        `
    const values = [

        data.category_id,
        data.user_id,
        data.name,
        data.description,
        data.old_price,
        data.price,
        data.quantity,
        data.status,
        data.id
    ]

    return db.query(query, values)// retornando uma promise

    },
    delete(id){

        return db.query('DELETE FROM products WHERE id=$1',[id]);
        
    },
    files(id){ 
        return  db.query(`SELECT * FROM files WHERE product_id = $1`,[id] );
       
    }
}