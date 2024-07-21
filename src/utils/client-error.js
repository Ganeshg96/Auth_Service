const AppError = require('./error-handler');
const { StatusCodes } = require('http-status-codes');

class ClientError extends AppError {
    constructor(name, message, explanation, StatusCode) {
        super(
            name,
            message,
            explanation,
            StatusCode
        );
    }
}

module.exports = ClientError;