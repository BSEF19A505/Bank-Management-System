const { getDb } = require('./mongodb');

const insert = async() => {
    const db = getDb();
    console.log(db);
}
exports.insert = insert;