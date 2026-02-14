import { createClient, PostgrestSingleResponse } from '@supabase/supabase-js';
import { Database } from './supabase';

const supabaseUrl: any = process.env.SUPABASE_URL;
const supabaseAnonKey: any = process.env.SUPABASE_ANON_KEY;

const SBase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export default SBase;

export interface TGID {
  created_at: string;
  id: number;
  tgid: string;
  username: string | null;
  tgbro: string | null;
  avatar: string | null;
  firstname?: string | null;
  lastname?: string | null;
  bio?: string | null;
}

export interface TUser {
  created_at: string;
  email: string;
  id: number;
  last_token: string | null;
  password: string;
  username: string;
  tgid: string | null; // id telegram
  human?: () => void;
}

/**
 * Запрос пользователя из БД
 * @param email
 * @returns
 */
export async function requestTUser(email: string) {
  const result: PostgrestSingleResponse<TUser[]> = await SBase
    .from('tusers')
    .select('*') //все строки
    .eq('email', email); //отобрать по email
    //.lt('id', 20); //первые 20 записей
  return result.data;  
}

/**
 * Запрос пользователя из БД по tgid  
 * @param tgid
 * @returns
 */
export async function requestTUserByTGId(tgid: string) {
  const result: PostgrestSingleResponse<TUser[]> = await SBase
    .from('tusers')
    .select('*') //все строки
    .eq('tgid', tgid); //отобрать по email
    //.lt('id', 20); //первые 20 записей
  return result.data;  
}

console.log('=== SUPABASE TESTS (start) ===')
export async function getIds() {
  const result: PostgrestSingleResponse<TGID[]> = await SBase
    .from('ids')
    .select()
    .lt('id', 20); //первые 20 записей

  console.log('%cids: %o', `color: firebrick; background-color: white`, result.data);
  return result.data;
}

// запрос по идентификатору пользователя Telegram
export async function getRow(tgid: string) {
  console.log('%ctgid: %o', `color: firebrick; background-color: white`, tgid);
  const result: PostgrestSingleResponse<TGID[]> = await SBase
    .from('ids')
    .select('*')
    .eq('tgid', tgid);
  return result.data;
}

export async function getTUsers(count?: number) {
  const result: PostgrestSingleResponse<TUser[]> = count ? 
    await SBase.from('tusers').select('*').lt('id', count + 1).order('id', { ascending: true }) :
    await SBase.from('tusers').select('*').order('id', { ascending: true });
  
  /*
  const result: PostgrestSingleResponse<TUser[]> = await SBase
    .from('tusers')
    .select('*')
    .lt('id', 20); //первые 20 записей
  */
  // const { data, error } = await SBase
  // return {data, error};
  
  return result;
}

//const users = getTUsers(4).then(response => console.log('%ctusers: %o', `color: firebrick; background-color: white`, response.data));
 
export async function checkEmail(email: string) {
  let { data, error } = await SBase
    .from('tusers')
    .select("*")
    .eq('email', email);
      
  if (error) {
    console.log('error: ', error);
    return error;
  }

  if (data?.length !== 0) {
    return true;
  } else {
    return false;
  }
}

//const checked = checkEmail('ll@me.com').then(data => console.log('checked: ', data));

export async function upsertTUser(
  username: string,
  email: string,
  password: string,
  token?: string,
  tgid?: string
) {
  const user = {
    email,
    password,
    username,
    last_token: token,
    tgid
  }
  
  const { data, error } = await SBase
    .from('tusers')
    .upsert(user)
    .eq('email', email)
    .select();

  console.log('%cdata: %o', `color: firebrick; background-color: white`, data);
  console.log('%cerror: %o', `color: firebrick; background-color: white`, error);

  return { data, error };
}

async function fillTUsers() {
  const users = [
    {
      //id: 1,
      username: 'LL',
      email: 'll@me.com',
      password: '7777'
    },
    {
      //id: 2,
      username: 'Maria Doe',
      email: 'maria@example.com',
      password: 'maria123'
    },
    {
      //id: 3,
      username: 'Juan Doe',
      email: 'juan@example.com',
      password: 'juan123'
    }
  ];

  users.forEach(async (user) => {
    const { data, error } = await upsertTUser(user.username, user.email, user.password);
    if (error) {
      console.error('Ошибка:', error.message);
    } else {
      console.log('Данные успешно сохранены:', data);
    }
  });
}

//fillTUsers();
export async function testSBase() {
  const users = await requestTUser('ll@me.com');
  console.log('tusers: ', users);

  const user = users?.find(user => user.id === 1);
  console.log('user: ', user);
}

//testSBase();
console.log('=== SUPABASE TESTS (end) ===')

export async function insertTUser(
  username: string,
  email: string,
  password?: string,
  token?: string,
  tgid?: string | null
) {
  const { data, error } = await SBase
    .from('tusers')
    .insert([
      { username: username, email: email, password: password || '', last_token: token, tgid },
    ])
    .select();

  return { data, error };
}

//insertTUser('YY','YY@ever.com','223322').then(data => console.log(data));

