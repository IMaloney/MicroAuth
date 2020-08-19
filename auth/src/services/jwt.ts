import jwt from 'jsonwebtoken';

export const createJWT = (email: string, id: string) => {
    return jwt.sign(
        {
            id,
            email
        }, 
        process.env.JWT_KEY);
};