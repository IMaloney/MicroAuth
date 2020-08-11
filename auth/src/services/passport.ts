import passport from 'passport';
import passportFacebook from 'passport-facebook';
import passportGoogle, { VerifyCallback } from 'passport-google-oauth2';

const FacebookStrategy = passportFacebook.Strategy;
const GoogleStrategy = passportGoogle.Strategy;

// adding google strategy
passport.use(new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENTID,
            clientSecret: process.env.GOOGLE_SECRET,
            callbackURL: '/auth/google/callback'
        }, 
        (accessToken:string, refreshToken:string, profile:any, done:VerifyCallback)=> {
         console.log("access token: ", accessToken);
         console.log("refresh token: ", refreshToken);
         console.log("profile: ", profile);
         done(null, "poop");
        }
    ) 
);

// adding facebook strategy 
passport.use(new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_APPID,
            clientSecret: process.env.FACEBOOK_SECRET,
            callbackURL: '/auth/facebook/callback'
        }, 
        (accessToken:string, refreshToken:string, profile:any, done:VerifyCallback) => {
            console.log(accessToken);
            console.log(refreshToken);
            console.log(profile);
            done(null, 'poop');
        }
    )        
);