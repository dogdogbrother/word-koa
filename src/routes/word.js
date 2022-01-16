const Router = require('koa-router')
const jwt = require('koa-jwt')
const { list, add, checkWordExist, youdao } = require('../controllers/words')
const { _JWT_KEY_ } = require('../conf/secretKeys')

const router = new Router({prefix:'/word'})

const auth = jwt({ secret: _JWT_KEY_ })

router.get('/list/:noteId', auth, list)

router.post('/add', auth, add)

router.get('/:noteId/:word', auth, checkWordExist)

router.post('/youdao', auth, youdao)

module.exports = router