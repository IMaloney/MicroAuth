import axios from 'axios';
import sgMail from '@sendgrid/mail';
import crypto from 'crypto';
import { InternalServerError } from '../errors/internal-server-error';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// UPDATE: cheaper to buy bulk verifications and use send grids free tier given that we probably won't have more than x users
export const emailDoesExist = async (email: string) => {
    // may change this api to a more popular one in the future
    const url = `https://app.verify-email.org/api/v1/${process.env.VERIFY_EMAIL_KEY}/verify/${email}`
    const {status, data } = await axios.get(url, {
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json' }
    });
    if (status !== 200) {
        throw new Error('something went really bad.');
    }
    if (!data.status) {
        const msg: string = data.smtp_log.split('\r')[0];
        throw new Error(msg);

    }
};

// will use templates to send emails... you should too, they look nice and are good from a marketing stand point
// using host from request so we don't have to make that an environment variable and change it every time
export const sendValidationEmail = async (to: string, host: string, token: string) => {
    const link = `${host}/confirmation/?token=${token}&email=${to}`;
    console.log(link);
    const msg = {
        to, 
        from: process.env.FROM_EMAIL,
        subject: 'test',
        text: `click link to verify: ${link}`,
        html: `<html><body><div><a href="${link}">click here</a></div></body></html>`
        
    };
    try {
        await sgMail.send(msg);        
    } catch (err) {
        throw new InternalServerError('Something went wrong on our part.');
    }
};

// creates the token, done for both signing up and for resending token
export const createToken = () => {
    return crypto.randomBytes(16).toString('hex');
}

// these are all separate functions because they all have mutually exclusive errors
// i.e. your password can be missing all of them, but should be very specific with which ones you are missing

// password contains one special character
export const containsSpecialCharacters = (password: string) => {
    const reg = /[`~!@#$%^&*()_+=\-\\\[\]{};:'\",<\.>\/?]/;
    const match = password.match(reg);
    if (!match) {
        throw new Error('No special characters in password.')
    }
    return true;
};

// password contains one capital letter
export const constainsCapitals = (password: string) => {
    const reg = /[A-Z]/;
    const match = password.match(reg);
    if (!match) {
        throw new Error('No capital letters in password.');
    }
    return true;
};

// password contains one lowercase letter
export const containsLowercase = (password: string) => {
    const reg = /[a-z]/;
    const match = password.match(reg);
    if (!match) {
        throw new Error('No lowercase letters in password.');
    }
    return true;
};

// password contains one number
export const containsNumber = (password: string) => {
    const reg = /\d/;
    const match = password.match(reg);
    if (!match) {
        throw new Error('No numbers in password.');
    }
    return true;
};