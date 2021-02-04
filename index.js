const router = require('./router');
const express = require('express');
const UserModel = require('./schemas/user');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const http = require('http');
const Errors = require('./errors');


(async function() {
    const app = express();
    config = await loadConfig();
    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(config.baseUrl, async(req, res, next) => {
        if (await checkAccess(req)) {
            console.log('Authorized')
            return next();
        } else {
            //return res.status(Errors.Forbidden.code).send(Errors.Forbidden);
            return next();
        }
    });

    //app.use(config.baseUrl.toString(), await router.rr);
    app.use(config.baseUrl.toString(), router);

    server = http.createServer(app);
    const expressSwagger = require("express-swagger-generator")(app);
    let options = {
        swaggerDefinition: {
            info: {
                description: 'This is a sample server',
                title: 'Swagger',
                version: '1.0.0',
            },
            host: 'localhost',
            basePath: '/ingenieriaydesarrollo/api/v1/',
            produces: [
                "application/json",
                "application/xml"
            ],
            schemes: ['http'],
            securityDefinitions: {
                JWT: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'Authorization',
                    description: "User ID",
                }
            }
        },
        basedir: __dirname, //app absolute path
        files: ['./router/**/*.js', './schemas/**/*.js'] //Path to the API handle folder
    };
    expressSwagger(options)
    var port = normalizePort(process.env.PORT || '3000');
    server.listen(port);
    console.log(`Ingenieria Web API running at port ${ port }`);;
}());

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}


async function checkAccess(request) {

    const headerValue = request.headers["authorization"];
    console.log(headerValue)
    if (request.url === '/auth' || (request.url === '/users' && request.method === 'POST')) {
        return true;
    } else if (headerValue !== undefined && headerValue.startsWith("Bearer ")) {
        const user = await UserModel.findOne({ _id: headerValue.split(" ")[1] }).exec();
        //console.log(user);
        if (user !== null && user.token !== null) {
            return true;
        }
        return false;
    } else {
        return false;
    }
}

async function loadConfig() {
    var filePath = "config.json";
    try {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, { encoding: 'utf-8' }, async function(err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(JSON.parse(data));
                }

            });
        })
    } catch (error) {
        return Promise.reject(new Error());
    }
};

async function getUserToken(jsonEmail) {
    return new Promise(async function(resolve, reject) {
        let key = await fs.readFileSync(config.key, 'utf-8');
        jwt.sign(jsonEmail, key, { algorithm: 'RS256', expiresIn: '24h' }, function(err, token) {
            if (err) {
                reject(err);
            }
            //console.log(token);
            resolve(token);
        });
    })
}

async function checkUserToken(token) {
    return new Promise(async function(resolve, reject) {
        let cert = await fs.readFileSync(config.cert, 'utf-8');
        jwt.verify(token, cert, { ignoreExpiration: true }, function(err, token) {
            if (err) {
                reject(err);
            }
            //console.log(token);
            resolve(token);
        });
    })
}

module.exports = { checkAccess, getUserToken, checkUserToken }