const { isProd } = require('../utils/env')
const { DEV_MYSQL_KEY, PROD_MYSQL_KEY } = require('../conf/secretKeys')
let MYSQL_CONF = {
  user: 'root',
  password: DEV_MYSQL_KEY,
  port: '3306',
  database: 'words'
}

if (isProd) {
  MYSQL_CONF = {
    user: 'root',
    password: PROD_MYSQL_KEY,
    port: '3306',
    database: 'mysql'
  }
}
module.exports = {
  MYSQL_CONF
}