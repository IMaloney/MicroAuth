import express from 'express';
import passport from 'passport';

const router = express.Router();

router.get('/auth/facebook', passport.authenticate('facebook', 
    {
        scope: 'email'
    })
);

router.get('/auth/facebook/callback', 
    passport.authenticate('facebook',
        {
            successRedirect: process.env.SUCCESS_LINK,
            failureRedirect: process.env.FAIL_LINK
        }
    )
);

export { router as FacebookRouter };