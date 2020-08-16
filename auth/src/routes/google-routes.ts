import express from 'express';
import passport from 'passport';

const router = express.Router();

router.get('/auth/google', 
    passport.authenticate('google', 
    {
        scope: ['profile', 'email']
    })
);

router.get('/auth/google/callback', 
    passport.authenticate('google',
        {
            successRedirect: process.env.SUCCESS_LINK,
            failureRedirect: process.env.FAIL_LINK
        }
    )
);

export { router as GoogleRouter };