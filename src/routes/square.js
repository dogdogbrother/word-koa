const Router = require('koa-router')
const { list } = require('../controllers/square')
const router = new Router({prefix:'/square'})

router.get('/', list)

module.exports = router