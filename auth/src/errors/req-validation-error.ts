import { CustomError } from './custom-error';
import { ValidationError } from 'express-validator';

export class ReqValidationError extends CustomError { 
    statusCode = 404;

    constructor(private errs: ValidationError[]) {
        super('route not found');
        Object.setPrototypeOf(this, ReqValidationError.prototype);
    }
    serializeErrors() {
        return this.errs.map(err => {
            return {message: err.msg, field: err.param }
        });
    }
}