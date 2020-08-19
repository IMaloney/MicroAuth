# MicroAuth

## Description:
Logging in and authentication is usually a pretty important step in the web applications I build, but it usually takes a long time to set up and the steps are very repetitive (almost copy and paste). To cut down on the monotony of building a scalable web application, this repo acts as the "boilerplate" for authentication as a microservice. You can use regular email password sign in or you can sign in through Google or Facebook. It isn't difficult to add other oauth sign ins. All you would have to do is add the passport verification to the passport.ts file and the routes (just adding a file to the routes folder and a small update in app.ts). This application uses mongoDB to house accounts. Oauth signins and email/password signins are kept in two different collections. This is mostly because it was easier to have to separate collections for two separate schemas (this app makes use of mongoose to write to the DB). 

The things that you would need to fill in to use exist in the .env.example file. Just copy this file and rename it to .env. Once you've done so, you begin to fill it out.

## Features:
- email/ password sanitation
- email validation
- email verification
- Facebook signup
- Google signup
- sessions
- support for Kubernetes cluster

## Notes:
If you ever decide on adding an env variable, make sure to also add its type to the ProcessEnv interface in the app file. This is purely for typescript.

Sessions are implemented using Json web tokens and cookies. Rather than place the JWT in the auth header or add it to the request body, I just put it in the cookie. Doing so allows for easy management of sessions. Also, JWTs were a good choice for session management because it frees us from keeping track of session ids, which would require a separate data store once this service is distributed amongst a bunch of different servers.

This service uses two separate email apis for verification and sending emails. The first, verify email, checks to see if the email exists. The second, SendGrid, is to actually send the email. SendGrid has their own email verification service, but there were a few reasons for doing this. First, SendGrid's email verification service is only available to a pricey tier in their plans. It is actually cheaper to buy a one time set of 10,000 verifications from verify email and then use SendGrid's free tier to send emails versus solely using SendGrid. The second reason is to prevent bots from sending emails to SendGrid. Spam emails take away from the free tier and we are really not trying to spend more than $20 total right now. Plus the goal is to try to keep the email hit rate high and spam detracts from that a lot.

## External Apis
- verify email https://verify-email.org/
- SendGrid https://sendgrid.com/