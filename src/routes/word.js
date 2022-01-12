const Router = require('koa-router')
const jwt = require('koa-jwt')
const { add } = require('../controllers/words')
const { _JWT_KEY_ } = require('../conf/secretKeys')

const router = new Router({prefix:'/word'})

const auth = jwt({ secret: _JWT_KEY_ })

router.post('/', auth, add)

module.exports = router