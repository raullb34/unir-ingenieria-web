const mongoose = require('mongoose');
const Database = require('../database');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: String,
    email: String,
    password: String,
    products: [{type: mongoose.ObjectId, ref:'User'}]
});

module.exports = mongoose.model('User', userSchema);

