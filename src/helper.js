const crypto = require('crypto');
const { cryptoKey } = require('./config');
const encrypt = (text) => {
    const IV_LENGTH = 16;
    try {
        const salt = crypto.randomBytes(2).toString('hex');
        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(cryptoKey), iv);
        const toEncode = `${salt}:${JSON.stringify(text)}`;
        const encrypted = Buffer.concat([cipher.update(toEncode), cipher.final()]);
        return `${salt}:${iv.toString('hex')}:${encrypted.toString('hex')}`;
    } catch (err) {
        return;
    }
};

const decrypt = (text) => {
    try {
        const textParts = text.split(':');
        const salt = textParts.shift();
        const iv = Buffer.from(textParts.shift(), 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(cryptoKey), iv);
        const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]).toString();
        if (decrypted.indexOf(`${salt}:`) === 0) {
            return JSON.parse(decrypted.substr(salt.length + 1));
        }
        return text;
    } catch (err) {
        return text;
    }
};

const set = (val) => {
    return encrypt(val);
};

const get = (val) => {
    return decrypt(val);
};

module.exports = { set, get };