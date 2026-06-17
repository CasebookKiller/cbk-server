
// index.ts

import cors from 'cors';
import { exec } from 'child_process';

import express, { Express, Request, Response } from 'express';

import jwt from 'jsonwebtoken';
import { Credentials, extractBase64, generateToken, jwtPrivateKey, PORT, User, verifyToken } from './common/common';
import SBase, { getRow, insertTUser, requestTUser, requestTUserByTGId, TGID, TUser, updateTUser, upsertTUser } from './supabaseClient';

import * as omar from "./data/omar.json";
import { formDataToJson, getUserProfilePhotos } from './api/bot/methods';

import { HistoricalDataLoader } from './src/backtest/historicalDataLoader';
import { BacktestQueue } from './src/backtest/backtestQueue';

//import { TinkoffInvestApi } from 'tinkoff-invest-api';
//import { PortfolioRequest_CurrencyRequest, PortfolioResponse } from 'tinkoff-invest-api/cjs/generated/operations';
//import { Account } from 'tinkoff-invest-api/cjs/generated/users';

//import users from './users.json';
import { TOKEN } from './common/common';

// Supabase
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { findTInstrument, getInfo, getPortfolio, sdkGetBond, sdkGetEvents, sdkGetBonds, sdkGetInfo } from './tbank';
import { createSdk } from './api/t-invest-sdk/sdk';

import { ScreenerService } from './src/backtest/screenerService';
import { instrumentsGrpc } from './src/services/tbank/InstrumentsGrpcService'; 
import { MarketPhase, MarketPhaseDetector } from './src/backtest/marketPhaseDetector';
import { VolumeProfileEngine } from './src/backtest/volumeProfileEngine';
import { CandleInterval } from './src/generated/marketdataTypes';

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

function generateParamGrid(
  sl?: [number, number, number],
  tp?: [number, number, number],
  trail?: [number, number, number],
  lots?: [number, number, number],
  risk?: [number, number, number],
  volPeriod?: [number, number, number]
): any[] {
  const grid: any[] = [];
  const slVals = sl ? range(sl[0], sl[1], sl[2]) : [undefined];
  const tpVals = tp ? range(tp[0], tp[1], tp[2]) : [undefined];
  const trailVals = trail ? range(trail[0], trail[1], trail[2]) : [undefined];
  const lotsVals = lots ? range(lots[0], lots[1], lots[2]) : [undefined];
  const riskVals = risk ? range(risk[0], risk[1], risk[2]) : [undefined];
  const volPeriodVals = volPeriod ? range(volPeriod[0], volPeriod[1], volPeriod[2]) : [undefined];

  for (const slv of slVals)
    for (const tpv of tpVals)
      for (const trv of trailVals)
        for (const lv of lotsVals)
          for (const rv of riskVals)
            for (const vp of volPeriodVals) {
              grid.push({
                stopLossPercent: slv,
                takeProfitPercent: tpv,
                trailingDistancePercent: trv,
                lots: lv,
                riskPercent: rv,
                volumeFilterEnabled: volPeriod !== undefined, // если перебираем период, значит фильтр включён
                volumeFilterPeriod: vp,
              });
            }
  return grid;
}

function range(min: number, max: number, step: number): number[] {
  if (!step || step <= 0) return [min];
  const arr = [];
  for (let v = min; v <= max + 0.0001; v += step) arr.push(Math.round(v * 100) / 100);
  return arr;
}


const app: Express = express();
app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Запущен сервер на Typescript...')
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
    // @ts-ignore
    return user.email === email && user.password === password || user.email === email && user.tgid === tgid;
  });

  if (!user) {
    return res.status(404).json({message: 'Пользователь не создан!' });
  }

  const result = {
    // @ts-ignore
    id: user.id,
    // @ts-ignore
    created_at: user.created_at,
    // @ts-ignore
    name: user.username,
    // @ts-ignore
    email: user.email,
    // @ts-ignore
    token: user.last_token,
    // @ts-ignore
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
  res.send('cbk-server');
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
  console.log('---Request: ', req);
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

const loader = new HistoricalDataLoader();
const backtestQueue = new BacktestQueue(loader);

app.post('/api/backtest/tasks', verifyToken, async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { instrumentUid, dateFrom, dateTo, interval, strategy, params } = req.body;
  console.log('Received task:', { instrumentUid, dateFrom, dateTo, strategy });
  const token = process.env.TReadOnly || '';
  const taskId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  backtestQueue.addTask({
    taskId,
    userId: user.id,
    instrumentUid,
    dateFrom,
    dateTo,
    interval,
    strategy,         // ← важно!
    params,
    status: 'pending'
  });

  res.status(202).json({ taskId, status: 'pending' });
});

