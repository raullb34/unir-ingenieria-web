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
    name: {type: String, required: true},
    barcode: {type: String, required: true},
    description: {type: String},
    price: {type: String, required: true}
});

module.exports = mongoose.model('Products', productSchema);

