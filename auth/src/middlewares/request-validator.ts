import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ReqValidationError } from '../errors/req-validation-error';
// only do email existance validation in sign up not in signin
export const validateRequest = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errs = validationResult(req);
    if (!errs.isEmpty()) {
        throw new ReqValidationError(errs.array());
    }
    next();
};