export async function allTUser() {
  const { data: tusers, error } = await SBase
  .from('tusers')
  .select('*');

  return { tusers, error };
}

/*
Columns

Name        Format                    Type    Description
---         ------                    ----    -----------
id          bigint                    number  
created_at	timestamp with time zone  string	
email	      text                      string	
username	  text                      string	
password	  text                      string	
last_token	text                      string
tgid	      text                      string
*/


/*
Read rows (чтение строк)
------------------------
To read rows in this table, use the select method.


Read all rows (чтение всех строк)

```javascript
let { data: tusers, error } = await supabase
  .from('tusers')
  .select('*')
```

```bash
curl 'https://iuphyivpecgbyturcskh.supabase.co/rest/v1/tusers?select=*' \
-H "apikey: SUPABASE_CLIENT_ANON_KEY" \
-H "Authorization: Bearer SUPABASE_CLIENT_ANON_KEY"
```
*/

export async function selectTUser(select: string = '*') {
  'created_at,email,id,last_token,password,username,tgid';
  const { data: tusers, error } = await SBase
  .from('tusers')
  .select(select);

  return { tusers, error };
}

/*
Read specific columns (чтение конкретных колонок)

```javascript
let { data: tusers, error } = await supabase
  .from('tusers')
  .select('some_column,other_column')
```

```bash
curl 'https://iuphyivpecgbyturcskh.supabase.co/rest/v1/tusers?select=some_column,other_column' \
-H "apikey: SUPABASE_CLIENT_ANON_KEY" \
-H "Authorization: Bearer SUPABASE_CLIENT_ANON_KEY"
```
*/

/*
Read referenced tables (чтение связанных таблиц)

```javascript
let { data: tusers, error } = await supabase
  .from('tusers')
  .select(`
    some_column,
    other_table (
      foreign_key
    )
  `)
```

```bash
curl 'https://iuphyivpecgbyturcskh.supabase.co/rest/v1/tusers?select=some_column,other_table(foreign_key)' \
-H "apikey: SUPABASE_CLIENT_ANON_KEY" \
-H "Authorization: Bearer SUPABASE_CLIENT_ANON_KEY"
```
*/

/*
With pagination (с пагинацией)

```javascript
let { data: tusers, error } = await supabase
  .from('tusers')
  .select('*')
  .range(0, 9)
```

```bash
curl 'https://iuphyivpecgbyturcskh.supabase.co/rest/v1/tusers?select=*' \
-H "apikey: SUPABASE_CLIENT_ANON_KEY" \
-H "Authorization: Bearer SUPABASE_CLIENT_ANON_KEY" \
-H "Range: 0-9"
```
*/

/*
Filtering (фильтрация)
----------------------
Supabase provides a wide range of filters


With filtering (с фильтрами)

```javascript
let { data: tusers, error } = await supabase
  .from('tusers')
  .select("*")

  // Filters
  .eq('column', 'Equal to')
  .gt('column', 'Greater than')
  .lt('column', 'Less than')
  .gte('column', 'Greater than or equal to')
  .lte('column', 'Less than or equal to')
  .like('column', '%CaseSensitive%')
  .ilike('column', '%CaseInsensitive%')
  .is('column', null)
  .in('column', ['Array', 'Values'])
  .neq('column', 'Not equal to')

  // Arrays
  .contains('array_column', ['array', 'contains'])
  .containedBy('array_column', ['contained', 'by'])

  // Logical operators
  .not('column', 'like', 'Negate filter')
  .or('some_column.eq.Some value, other_column.eq.Other value')

```

```bash
curl --get 'https://iuphyivpecgbyturcskh.supabase.co/rest/v1/tusers' \
-H "apikey: SUPABASE_CLIENT_ANON_KEY" \
-H "Authorization: Bearer SUPABASE_CLIENT_ANON_KEY" \
-H "Range: 0-9" \
-d "select=*" \
\
`# Filters` \
-d "column=eq.Equal+to" \
-d "column=gt.Greater+than" \
-d "column=lt.Less+than" \
-d "column=gte.Greater+than+or+equal+to" \
-d "column=lte.Less+than+or+equal+to" \
-d "column=like.*CaseSensitive*" \
-d "column=ilike.*CaseInsensitive*" \
-d "column=is.null" \
-d "column=in.(Array,Values)" \
-d "column=neq.Not+equal+to" \
\
`# Arrays` \
-d "array_column=cs.{array,contains}" \
-d "array_column=cd.{contained,by}" \
\
`# Logical operators` \
-d "column=not.like.Negate+filter" \
-d "or=(some_column.eq.Some+value,other_column.eq.Other+value)"
```
*/

/*
Insert rows (вставка строк)
---------------------------
insert lets you insert into your tables. You can also insert in bulk and do UPSERT.

insert will also return the replaced values for UPSERT.


Insert a row (вставка строки)

```javascript
const { data, error } = await supabase
  .from('tusers')
  .insert([
    { some_column: 'someValue', other_column: 'otherValue' },
  ])
  .select()
```

```bash
curl -X POST 'https://iuphyivpecgbyturcskh.supabase.co/rest/v1/tusers' \
-H "apikey: SUPABASE_CLIENT_ANON_KEY" \
-H "Authorization: Bearer SUPABASE_CLIENT_ANON_KEY" \
-H "Content-Type: application/json" \
-H "Prefer: return=minimal" \
-d '{ "some_column": "someValue", "other_column": "otherValue" }'
```
*/

