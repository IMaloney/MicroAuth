import axios from 'axios';

export const emailDoesExist = async (email: string) => {
    // may change this api to a more popular one in the future
    const url = `https://app.verify-email.org/api/v1/${process.env.VERIFY_EMAIL_KEY}/verify/${email}`
    const {status, data } = await axios.get(url, {
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json' }
    });
    if (status !== 200) {
        throw new Error('something went really bad.');
    }
    if (data.status === 0) {
        const msg: string = data.smtp_log.split('\r')[0];
        throw new Error(msg);

    }
};

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