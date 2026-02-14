import dotenv from 'dotenv'
import path from 'path';
import jwt from 'jsonwebtoken';
import { PostgrestSingleResponse } from '@supabase/supabase-js';

dotenv.config({ path: [path.resolve('') + '/.env', path.resolve('') + '/.env.local'] });

export const HOST = process.env.HOST || 'localhost';
export const PORT = process.env.PORT || 8000;
export const TOKEN = process.env.TReadOnly || 'CHANGE_ME_IN_THE_ENV_FILE';

export const jwtPrivateKey = path.resolve('') + '/keys/private-key.pem';

import Supabase, { TGID } from '../supabaseClient';
export const SBase = Supabase;

export interface Credentials {
  email: string,
  password: string,
  tgid?: string
}

export type User = {
  id: number;
  username: string;
  email: string;
  password?: string;
  token?: string;
  tgid?: string | null;
  human?: () => void;
}

function isUser(obj: any): obj is User {
  return obj && typeof obj.human === 'function';
}

function isTGID(obj: any): obj is TGID {
  return obj && typeof obj.row === 'function';
}

export function generateToken (user: User | TGID) {
  if (isUser(user) ) {
    // if User
    return jwt.sign({
      id: user.id,
      tgid: user.tgid,
      username: user.username
    }, jwtPrivateKey, { expiresIn: '24h' });
  } else if (isTGID(user)) {
    // if TGID
    return jwt.sign({
      id: user.id,
      tgid: user.tgid,
      username: user.username
    }, jwtPrivateKey, { expiresIn: '24h' });
  } else {
    // if Other
    return jwt.sign(user, jwtPrivateKey, { expiresIn: '24h' });
  }
    
}

export function verifyToken(req: any, res: any, next: any) {  
  const token = req.headers['authorization']?.split(' ')[1].replace(' ', '');  
  if (!token) {  
    return res.status(403).send('Требуется токен аутентификации');  
  }
  try {  
    //const decoded = jwt.verify(token, jwtPrivateKey);
    jwt.verify(token, jwtPrivateKey, (err: any, decoded: any) => {  
      if (err) {  
        if (err.name === 'TokenExpiredError') {
          //console.log('Токен просрочен');
          return res.status(401).send('Токен просрочен');  
        }
        //console.log('Неправильный токен');
        return res.status(403).send('Неправильный токен');  
      } 
      req.user = decoded;
      //console.log('next');  
      next();  
    });  
    //req.user = decoded;
  } catch (err) {  
    return res.status(401).send('Неправильный токен');  
  }  
  //console.log('return next()');
  return next();  
}

// Извлечение base64 из dataUrl
export function extractBase64(dataUrl: string): string | null {
  const match = dataUrl.match(/^data:.*?base64,(.*)$/i);
  return match ? match[1].trim() : null;
}