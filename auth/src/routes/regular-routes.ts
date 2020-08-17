import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { User } from '../models/user';
import { Token } from '../models/token';
import { BadRequestError } from '../errors/bad-request-error';
import { InternalServerError } from '../errors/internal-server-error';
import * as validation from '../services/validation';
import { cmp } from '../services/password';
import { validateRequest } from '../middlewares/request-validator';

const router = express.Router();

// TODO: convert stuff to middlewares

// set a max length of email as 340 because longest email in existance is 345 characters total
// it costs money to validate if the email is actually active so we bail if there are any errors beforehand 
// also, for testing, we will just have email does exist commented out because I've already used my monthly quota 
router.post('/users/signup', 
    [
        // TODO: decide on capitalization
        body('firstName').trim()
                         .notEmpty()
                         .bail()
                         .isLength({min: 2, max: 50})
                         .withMessage('First name must be between 2 and 50 characters.'),
        body('lastName').trim()
                        .notEmpty()
                        .bail()
                        .isLength({min: 2, max: 50})
                        .withMessage('Last name must be between 2 and 50 characters.'), 
        body('email').trim()
                     .notEmpty()
                     .bail()
                     .isEmail().withMessage('Email must be vaild.')
                     .bail()
                     .isLength({min: 0, max: 340})
                     .bail()
                    //  .custom(validation.emailDoesExist)
                    ,
        body('password').trim()
                        .notEmpty()
                        .bail()
                        .isLength({min:8, max:128}).withMessage('Password must be between 8 and 128 characters.')
                        .custom(validation.containsSpecialCharacters)
                        .custom(validation.constainsCapitals)
                        .custom(validation.containsLowercase)
                        .custom(validation.containsNumber)

    ], 
    validateRequest, 
    async (req: Request, res: Response) => {
        const { firstName, lastName, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new BadRequestError('Email in use.');
        }
        const user = new User({ firstName, lastName, email, password });
        await user.save(async err => {
            if (err) {
                throw new InternalServerError('Something went wrong on our part.');
            }
        });
        const token = new Token({ userId: user._id, token: validation.createToken() })
        await token.save(err => {
            if (err) {
                console.log(err);
                throw new InternalServerError('Something went wrong on our part.');
            }
        });
        const { host } = req.headers;
        // TODO: overriding ts based on the assumption the host header will always be set, so double check this
        await validation.sendValidationEmail(email, host!, token.token);
        // session stuff here

        res.status(201).send(user);

    }
);

router.post('/users/signin', 
    [
        body('email').trim()
                     .notEmpty()
                     .bail()
                     .isEmail().withMessage('Email must be valid'),
        body('password').trim()
                        .notEmpty()
                        .bail()
                        .isLength({min:8, max:128}).withMessage('Password should be between 8 and 128 characters.')
    ], 
    validateRequest,
    async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
        throw new BadRequestError('email or password was incorrect.');
    }
    const right = await cmp(existingUser.password, password);
    if (!right) {
        throw new BadRequestError('email or password was incorrect.');
    }

    // session stuff here


    res.status(200).send(existingUser);
});

router.post('/users/signout', (req: Request, res: Response) => {
// need to nullify session
    res.send({});
});


export { router as RegularRouter };