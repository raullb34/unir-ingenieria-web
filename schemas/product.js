const mongoose = require('mongoose');
const Database = require('../database');
const { Schema } = mongoose;

 /**
 * @typedef Product
 * @property {string} name.required
 * @property {string} barcode.required
 * @property {string} description - Some description for product
 * @property {number} price
 */
const productSchema = new Schema({
    name: String,
    barcode: String,
    description: String,
    price: String
});

module.exports = mongoose.model('Products', productSchema);