/*
Insert many rows (вставка нескольких строк)

```javascript
const { data, error } = await supabase
  .from('tusers')
  .insert([
    { some_column: 'someValue' },
    { some_column: 'otherValue' },
  ])
  .select()
```

```bash
curl -X POST 'https://iuphyivpecgbyturcskh.supabase.co/rest/v1/tusers' \
-H "apikey: SUPABASE_CLIENT_ANON_KEY" \
-H "Authorization: Bearer SUPABASE_CLIENT_ANON_KEY" \
-H "Content-Type: application/json" \
-d '[{ "some_column": "someValue" }, { "other_column": "otherValue" }]'
```
*/

/*
Upsert matching rows (обновление существующих строк)

```javascript
const { data, error } = await supabase
  .from('tusers')
  .upsert({ some_column: 'someValue' })
  .select()
```

```bash
curl -X POST 'https://iuphyivpecgbyturcskh.supabase.co/rest/v1/tusers' \
-H "apikey: SUPABASE_CLIENT_ANON_KEY" \
-H "Authorization: Bearer SUPABASE_CLIENT_ANON_KEY" \
-H "Content-Type: application/json" \
-H "Prefer: resolution=merge-duplicates" \
-d '{ "some_column": "someValue", "other_column": "otherValue" }'
```
*/


export async function updateTUser(
  id: number,
  created_at: string,
  name: string,
  email: string,
  password: string,
  token?: string,
  tgid?: string
) {
  const user: TUser = {
    id: id,
    created_at: created_at,
    username: name,
    email: email,
    password: password,
    last_token: token || '',
    tgid: tgid || ''
  }
  const { data, error } = await SBase
    .from('tusers')
    .update(user)
    .eq('email', user.email)
    .select();

  return { data, error };
}

/*
Update rows (обновление строк)
------------------------------
update lets you update rows. update will match all rows by default. You can update specific rows using horizontal filters, e.g. eq, lt, and is.

update will also return the replaced values for UPDATE.


Update matching rows (обновление строк по фильтру)

```javascript
const { data, error } = await supabase
  .from('tusers')
  .update({ other_column: 'otherValue' })
  .eq('some_column', 'someValue')
  .select()
```

```bash
curl -X PATCH 'https://iuphyivpecgbyturcskh.supabase.co/rest/v1/tusers?some_column=eq.someValue' \
-H "apikey: SUPABASE_CLIENT_ANON_KEY" \
-H "Authorization: Bearer SUPABASE_CLIENT_ANON_KEY" \
-H "Content-Type: application/json" \
-H "Prefer: return=minimal" \
-d '{ "other_column": "otherValue" }'
```
*/

/*
Delete rows (удаление строк)
----------------------------
delete lets you delete rows. delete will match all rows by default, so remember to specify your filters!


Delete matching rows (удаление строк по фильтру)

```javascript
const { error } = await supabase
  .from('tusers')
  .delete()
  .eq('some_column', 'someValue')
```

```bash
curl -X DELETE 'https://iuphyivpecgbyturcskh.supabase.co/rest/v1/tusers?some_column=eq.someValue' \
-H "apikey: SUPABASE_CLIENT_ANON_KEY" \
-H "Authorization: Bearer SUPABASE_CLIENT_ANON_KEY"
```
*/

/*
Subscribe to changes (подписка на изменения)
-------------------
Supabase provides realtime functionality and broadcasts database changes to authorized users depending on Row Level Security (RLS) policies.


Subscribe to all events (подписка на все события)

```javascript
const channels = supabase.channel('custom-all-channel')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'tusers' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()
```


Subscribe to inserts (подписка на вставки)

```javascript

const channels = supabase.channel('custom-insert-channel')
  .on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'tusers' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()
```


Subscribe to updates (подписка на обновления)

```javascript
const channels = supabase.channel('custom-update-channel')
  .on(
    'postgres_changes',
    { event: 'UPDATE', schema: 'public', table: 'tusers' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()
```


Subscribe to deletes (подписка на удаления)

```javascript
const channels = supabase.channel('custom-delete-channel')
  .on(
    'postgres_changes',
    { event: 'DELETE', schema: 'public', table: 'tusers' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()
```


Subscribe to specific rows

```javascript
const channels = supabase.channel('custom-filter-channel')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'tusers', filter: 'some_column=eq.some_value' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()
```

Javascript Client Library
https://supabase.com/docs/reference/javascript/select

*/

/*
заполняем таблицу пользователей

const { data, error } = await supabase
  .from('your_table')
  .upsert({
    id: 'unique-id', // Уникальный ключ (например, UUID)
    name: 'John Doe',
    email: 'john@example.com'
  }, {
    onConflict: 'id' // Указание столбца для конфликта
  });

if (error) {
  console.error('Ошибка:', error.message);
} else {
  console.log('Данные успешно сохранены:', data);
}
*/

