import './config/config';
import express from 'express';
import 'express-async-errors';
import helmet from 'helmet';
import cookieSession from 'cookie-session';
import './services/passport';

import { RegularRouter } from './routes/regular-routes';
import { GoogleRouter } from './routes/google-routes';
import { FacebookRouter } from './routes/facebook-routes';
import { VerificationRouter } from './routes/verification-routes';
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
            JWT_KEY: string;
            VERIFY_EMAIL_KEY: string;
            SENDGRID_API_KEY: string;
            FROM_EMAIL: string;
        }
    }
}

const app = express();

app.set('trust proxy', true);
app.use(helmet());
app.use(express.json());
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}));


app.use(RegularRouter);
app.use(GoogleRouter);
app.use(FacebookRouter);
app.use(VerificationRouter);

app.all('*', async (req, res, next) => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };