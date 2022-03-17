const Router = require('koa-router')
const jwt = require('koa-jwt')
const { yearAllActive } = require('../controllers/active')
const { _JWT_KEY_ } = require('../conf/secretKeys')

const router = new Router({ prefix: '/active' })

const auth = jwt({ secret: _JWT_KEY_ })

router.get('/:year', auth, yearAllActive)

module.exports = router