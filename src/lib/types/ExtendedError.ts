/**
 * Extends the Error object to include a status code, cause, message and stack.
 * @property {number} statusCode - The status code of the error.
 * @property {string} message - The error message.
 * @property {string} stack - The error stack.
 * @property {Error} cause - The cause of the error.
 * @module ExtendedError
 */
export class ExtendedError extends Error {
    cause?: Error
    status?: number

    constructor(message?: string) {
        super(message)
        this.name = this.constructor.name
        Error.captureStackTrace(this, this.constructor)
        //Note setPrototypeOf restore prototype chain ensures instanceof works.
        Object.setPrototypeOf(this, new.target.prototype)
    }
}