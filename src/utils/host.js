const { isDev } = require('./env')

const HOST = isDev ? "http://localhost:7001" : "http://49.233.185.168:7001"

module.exports = HOST