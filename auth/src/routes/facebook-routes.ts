import express, { Response, Request, NextFunction } from 'express';
import passport from 'passport';
import { createJWT } from '../services/jwt'; 
import { BadRequestError } from '../errors/bad-request-error';

const router = express.Router();

router.get('/auth/facebook', 
    passport.authenticate('facebook', 
    {
        scope: 'email'
    })
);

router.get('/auth/facebook/callback', (req: Request, res: Response, next: NextFunction) => { 
        passport.authenticate('facebook', (err, user, info) => {
                if (err) { return next(err); }
                if (!user) {
                    throw new BadRequestError('cannot sign in');
                }
                req.logIn(user, {session: false }, err => {
                    if (err) { return next(err); }
                    req.session = {
                        jwt: createJWT(user.email, user.id)
                    };
                    return res.status(200).send(user);
                });
            }
        )(req, res, next); 
    }
);

export { router as FacebookRouter };