import passport from 'passport';
import passportFacebook from 'passport-facebook';
import passportGoogle, { VerifyCallback } from 'passport-google-oauth2';
import { OauthUser } from '../models/oauth-user';

const FacebookStrategy = passportFacebook.Strategy;
const GoogleStrategy = passportGoogle.Strategy;

// adding google strategy
passport.use(new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENTID,
            clientSecret: process.env.GOOGLE_SECRET,
            callbackURL: '/auth/google/callback',
            scope: ['email']
        }, 
        async (accessToken:string, refreshToken:string, profile:any, done:VerifyCallback)=> {
            let user: any = OauthUser.findOne({ googleId: profile.id });
            // if the user doesn't exist, make a user
            if (!user) {
                user = await new OauthUser(
                    {
                        googleId: profile.id, 
                        email: profile.email, 
                        firstName:profile.given_name, 
                        lastName: profile.family_name 
                    }
                ).save();
            } 
            done(null, user);
        }
    ) 
);

// adding facebook strategy 
passport.use(new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_APPID,
            clientSecret: process.env.FACEBOOK_SECRET,
            callbackURL: '/auth/facebook/callback',
            profileFields: ['email', 'name']
        },
        async (accessToken:string, refreshToken:string, profile:any, done:VerifyCallback) => {
            let user: any = OauthUser.findOne({ facebookId: profile.id});
            // if the user doesn't exist, make a user
            if (!user) {
              user = await new OauthUser(
                    {
                        facebookId: profile.id, 
                        email: profile._json.email,
                        firstName: profile._json.first_name,
                        lastName: profile._json.last_name
                    }
                ).save();
            }
            done(null, user);
        
        }
    )        
);