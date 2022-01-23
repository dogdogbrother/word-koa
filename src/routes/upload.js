const Router = require('koa-router')
const jwt = require('koa-jwt')
const { wordImg } = require('../controllers/upload')
const { _JWT_KEY_ } = require('../conf/secretKeys')

const router = new Router({prefix: '/upload'})

const auth = jwt({ secret: _JWT_KEY_ })

router.post('/illustration', auth, wordImg)

module.exports = router