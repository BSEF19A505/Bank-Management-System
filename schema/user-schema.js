const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true,
}

const userSchema = mongoose.Schema({
    name: reqString,
    phone: reqString,
    email: reqString,
    CNIC: reqString,
    password: reqString,
})

module.exports = mongoose.model('user', userSchema)