app.get('/api/backtest/tasks', verifyToken, (req: Request, res: Response) => {
  const user = (req as any).user;
  const allTasks = backtestQueue.getAllTasks();
  // фильтруем по userId, если он есть
  const userTasks = allTasks.filter(t => !t.userId || t.userId === user.id);
  res.json(userTasks.map(t => ({
    taskId: t.taskId,
    instrumentUid: t.instrumentUid,
    dateFrom: t.dateFrom,
    dateTo: t.dateTo,
    status: t.status,
    error: t.error,
  })));
});

app.get('/api/backtest/tasks/:taskId', verifyToken, async (req: Request, res: Response) => {
  const taskId = req.params.taskId as string;
  console.log(`[DEBUG] GET /api/backtest/tasks/${taskId}`);
  try {
    const { data, error } = await (SBase.from('backtest_tasks') as any).select('*').eq('task_id', taskId).single();
    if (error) {
      console.error('[Supabase error]', error);
      return res.status(500).json({ error: 'Database error' });
    }
    if (!data) return res.status(404).json({ error: 'Task not found' });
    res.json({ taskId: data.task_id, status: data.status, error: data.error });
  } catch (err: any) {
    console.error('[Exception in tasks/:taskId]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/backtest/results/:taskId', verifyToken, (req: Request, res: Response) => {
  const taskId = req.params.taskId as string;
  const task = backtestQueue.getTask(taskId);
  if (!task || task.status !== 'completed') return res.status(404).json({ error: 'Result not available' });
  res.json(task.result);
});

// ---- Облачный фермер ----

// POST /api/backtest/batch – создаёт batch-прогон
app.post('/api/backtest/batch', verifyToken, async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { 
    instruments, dateFrom, dateTo, interval, strategy, params,
    // поля сетки
    slMin, slMax, slStep,
    tpMin, tpMax, tpStep,
    trailMin, trailMax, trailStep,
    lotsMin, lotsMax, lotsStep,
    riskMin, riskMax, riskStep,
    volPeriodMin, volPeriodMax, volPeriodStep
  } = req.body;

  if (!instruments || !Array.isArray(instruments) || instruments.length === 0) {
    return res.status(400).json({ error: 'instruments array is required' });
  }

  const batchId = `batch_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;

  // Сохраняем batch в Supabase
  await (SBase.from('backtest_batches') as any).insert({
    id: batchId,
    user_id: user.id,
    params: { instruments, dateFrom, dateTo, interval, strategy, params },
    status: 'pending'
  });

  // Создаём задачи для каждого инструмента
  // Если задана сетка – генерируем комбинации, иначе используем одну комбинацию из params
  const useGrid = slMin !== undefined; // или явный флаг, можно добавить от клиента
  let combos: any[];
  if (useGrid) {
    combos = generateParamGrid(
      slMin !== undefined ? [slMin, slMax, slStep] : undefined,
      tpMin !== undefined ? [tpMin, tpMax, tpStep] : undefined,
      trailMin !== undefined ? [trailMin, trailMax, trailStep] : undefined,
      lotsMin !== undefined ? [lotsMin, lotsMax, lotsStep] : undefined,
      riskMin !== undefined ? [riskMin, riskMax, riskStep] : undefined,
      volPeriodMin !== undefined ? [volPeriodMin, volPeriodMax, volPeriodStep] : undefined
    );
  } else {
    combos = [params]; // исходные параметры, уже содержат volumeFilterEnabled/Period
  }

  // Простой детектор фазы по дневным свечам
  const detectDayPhase = (candles: any[], profile: any): string => {
    if (!profile || candles.length < 5) return 'CHOP';
    const insideVA = candles.filter((c: any) => {
      const close = Number(c.close?.units || c.close || 0);
      return close >= profile.valueAreaLow && close <= profile.valueAreaHigh;
    }).length;
    const percentInside = (insideVA / candles.length) * 100;
    const lastCandle = candles[candles.length - 1];
    const high = Number(lastCandle.high?.units || lastCandle.high || 0);
    const low = Number(lastCandle.low?.units || lastCandle.low || 0);
    const avgVolume = candles.reduce((s: number, c: any) => s + Number(c.volume || 0), 0) / candles.length;
    const volumeSpike = Number(lastCandle.volume) > avgVolume * 1.5;

    if (percentInside > 70) return 'BALANCE';
    if (volumeSpike && (high > profile.valueAreaHigh || low < profile.valueAreaLow)) return 'BREAKOUT';
    if (high > profile.valueAreaHigh) return 'TREND_UP';
    if (low < profile.valueAreaLow) return 'TREND_DOWN';
    return 'CHOP';
  };

  const phaseMap = new Map<string, string[]>();
  console.log('[BATCH] Starting phase detection for instruments:', instruments);
  console.log('Phase map:', JSON.stringify([...phaseMap]));
  
  for (const uid of instruments) {
    try {
      const days: string[] = [];
      const current = new Date(dateFrom + 'T00:00:00Z');
      const end = new Date(dateTo + 'T00:00:00Z');

      while (current <= end) {
        const dateStr = current.toISOString().split('T')[0];
        const dayStart = new Date(dateStr + 'T07:00:00Z');
        const dayEnd = new Date(dateStr + 'T16:00:00Z');

        const candles = await loader.loadIntradayCandles(
          uid, dayStart, dayEnd, process.env.TReadOnly || '', CandleInterval.CANDLE_INTERVAL_HOUR
        );
        const eng = new VolumeProfileEngine({ skipAutoSubscribe: true });
        candles.forEach(c => eng.feedCandle(c));
        const profile = eng.getProfile(uid);
        const phase = detectDayPhase(candles, profile);
        console.log(`Phase for ${uid} on ${dateStr}: ${phase}`);
        days.push(phase);
        
        current.setDate(current.getDate() + 1);
      }
      phaseMap.set(uid, days);
      console.log(`[BATCH] Phases for ${uid}: ${days.length} days, sample: ${days.slice(0,3).join(',')}`);
    } catch (e) {
      console.error(`Failed to compute phases for ${uid}:`, e);
      phaseMap.set(uid, []);
    }
  }

  // Создаём задачи для каждого инструмента
  for (const uid of instruments) {
    for (const combo of combos) {
      const taskId = `${batchId}_${uid}_${Date.now()}_${Math.random().toString(36).substr(2,4)}`;
      console.log(`[BATCH] Adding task ${taskId} with marketPhases:`, JSON.stringify(phaseMap.get(uid)));
      backtestQueue.addTask({
        taskId,
        batchId,
        userId: user.id,
        instrumentUid: uid,
        dateFrom,
        dateTo,
        interval,
        strategy,
        params: { ...params, ...combo },
        marketPhases: phaseMap.get(uid),   // ← добавляем фазу
        status: 'pending'
      });
    }
  }

  // Обновим статус batch'а на running
  await (SBase.from('backtest_batches') as any).update({ status: 'running' }).eq('id', batchId);

  const totalTasks = instruments.length * combos.length;
  res.status(202).json({ batchId, status: 'running', tasks: totalTasks });
});

// GET /api/backtest/batch/:batchId – статус batch'а и список задач
app.get('/api/backtest/batch/:batchId', verifyToken, async (req: Request, res: Response) => {
  const batchId = req.params.batchId as string;
  // @ts-ignore
  const { data: batch } = await SBase.from('backtest_batches').select('*').eq('id', batchId).single();
  if (!batch) return res.status(404).json({ error: 'Batch not found' });
  // @ts-ignore
  const { data: tasks } = await SBase.from('backtest_tasks').select('*').eq('batch_id', batchId);
  res.json({ batch, tasks });
});

// GET /api/backtest/batch/:batchId/results – агрегированные результаты
app.get('/api/backtest/batch/:batchId/results', verifyToken, async (req: Request, res: Response) => {
  const batchId = req.params.batchId as string;
  const { data: tasks } = await (SBase.from('backtest_tasks') as any).select('*').eq('batch_id', batchId);
  const { data: batch } = await (SBase.from('backtest_batches') as any).select('*').eq('id', batchId).single();

  if (!tasks) return res.status(404).json({ error: 'No tasks found' });

  const commonParams: any = (batch as any)?.params || {};

  const results = tasks.map((t: any) => {
    const stats = t.result?.portfolio || t.result || {};
    // Распределение фаз
    const phases: string[] = t.market_phases || [];
    const distribution: Record<string, number> = {};
    phases.forEach((p: string) => { distribution[p] = (distribution[p] || 0) + 1; });

    return {
      taskId: t.id,
      instrumentUid: t.instrument_uid,
      status: t.status,
      totalProfit: stats.totalProfit,
      totalTrades: stats.totalTrades,
      winRate: stats.winRate,
      maxDrawdown: stats.maxDrawdown,
      error: t.error,
      phaseDistribution: distribution,
      dateFrom: commonParams.dateFrom,
      dateTo: commonParams.dateTo,
      strategy: commonParams.strategy,
      stopLoss: commonParams.params?.stopLossPercent,
      takeProfit: commonParams.params?.takeProfitPercent,
      trailing: commonParams.params?.trailingDistancePercent,
      positionSizing: commonParams.params?.positionSizing,
      lots: commonParams.params?.lots,
      riskPercent: commonParams.params?.riskPercent,
    };
  });

  res.json({ results });
});

// GET /api/backtest/batches – список batch'ов
app.get('/api/backtest/batches', verifyToken, async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { data, error } = await SBase
    .from('backtest_batches')
    .select('*')
    // @ts-ignore
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

app.get('/api/screener', verifyToken, async (req: Request, res: Response) => {
  const token = process.env.TReadOnly || '';
  const { minVolume, maxVA, minPOC } = req.query;
  const filters = {
    minDailyVolume: Number(minVolume) || undefined,
    maxVaWidthPercent: Number(maxVA) || undefined,
    minPocStrength: Number(minPOC) || undefined,
  };

  try {
    const sharesResp = await instrumentsGrpc.shares({ instrumentStatus: 1 }, token);
    const instruments = (sharesResp.instruments || [])
      .filter((i: any) => i.apiTradeAvailableFlag && i.currency?.toLowerCase() === 'rub')
      .map((i: any) => ({ uid: i.uid, ticker: i.ticker, name: i.name }));

    const loader = new HistoricalDataLoader();
    const screener = new ScreenerService(loader, token);
    const results = await screener.screen(filters, instruments);
    res.json(results);
  } catch (err: any) {
    console.error('Screener error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/market-phase', verifyToken, async (req: Request, res: Response) => {
  const instrumentUid = req.query.instrument as string;
  const token = process.env.TReadOnly || '';
  if (!instrumentUid) return res.status(400).json({ error: 'instrument query param required' });

  try {
    const loader = new HistoricalDataLoader();
    const now = new Date();
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
    const candles = await loader.loadIntradayCandles(
      instrumentUid, twoHoursAgo, now, token, CandleInterval.CANDLE_INTERVAL_5_MIN //'CANDLE_INTERVAL_5_MIN'
    );

    const profileEngine = new VolumeProfileEngine({ skipAutoSubscribe: true });
    candles.forEach(c => profileEngine.feedCandle(c));
    const profile = profileEngine.getProfile(instrumentUid);

    if (!profile || candles.length < 5) {
      return res.json({ instrumentUid, phase: 'CHOP' });
    }

    const detector = new MarketPhaseDetector(loader, profileEngine);
    const phase = await detector.detectPhase(instrumentUid, token);
    res.json({ instrumentUid, phase });
  } catch (err: any) {
    console.error('Market phase error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Health-check endpoint для мониторинга
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Сервер прослушивает порт ${PORT}`);

  // Автоматический анализ логов через 3 секунды после старта
  setTimeout(() => {
    exec(
      'node /opt/monitoring-scripts/startup-log-analyzer.js',
      (error, stdout, stderr) => {
        if (error) {
          console.error('Log analyzer error:', stderr || error.message);
        } else {
          console.log('Log analyzer:', stdout);
        }
      }
    );
  }, 3000);
});