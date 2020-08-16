import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

// purely for async await
const scryptAsync = promisify(scrypt);

export const hash = async (password: string) => {
    const firstSalt = randomBytes(8).toString('hex');
    const secondSalt = randomBytes(8).toString('hex');
    // encrypting twice with separate salts
    const buf = (await scryptAsync(password, firstSalt, 64)) as Buffer;
    const newBuf = (await scryptAsync(buf, secondSalt, 64)) as Buffer;
    return `${secondSalt}.${newBuf.toString('hex')}.${firstSalt}`;
}

export const cmp =  async (stored: string, given: string) => {
    const [ secondSalt, hashed, firstSalt ] = stored.split('.');
    const firstBuf = (await scryptAsync(given, firstSalt, 64)) as Buffer;
    const secBuf = (await scryptAsync(firstBuf, secondSalt, 64)) as Buffer;
    return secBuf.toString('hex') === hashed;
}