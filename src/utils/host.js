const { isDev } = require('./env')

const HOST = isDev ? "http://localhost" : "http://49.233.185.168"

module.exports = HOST