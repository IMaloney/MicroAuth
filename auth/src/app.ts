import './config/config';
import express from 'express';
import passport from 'passport';
import 'express-async-errors';
import helmet from 'helmet';
// import { json } from 'body-parser';
import './services/passport';

import { RegularRouter } from './routes/regular-routes';
import { GoogleRouter } from './routes/google-routes';
import { FacebookRouter } from './routes/facebook-routes';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';


// lets env vars play nice with typescript
declare global {
    namespace NodeJS{
        interface ProcessEnv {
            DB_LINK: string;
            GOOGLE_CLIENTID: string;
            GOOGLE_SECRET: string;
            FACEBOOK_APPID: string;
            FACEBOOK_SECRET: string;
            PORT: number;
            VERIFY_EMAIL_KEY: string;
        }
    }
}

const app = express();

// storing a jwt in a cookie because the browser will do us a favor and manage the cookie, while the jwt prevents 
// changing whats in the cookie
// might just encrypt the cookie instead

app.set('trust proxy', true);
app.use(helmet());
app.use(express.json());


app.use(RegularRouter);
app.use(GoogleRouter);
app.use(FacebookRouter);

app.get('/success', (req, res) => {
    res.send("nice!");
}); 

app.get('/fail', (req, res) => {
    res.send("fail, boo!");
});

app.all('*', async (req, res, next) => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };