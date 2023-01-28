import crypto from 'crypto';
import { Cookie } from '../models/cookie';

const algorithm = 'aes-256-cbc';
const key = Buffer.from('01d3354789014fe55v8CC623s567Aa4F');
const initVector = Buffer.from('61dgA54ggh55462Q');

export function encrypt(cookie: any) {
  const cipher = crypto.createCipheriv(algorithm, key, initVector);
  let encryptedData = cipher.update(cookie, "utf-8", "hex");
  encryptedData += cipher.final("hex");
  return encryptedData;
}

export function decrypt(encryptedData: any) {
  const decipher = crypto.createDecipheriv(algorithm, key, initVector);
  let decryptedData = decipher.update(encryptedData, "hex", "utf-8");
  decryptedData += decipher.final("utf8");
  return decryptedData;
}

export function getCookie(req: any, name: any) {
  return (req.cookies ??= req.getHeader('cookie')).match(getCookie[name] ??= new RegExp(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`))?.[2];
}

export function createSetCookie(options: Cookie): string {
  const {
    maxAge = new Date().getTime() + 1000 * 60 * 60 * 24 * 365, // one year
    domain = 'mongot.com',
    path = '/',
    secure = true,
    httpOnly = true,
    sameSite = 'lax'
  } = options;

  return `${options.name}=${options.value}`
    + `; Max-Age=${maxAge}`
    + `; Domain=${domain}`
    + `; Path=${path}`
    + `${secure ? '; Secure' : ''}`
    + `${httpOnly ? '; HttpOnly' : ''}`
    + `; Path=${sameSite}`;
}