
class Error {
    constructor(code, description){
        this.code = code;
        this.description = description;
    }

}

const Forbidden = new Error (403,'This operation needs authentiction');
const InvalidAuthParams = new Error (405,'Invalid auth params, provide some valid');

module.exports = {Forbidden, InvalidAuthParams}