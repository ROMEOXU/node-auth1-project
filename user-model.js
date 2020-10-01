const db = require('./config');

async function add(user){
 const[id]= await db('users').insert(user)
 return findById(id)
}

function find(){
    return db('users').select('id','userName')
}

function findBy(filter){
    return db('users')
    .select('id','userName','passWord')
    .where(filter)
}

function findById(id){
   return db('users')
   .select('id','userName')
   .where('id',id)
   .first()
}

module.exports = {
    add,
    find,
    findBy,
    findById
}