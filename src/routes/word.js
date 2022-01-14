const Router = require('koa-router')
const jwt = require('koa-jwt')
const { list, add, checkWordExist, youdao } = require('../controllers/words')
const { _JWT_KEY_ } = require('../conf/secretKeys')

const router = new Router({prefix:'/word'})

const auth = jwt({ secret: _JWT_KEY_ })

router.get('/:noteId', auth, list)

router.post('/', auth, add)

router.get('/:noteId/:word', checkWordExist)

router.get('/youdao/:word', youdao)

module.exports = router