const Router = require('koa-router')
const jwt = require('koa-jwt')
const { list, add } = require('../controllers/notes')
const { _JWT_KEY_ } = require('../conf/secretKeys')

const router = new Router({prefix:'/note'})

const auth = jwt({ secret: _JWT_KEY_ })

router.get('/', auth, list)

router.post('/', auth, add)

module.exports = router