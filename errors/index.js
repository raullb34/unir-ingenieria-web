
class Error {
    constructor(code, description){
        this.code = code;
        this.description = description;
    }

}

const Forbidden = new Error (403,'This operation needs authentiction');
const InvalidAuthParams = new Error (419,'Invalid auth params, provide some valid');
const ErrorInSave = new Error(512, 'Error saving in database');
const FileNotFound = new Error(404, 'Document not found');
const NoContent = new Error(204, 'No content');

module.exports = {Forbidden, InvalidAuthParams, ErrorInSave, FileNotFound, NoContent}