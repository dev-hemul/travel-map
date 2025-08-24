import { generateKeyPairSync } from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import Tokens from './../model/token.js';

const rootdir = process.cwd();
const alg = 'RS512';
const lifedur = 5 * 60 * 1000;

// Синхронна генерація ключів
const { privateKey, publicKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});
let priv = privateKey;
let pub = publicKey;

// Збереження ключів у файли    
(async () => {
    try {
        await fs.mkdir(path.join(rootdir, 'keys'), { recursive: true });
        await fs.writeFile(path.join(rootdir, 'keys/priv.key'), priv);
        await fs.writeFile(path.join(rootdir, 'keys/pub.key'), pub);
        console.log('Ключі згенеровано і збережено у папці keys/');
    } catch (error) {
        console.error('Помилка збереження ключів:', error);
    }
})();

const createAccessT = (payload) => { 
    if (!priv) throw new Error('Приватний ключ не ініціалізований');
    const expiration = Math.floor(Date.now() / 1000) + Math.floor(lifedur / 1000);
    const jti = nanoid();
    payload.exp = expiration;
    payload.jti = jti;
    const privateKeyObject = { key: priv, format: 'pem' };
    const token = jwt.sign(payload, privateKeyObject, { algorithm: alg });
    return { token, jti };
};

const createRefreshT = async (jti, params) => { 
    if (!priv) throw new Error('Приватний ключ не ініціалізований');
    const token = nanoid();
    const refreshT = await new Tokens({ jti, token, params }).save(); 
    return refreshT.token;
};

const createTokens = async (iss) => {
    const { token: accessT, jti } = createAccessT({ iss });
    const refreshT = await createRefreshT(jti, { iss });
    return { accessT, refreshT };
};

const removeRefTokenByIss = async (iss) => {
    const result = await Tokens.deleteMany({ "params.iss": iss });
    return result;
};

const verifyToken = (token) => {
    if (!pub) throw new Error('Публічний ключ не ініціалізований');
    const publicKeyObject = { key: pub, format: 'pem' };
    return jwt.verify(token, publicKeyObject, { algorithms: [alg] });
};

export { createAccessT, createRefreshT, createTokens, removeRefTokenByIss, verifyToken };