class InvalidRequestError extends Error {
    constructor(...params){
        super(...params)

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, InvalidRequestError);
          }

        this.name = "InvalidRequestError"
    }
}

class NotFoundError extends Error {
    constructor(item, ...params){
        super(...params)

        if(Error.captureStackTrace) {
            Error.captureStackTrace(this, NotFoundError)
        }

        this.item = item
        this.name = "NotFoundError"
    }
}

class DuplicateError extends Error {
    constructor(...params){
        super(...params)

        if(Error.captureStackTrace) {
            Error.captureStackTrace(this, NotFoundError)
        }

        this.name = "DuplicateError"
    }
}

module.exports = {NotFoundError, InvalidRequestError, DuplicateError}