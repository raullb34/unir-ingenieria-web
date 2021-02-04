const express = require('express');
const UserModel = require('../schemas/user');
const ProductModel = require('../schemas/product');
const Errors = require('../errors')

var router = express.Router();

/**
 * @route GET /health
 * @group status - Status of the API
 * @returns {object} 200 - An object with the api status
 */
router.get('/health', async(req, res, next) => {
    return res.status(200).send({ "status": "ok" })
});
/**
* @route POST /auth
* @group user - User operations
* @returns {object} 200 - Id user
* @returns {object} 401 - Invalid Auth Params
*/
router.post("/auth", async (req, res, next) => {
    //Check email and password 
    console.log(req.body);
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        return res.status(Errors.InvalidAuthParams.status).send(Errors.InvalidAuthParams);
    } else {
        const user = await UserModel.findOne({ email: email }).exec();
        if (user !== null && user.password !== undefined && await user.checkPassword(password)) {
            return res.status(200).send({ id: user._id });
        } else {
            return res.status(Errors.InvalidAuthParams.code).send(Errors.InvalidAuthParams);
        }
    }
});
/**
* @route POST /users
* @group user - User operations
* @returns {User} 200 - New user saved in database
* @returns {object} 400 - Bad Request
*/
router.post("/users", async (req, res, next) => {
    const user = new UserModel(req.body);
    try {
        await user.save();
        return res.status(200).send(user);
    }
    catch (err){
        return res.status(Errors.BadRequest.code).send(Errors.BadRequest);
    }
});
/**
 * @route PATCH /users
 * @group user - User operations
 * @param {string} _id.query.required - Database identificator
 * @returns {User} 200 - User from database updated
 * @returns {object} 404 - File not found
 * @security JWT
 */
router.patch("/users/:id", async(req, res, next) => {
    console.log(req.body);
    const userId = req.params.id;
    UserModel.findOneAndUpdate({ _id: userId }, req.body).exec(function(err, result) {
        const user = result;
        if (user) {
            return res.status(200).send(user);
        } else {
            return res.status(Errors.FileNotFound.code).send(Errors.FileNotFound);
        }
    });

});
/**
 * @route DELETE /users
 * @group user - User operations
 * @param {string} _id.query.required - Database identificator
 * @returns {object} 200 - User removed from database
 * @returns {object} 404 - File not found
 * @security JWT
 */
router.delete("/users/:id", async(req, res, next) => {
    const userId = req.params.id;
    UserModel.findOneAndRemove({ _id: userId }).exec(function(err, result) {
        const user = result;
        if (user) {
            return res.status(200).send(user);
        } else {
            return res.status(Errors.FileNotFound.code).send(Errors.FileNotFound);
        }
    });
});
/**
 * @route GET /products
 * @group product - Product operations
 * @returns {Array<Product>} 200 - Array of all products saved in database
 * @returns {object} 204 - No content
 */
router.get("/products", async(req, res, next) => {
    ProductModel.find({}).then((result) => {
        return res.status(200).send(result);
    }).catch((error) => {
        console.error(error);
        return res.status(Errors.NoContent.code).send(Errors.NoContent);
    });
});
/**
* @route POST /products
* @group product - Product operations
* @returns {Product} 200 - Product saved in database
* @returns {object} 400 - Bad Request
* @security JWT
*/
router.post("/products", async (req, res, next) => {
    const product = new ProductModel(req.body);
    if (product) {
        try {
            product.save();
            await UserModel.findOneAndUpdate({ _id: req.headers["authorization"].split(" ")[1] }, { $push: { products: product._id } })
            return res.status(200).send(product);
        } catch (error) {
            return res.status(Errors.BadRequest.code).send(Errors.BadRequest);
        }
    }
    else {
        return res.status(Errors.BadRequest.code).send(Errors.BadRequest);
    }
});
/**
 * @route PATCH /products
 * @group product - Product operations
 * @param {string} _id.query.required - Database identificator
 * @returns {Product} 200 - Product updated in database
 * @returns {object} 404 - File not found
 * @security JWT
 */
router.patch("/products/:id", async(req, res, next) => {
    const productId = req.params.id;
    ProductModel.findOneAndUpdate({ _id: productId }, req.body).exec(function(err, result) {
        const product = result;
        if (product) {
            return res.status(200).send(product);
        } else {
            return res.status(Errors.FileNotFound.code).send(Errors.FileNotFound);
        }
    });
});
/**
 * @route DELETE /products
 * @group product - Product operations
 * @param {string} _id.query.required - Database identificator
 * @returns {object} 200 - Product removed from database
 * @returns {object} 404 - File not found
 * @security JWT
 */
router.delete("/products/:id", async(req, res, next) => {
    const productId = req.params.id;
    let product = await ProductModel.findOneAndRemove({ _id: productId });
    if (product) {
        // await UserModel.findOneAndUpdate({_id: req.headers["authorization"].split(" ")[1]},{$pull: {products: product._id} })
        return res.status(200).send(product);
    } else {
        return res.status(Errors.FileNotFound.code).send(Errors.FileNotFound);
    }
});


module.exports = router;