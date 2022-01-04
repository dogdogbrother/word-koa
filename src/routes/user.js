const Router = require('koa-router')
const { register } = require('../controllers/users')

const router = new Router({prefix:'/user'})

router.post('/register', register)

module.exports = router