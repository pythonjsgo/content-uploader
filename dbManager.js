const {MongoClient, ServerApiVersion} = require('mongodb');
const values = require('./values')

const client = new MongoClient(values.MONGO_URI)

async function main() {
    await client.connect();
    let db = {}
    db.users =  client.db('main').collection('users')
    db.orders =  client.db('main').collection('orders')
    db.folders = client.db('main').collection('folders')
    db.usersExtra = client.db('main').collection('usersExtra')
    db.main = client.db('main')
    //console.log('Database initialized!')
    return db
}

module.exports = main()
