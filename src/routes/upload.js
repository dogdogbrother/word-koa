const Router = require('koa-router')
const jwt = require('koa-jwt')
const { wordImg } = require('../controllers/upload')
const { _JWT_KEY_ } = require('../conf/secretKeys')
const koaFrom = require('formidable-upload-koa')

const router = new Router({prefix: '/upload'})

const auth = jwt({ secret: _JWT_KEY_ })

router.post('/illustration', auth, koaFrom({
  uploadDir: __dirname + "/../../assets/word",  // 文件存放的位置
  keepExtensions: true,  // 包含扩展名
  maxFileSize: 1024 * 1024 * 2 // 大小为 2m
}), wordImg)

module.exports = router