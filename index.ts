import cors from 'cors';

import express, { Express, Request, Response } from 'express';

import jwt from 'jsonwebtoken';
import { Credentials, extractBase64, generateToken, jwtPrivateKey, PORT, User, verifyToken } from './common/common';
import SBase, { getRow, insertTUser, requestTUser, requestTUserByTGId, TGID, TUser, updateTUser, upsertTUser } from './supabaseClient';

import * as omar from "./data/omar.json";
import { formDataToJson, getUserProfilePhotos } from './api/bot/methods';

//import { TinkoffInvestApi } from 'tinkoff-invest-api';
//import { PortfolioRequest_CurrencyRequest, PortfolioResponse } from 'tinkoff-invest-api/cjs/generated/operations';
//import { Account } from 'tinkoff-invest-api/cjs/generated/users';

//import users from './users.json';
import { TOKEN } from './common/common';

// Supabase
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { findTInstrument, getInfo, getPortfolio, sdkGetBond, sdkGetEvents, sdkGetBonds, sdkGetInfo } from './tbank';
import { createSdk } from './api/t-invest-sdk/sdk';

// создать клиента с заданным токеном доступа
//const api = new TinkoffInvestApi({ token: TOKEN });
const api = createSdk(TOKEN);


async function fetchTelegramAvatar(chatId: string | number) {
  const botToken = process.env.BOT_TOKEN as string;
  if (!botToken) throw new Error('TELEGRAM_BOT_TOKEN not found');

  try {
    // 1. Получаем профили пользователя
    let response = await fetch(`https://api.telegram.org/bot${botToken}/getUserProfilePhotos`, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user_id: chatId, limit: 1 }),
    });

    if (!response.ok) throw new Error('Error fetching user profile photos.');

    const data = await response.json();
    if (data.result.total_count === 0) return null;

    // 2. Получаем информацию о первом файле
    const fileId = data.result.photos[0][0].file_id;
    response = await fetch(`https://api.telegram.org/bot${botToken}/getFile`, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ file_id: fileId }),
    });

    if (!response.ok) throw new Error('Error fetching file info.');

    const fileInfo = await response.json();
    const filePath = fileInfo.result.file_path;

    // 3. Прямая ссылка на файл аватара
    const downloadUrl = `https://api.telegram.org/file/bot${botToken}/${filePath}`;

    return downloadUrl;
  } catch (err) {
    console.error(err);
    return null;
  }
}

// Запрос аватара в формате base64
async function fetchB64Photo(file_url: string) {
  const result: string = await fetch(file_url).then(response => {
    return response.blob();
  }).then(async (result) => {
    let blob: Blob | null = result;

    const buffer = Buffer.from(await blob.arrayBuffer());
    const blobtype = 'image/jpeg';//blob.type;
    const data = 'data:' + blobtype + ';base64,' + buffer.toString('base64');

    return data;
  });

  return result;
}




const app: Express = express();
app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Запущен сервер на Typescript...')
});

app.listen(PORT, () => {
  console.log(`Сервер прослушивает порт ${PORT}`)
});

app.post('/login', async (req: Request, res: Response) => {
  const { email, password, tgid }:Credentials = req.body;

  const response = await requestTUser(email);

  const user = response?.find((user) => {
    return user.email === email && user.password === password;
  });

  if (!user) return res.status(404).json({message: 'Пользователь не найден либо пароль неверен!' });

  const result = { 
    id: user.id,
    name: user.username,
    email: user.email,
    token: generateToken(user),
    tgid: user.tgid !== undefined ? user.tgid : null
  }
  
  console.log('result: ', result);

  return res.status(200).json(result);
});

// Маршрут для получения аватара
//app.use('/api/getAvatar/:chatId', verifyToken);
app.get('/api/getAvatar/:chatId', async (req, res) => {
  console.log('Request: ', req);
  const chatId = req.params.chatId;
  const downloadUrl = await fetchTelegramAvatar(chatId);

  if (!downloadUrl) {
    return res.status(404).send({ error: 'No profile photos available' });
  }

  // Перенаправление стриминга напрямую
  res.redirect(downloadUrl);
});
  
