import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { User } from '../models/user';
import { Token } from '../models/token';
import { BadRequestError } from '../errors/bad-request-error';
import { InternalServerError } from '../errors/internal-server-error';
import { createToken, sendValidationEmail } from '../services/validation';
import { validateRequest } from '../middlewares/request-validator';

const router = express.Router();

router.post('/confirmation', async (req: Request, res: Response) => {
    const { token, email } = req.query;
    const user = await User.findOne({ email: String(email) });
    // this should never happen
    if (!user) {
        throw new BadRequestError('User does not exist');
    }
    // check if user is verified
    if (user.isVerified) {
        throw new BadRequestError('User already verified.');
    }
    const tok = await Token.findOne({ token: String(token) });
    // if the token has expired, just throw an error
    // by the grace of mongodb, users get an extra minute before their token is deleted
    if (!tok) {
        throw new BadRequestError('Cannot find a token for the user, request a new token.');
    }
    user.isVerified = true;
    await user.save(err => {
        if (err) {
            throw new InternalServerError('something went wrong on our part.');
        }
    });
    res.status(200).send({});
});

router.post('/resend', 
    [
        body('email').trim()
                    .notEmpty()
                    .bail()
                    .isEmail().withMessage('Email must be vaild.')
                    .bail()
                    .isLength({min: 0, max: 340})
                    .bail()
    ], 
    validateRequest,
    async (req: Request, res: Response) => {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            throw new BadRequestError('user doesn\'t exist');
        }
        if (user.isVerified) {
            throw new BadRequestError('user is already verified.');
        }
        const token = new Token({ userId: user._id, token: createToken() });
        await token.save(err => {
            if (err) {
                throw new InternalServerError('something went wrong on our part.')    ;
            }
        });
        const { host } = req.headers;
        await sendValidationEmail(user.email, host!, token.token);
        res.status(200).send({});
});

export { router as VerificationRouter };