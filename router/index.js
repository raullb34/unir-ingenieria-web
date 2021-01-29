const express = require('express');
const UserModel = require('../schemas/user');
const ProductModel = require('../schemas/product');
const Errors = require('../errors')

const rr = (async function () {
    var router = express.Router();
    /**
    * @route POST /auth
    * @group user - User operations
    * @returns {UserModel} 200 - An object of type user model
    */
    router.post("/auth", async (req, res, next) => {
        //Check email and password 
        console.log(req.body);
        const email = req.body.email;
        const password = req.body.password;
        if (!email || !password) {
            return res.status(Errors.InvalidAuthParams.statusCode).send(Errors.InvalidAuthParams);
        }
        else {
            const user = await UserModel.findOne({ email: email }).exec();
            if (user !== null && user.password !== undefined && await user.checkPassword(password)) {
                return res.status(200).send({ token: user.token, id: user._id });
            }
            else {
                return res.status(Errors.InvalidAuthParams.statusCode).send(Errors.InvalidAuthParams);
            }
        }
    });
    /**
    * @route POST /users
    * @group user - User operations
    * @returns {object} 200 - New user saved in database
    */
    router.post("/users", async (req, res, next) => {
        
    });
    /**
    * @route PATCH /users
    * @group user - User operations
    * @param {_id} - Database identificator
    * @returns {object} 200 - User from database updated
    * @security JWT
    */
    router.update("/users/:id", async (req, res, next) => {
        
    });
    /**
    * @route DELETE /users
    * @group user - User operations
    * @param {_id} - Database identificator
    * @returns {object} 200 - User removed from database
    * @security JWT
    */
    router.delete("/users/:id", async (req, res, next) => {
        
    });
    /**
    * @route GET /products
    * @group product - Product operations
    * @returns {Array<ProductModel>} 200 - Array of all products saved in database
    */
    router.get("/products", async(req, res, next) => {
        
    });
    /**
    * @route POST /products
    * @group product - Product operations
    * @returns {ProductModel} 200 - Product saved in database
    * @security JWT
    */
    router.post("/products", async(req, res, next) => {

    });
    /**
    * @route PATCH /products
    * @group product - Product operations
    * @returns {ProductModel} 200 - Product updated in database
    * @security JWT
    */
    router.update("/products/:id", async(req, res, next) => {

    });
    /**
    * @route DELETE /products
    * @group product - Product operations
    * @returns {object} 200 - Product removed from database
    * @security JWT
    */
    router.delete("/products/:id", async(req, res, next) => {

    });
});

module.exports = rr;