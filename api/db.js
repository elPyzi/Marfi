const { Client } = require('pg');
const {name_database,password} = require('./config')
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: name_database,
  password: password,
  port: '5432',
});

async function connect() {
  try {
    await client.connect();
    console.log('Подключение к PostgreSQL');
  } catch (err) {
    console.error('Ошибка подключения: ', err);
  }
}

async function query(sql) {
  try {
    const result = await client.query(sql);
    return result.rows;
  } catch (err) {
    console.error('Ошибка выполнения запроса: ', err);
    throw err;
  }
}

module.exports = { connect, query };