app.get('/avatar', async (req: Request, res: Response) => {
  console.log('REQUEST AVATAR');
  const { tgid } = req.query;
  const botToken = process.env.BOT_TOKEN as string;

  // 0. Проверка действительности токена
  const token = req.headers.authorization?.split(' ')[1].replace(' ', '')||'';
  const decoded = jwt.verify(token, jwtPrivateKey) as jwt.JwtPayload; //const { id, username, email } = decoded;
  const exp = decoded?.exp; //const expdate = exp ? new Date(exp * 1000).toLocaleString() : '';

  //console.log('token: ', token);
  //console.log('decoded: ', decoded);

  const onExpired = () => res.status(404).json({message: 'Токен не действует!' });
  const onError = () => res.status(404).json({ message: 'Срок действия токена истёк!' });

  const onValid = async () => {
    try {
      // 1. Получаем профили пользователя
      let method = 'getUserProfilePhotos';
      let requestPhotos = new FormData();
      requestPhotos.append('user_id', tgid?.toString() || '');

      let response = await fetch(`https://api.telegram.org/bot${botToken}/${method}`, {
        method: 'POST',
        body: requestPhotos,
      });
      
      if (!response.ok) throw new Error('Ошибка запроса');

      const data = await response.json();
      if (data.result.total_count === 0) return null;

      // 2. Получаем информацию о первом файле
      const fileId = data.result.photos[0][0].file_id;
      method = 'getFile';
      let requestFile = new FormData();
      requestFile.append('file_id', fileId);

      let responseFile = await fetch(`https://api.telegram.org/bot${botToken}/${method}`, {
        method: 'POST',
        body: requestFile
      });

      if (!responseFile.ok) throw new Error('Ощибка запроса информации о файле.');
      
      const fileInfo = await responseFile.json();
      const filePath = fileInfo.result.file_path;

      // 3. Прямая ссылка на файл аватара
      const downloadUrl = `https://api.telegram.org/file/bot${botToken}/${filePath}`;
      let avatar: string | void = await fetchB64Photo(downloadUrl);

      res.status(200).json({ status: 'done', avatar: extractBase64(avatar) });

    } catch (error) {
      console.error(error); // обработка ошибки
      res.status(500).json({ status: 'error', error });
    }
  }

  !exp ? onExpired() : new Date() < new Date(exp * 1000) ? onValid() : onError();  
});

app.post('/connect', async (req: Request, res: Response) => {
  // упростить с передачей только tgid
  const { tgid }: Credentials = req.body;

  console.log(tgid);
  
  let avatar: string = '';

  let formData = new FormData();
  
  formData.append('user_id', tgid || '');

  async function fetchB64Photo(file_url: string) {
    const result: string = await fetch(file_url).then(response => {
      return response.blob();
    }).then(async (result) => {
      let blob: Blob | null = result;
 
      const buffer = Buffer.from(await blob.arrayBuffer());
      const blobtype = 'image/jpeg';//blob.type;
      const data = 'data:' + blobtype + ';base64,' + buffer.toString('base64');

      return data;
    });

    return result;
  }

  getUserProfilePhotos(
    formDataToJson(formData)
  ).then(async (result: any) => {
    //console.log('%cresult: ','color: red', result);
    if (result?.payload?.ok) {
      const total_count = result?.payload?.result?.total_count;
      const photos = result?.payload?.result?.photos;
      
      const photo_id = total_count > 0 ? photos[0][0].file_id : 0;
 
      const botToken = process.env.BOT_TOKEN;
      const url = `https://api.telegram.org/bot${botToken}/getFile?file_id=${photo_id}`;

      const b64: string | undefined = await fetch(url)
        .then(async (response) => {
          return response.json();
        })
        .then(async (result) => {
          
          if (result.ok) {
            const file_url = `https://api.telegram.org/file/bot${botToken}/${result.result.file_path}`;
            avatar = await fetchB64Photo(file_url);
            console.log('%c::avatar:: ','color: cyan', avatar);
            return avatar;
          }
        });

      return b64;
        
    };
  }).catch((error) => {
    console.log('Ошибка запроса фото: ', error);
  })

  //console.log('tgid: ', tgid);
  //console.log('avatar: ', avatar);

  const response: TGID[]|null = await getRow(tgid || '');
  //console.log('response: ', response);
  const response_T: User[]|null = await requestTUserByTGId(tgid || '');

  const user = response?.find((user) => {
    return user.tgid === tgid;
  });

  if (!user) {
    return res.status(404).json({message: 'Пользователь не найден либо пароль неверен!' });
  } else {
    console.log('user: ', user);
  }

  const user_T = response_T?.find((user) => {
    return user.tgid === tgid;
  });

  const token = generateToken(user);

  // Новый токен в базу
  if (tgid) {
    const response = await requestTUserByTGId(tgid);
    let finded = false;
    const result = response?.find((user) => {
      if (user.tgid === tgid) {
        finded = true;
        updateTUser(user.id, user.created_at, user.username, user.email, user.password, token, tgid);
        return user;
      }
    });

    if (!finded) {
      upsertTUser(user.username||tgid, tgid+'@example.com', '0000', token, tgid);
    }
    //console.log("result: ", result);
  }

  const result = {
    id: user.id,
    created_at: user.created_at,
    name: user.username,
    email: user_T?.email,
    token: token,
    tgid: user.tgid !== undefined ? user.tgid : null,
    avatar: extractBase64(avatar)
  }

  console.log('result: ', result);
  console.log('end connect')

  return res.status(200).json(result);
});

