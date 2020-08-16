# MicroAuth

## Description:
Logging in and authentication is usually a pretty important step in the web applications I build, but it usually takes a long time to set up and the steps are very repetitive (almost copy and paste). To cut down on the monotony of building a scalable web application, this repo acts as the "boilerplate" for authentication as a microservice. You can use regular email password sign in or you can sign in through Google or Facebook. It isn't difficult to add other oauth sign ins. All you would have to do is add the passport verification to the passport.ts file and the routes (just adding a file to the routes folder and a small update in app.ts). This application uses mongoDB to house accounts. Oauth signins and email/password signins are kept in two different collections. This is mostly because it was easier to have to separate collections for two separate schemas (this app makes use of mongoose to write to the DB). 

The things that you would need to fill in to use exist in the .env.example file. Just copy this file and rename it to .env. Once you've done so, you begin to fill it out.

## Features:
- email/ password sanitation
- email verification
- Facebook signup
- Google signup
- support for Kubernetes cluster

## Notes:
If you ever decide on adding an env variable, make sure to also add its type to the ProcessEnv interface in the app file. This is purely for typescript.

This service uses the email verify api to prove the email actually exists. In the future, I will probably use a different api to achieve this verification but for now this works because it is one of the few services that allows for one time payments (as opposed to monthly signups). 