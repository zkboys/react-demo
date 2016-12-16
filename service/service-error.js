class ServiceError extends Error {
    constructor(errorMessage) {
        const code = errorMessage[0];
        const message = errorMessage[1];
        super(message, code);
        this.type = 'service';
        this.code = code;
    }
}

exports = module.exports = ServiceError;