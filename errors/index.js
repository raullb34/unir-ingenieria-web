
class Error {
    constructor(code, description){
        this.code = code;
        this.description = description;
    }

}

const Forbidden = new Error (403,'This operation needs authentiction');
const InvalidAuthParams = new Error (401,'Invalid auth params, provide some valid');
const BadRequest = new Error(400, 'Error in request');
const FileNotFound = new Error(404, 'Document not found');
const NoContent = new Error(204, 'No content');

module.exports = {Forbidden, InvalidAuthParams, BadRequest, FileNotFound, NoContent}