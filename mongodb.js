// const { MongoClient } = require('mongodb');
// const url = 'mongodb://localhost:27017';
// const client = new MongoClient(url);
// const database = 'local';
// async function dbConnect() {
//     let result = await client.connect();
//     let db = result.db('database');
//     return db.collection('startup_log')
//         // let response = collection.find({}).toArray()
//         // console.log('response');
// }
// module.exports = dbConnect;
const mongodb = require('mongodb');

const client = mongodb.MongoClient;
const uri = 'mongodb+srv://mahad:root@cluster0.cplig.mongodb.net/test?retryWrites=true&w=majority';
let db;

const mongoConnect = (callback) => {
    client.connect(uri)
        .then((result) => {
            console.log('Connected to database');
            db = result.db();

            callback();
        })
        .catch((err) => {
            console.log(err);
        });
};
const getDb = () => {
    if (db) {
        return db;
    }
    return -1;
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;