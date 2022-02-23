const { isDev } = require('./env')

const HOST = isDev ? "http://localhost:7001" : "https://file.freetoplay.top/word"

module.exports = HOST