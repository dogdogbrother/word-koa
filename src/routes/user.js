const Router = require('koa-router')
const jwt = require('koa-jwt')
const { register, login, info } = require('../controllers/users')
const { _JWT_KEY_ } = require('../conf/secretKeys')

const router = new Router({prefix:'/user'})

const auth = jwt({ secret: _JWT_KEY_ })

router.post('/register', register)

router.post('/login', login)

router.get('/info', auth, info)

module.exports = router