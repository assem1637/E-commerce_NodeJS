class apiError extends Error {

    constructor(message, statusCode) {

        super(message);
        this.statusCode = statusCode;
        this.error = message;

    };

};




export default apiError;