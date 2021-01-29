const mongoose = require('mongoose');

const connection_string = 'mongodb://localhost:27017/IngenieriaWeb';

class Database {
    constructor() {
        _connect()
    }
}

function _connect() {
    mongoose.connect(connection_string, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
        console.log('Connection succesful');
    })
    .catch(err => {
        console.error(`Database connection error ${err}`);
    })
};

module.exports = new Database();