app.post('/registration', async (req: Request, res: Response) => {
  const { username, email, password, tgid }: User = req.body;

  const tuser: TUser = {
    // параметры, которые создаются базой данных автоматически
    id: 0,
    created_at: new Date().toLocaleString(),
    //
    username: username,
    email: email,
    password: password || '',
    last_token: '',
    tgid: tgid || '',
  }

  const response = await insertTUser( username, email, password, generateToken(tuser), tgid );

  const user = response?.data?.find((user) => {
    return user.email === email && user.password === password || user.email === email && user.tgid === tgid;
  });

  if (!user) {
    return res.status(404).json({message: 'Пользователь не создан!' });
  }

  const result = {
    id: user.id,
    created_at: user.created_at,
    name: user.username,
    email: user.email,
    token: user.last_token,
    tgid: user.tgid
  }

  return res.status(200).json(result);
});

app.get('/about', (req: Request, res: Response) => {
  console.log('about');
  const token = req.headers.authorization?.split(' ')[1].replace(' ', '')||'';
  //console.log('token: ', token);
  const decoded = jwt.verify(token, jwtPrivateKey) as jwt.JwtPayload;
  console.log('decoded: ', decoded);
  const { id, username, email } = decoded;
  const exp = decoded?.exp;
  const expdate = exp ? new Date(exp * 1000).toLocaleString() : '';  
  if (!exp) {
    res.status(404).json({message: 'Токен не действует!' });
  } else {
    if (new Date() < new Date(exp * 1000)) {
      res.status(200).json({ 
        message: `Добро пожаловать, ${username} (id: ${id}, email: ${email})! Токен действует до ${expdate}...`
      });    
    } else {  
      res.status(404).json({
        message: 'Срок действия токена истёк!'
      });
    }  
  }

});

app.get('/info', (req: Request, res: Response) => {
  res.send('tmajs-profile-client-server');
});

app.get('/private', (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1].replace(' ', '')||'';
  //console.log('token: ', token);
  const decoded = jwt.verify(token, jwtPrivateKey) as jwt.JwtPayload;
  console.log('decoded: ', decoded);
  const { id, username, email, tgid } = decoded;
  const exp = decoded?.exp;
  const expdate = exp ? new Date(exp * 1000).toLocaleString() : '';  
  if (!exp) {
    res.status(404).json({message: 'Токен не действует!' });
  } else {
    if (new Date() < new Date(exp * 1000)) {
      res.status(200).json({ 
        message: `Добро пожаловать, ${username} (id: ${id}, email: ${email})! Токен действует до ${expdate}...`,
        data: {
          id: id,
          name: username,
          email: email,
          tgid: tgid
        }
      });    
    } else {  
      res.status(404).json({
        message: 'Срок действия токена истёк!'
      });
    }  
  }

});

app.use('/test', verifyToken);  
app.get('/test', (req: Request, res: Response) => {
  console.log('Request: ', req); 
  res.status(200).json({message:'Доступ к закрытому маршруту с помощью токена получен'});  
});

