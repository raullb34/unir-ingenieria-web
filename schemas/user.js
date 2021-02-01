const mongoose = require('mongoose');
const Database = require('../database');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');

 /**
 * @typedef User
 * @property {string} name.required
 * @property {string} email.required
 * @property {string} password.required
 * @property {array} products - An array with the products added by user
 */


const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    products: [{type: mongoose.ObjectId, ref:'Product'}]
});

userSchema.methods.checkPassword = function (password) {
    if (!this.password) return Promise.resolve(false);
    return bcrypt.compare(password, this.password);
};

// Encode the user password before saving to the database.
// /!\ This is not called when calling some updat eXXX function!
const saltRounds = 10;
userSchema.pre("save", async function (next) {
    if (typeof this.password === "string" && this.password === "") {
        return next();
    }
    else if(this.password === undefined){
        this.password = null;
        return next();
    }

    try {
        this.password = await bcrypt.hash(this.password, saltRounds);
        return next();
    } catch (err) {
        return next(err);
    }
});

module.exports = mongoose.model('User', userSchema);

