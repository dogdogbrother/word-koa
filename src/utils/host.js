const { isDev } = require('./env')

const HOST = isDev ? "http://localhost:7009" : "https:run-api.freetoplay.top"

module.exports = HOST