app.use('/rubals', verifyToken);  
app.get('/rubals', (req: Request, res: Response) => {
  console.log('Request: ', req);
  res.status(200).json(omar);
});
app.post('/rubals', (req: Request, res: Response) => {
  console.log('Request: ', req);
  res.status(200).json(omar);
});

app.use('/bond', verifyToken);
app.get('/bond', (req: Request, res: Response) => {
  console.log('Bond: ', req);
  const response = {bond: 'james'}
  res.status(200).json(response);
});


//
// 
// 
//      T-Bank
// 
//  
// 

function proceedWithToken(
  req: Request,
  res: Response,
  proceed: (req: Request, res: Response, user: TUser | null) => void
) {
  const token = req.headers.authorization?.split(' ')[1].replace(' ', '');
  let user: TUser | null = null;
  if (!token) {  
    return res.status(403).send('Требуется токен аутентификации');  
  }
  try {  
    jwt.verify(token, jwtPrivateKey, (err: any, decoded: any) => {  
      if (err) {  
        if (err.name === 'TokenExpiredError') {
          return res.status(401).send('Токен просрочен');  
        }
        return res.status(403).send('Неправильный токен');  
      } 
      user = decoded;
      proceed(req, res, user);  
    });  
  } catch (err) {  
    return res.status(401).send('Неправильный токен');  
  }
}
  
app.post('/instrument', async (req: Request, res: Response) => {
  proceedWithToken(req, res, async (req: Request, res: Response, user: TUser | null) => {
    console.log('User: ', user);
    const query = req.body.query;
    const response = await findTInstrument(query, 'share');
    res.status(200).json(response);
  });
});

app.post('/getinfo', async (req: Request, res: Response) => {
  proceedWithToken(req, res, async (req: Request, res: Response, user: TUser | null) => {
    const response = await sdkGetInfo();
    res.status(200).json(response);
  })
});

app.post('/getbonds', async (req: Request, res: Response) => {
  try {
    proceedWithToken(req, res, async (req: Request, res: Response, user: TUser | null) => {
      const { ttoken } = req.body;
      if (ttoken === '') {
        res.status(401).json({message: 'Токен доступа не найден!'});
      } else {
        const response = await sdkGetBonds(ttoken);
        res.status(200).json(response);
      }
    })
  } catch (error) {
    res.status(500).json({message: 'Внутренняя ошибка сервера!'});
  }
});


app.post('/getbond', async (req: Request, res: Response) => {
  try {
    proceedWithToken(req, res, async (req: Request, res: Response, user: TUser | null) => {
      const { ticker, classcode, ttoken } = req.body;

      if (ttoken === '' || ticker === '' || classcode === '') {
        if (ttoken === '') {
          res.status(401).json({message: 'Токен доступа не найден!'});
        }
        if (ticker === '') {
          res.status(401).json({message: 'Тикер не найден!'});
        }
        if (classcode === '') {
          res.status(401).json({message: 'Код режима торгов не найден!'});
        }
      } else {
        const response = await sdkGetBond(ticker, classcode, ttoken);
        res.status(200).json(response);
      }
    })
  } catch (error) {
    res.status(500).json({message: 'Внутренняя ошибка сервера!'});
  }
});

app.post('/getbondevents', async (req: Request, res: Response) => {
  try {
    proceedWithToken(req, res, async (req: Request, res: Response, user: TUser | null) => {
      const { from, to, instrumentId, type, ttoken } = req.body;

      if (ttoken === '' || from === '' || to === '' || instrumentId === '' || type === '') {
        if (ttoken === '') {
          res.status(401).json({message: 'Токен доступа не найден!'});
        }
        if (from === '') {
          res.status(401).json({message: 'Дата начала не найдена!'});
        }
        if (to === '') {
          res.status(401).json({message: 'Дата окончания не найдена!'});
        }
        if (instrumentId === '') {
          res.status(401).json({message: 'Uid инструмента не найден!'});
        }
        if (type === '') {
          res.status(401).json({message: 'Тип запроса не найден!'});
        }

      } else {
        const response = await sdkGetEvents(from, to, instrumentId, type, ttoken);
        res.status(200).json(response);
      }
    })
  } catch (error) {
    res.status(500).json({message: 'Внутренняя ошибка сервера!'});
  }
});