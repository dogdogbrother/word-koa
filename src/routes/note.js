const Router = require('koa-router')
const jwt = require('koa-jwt')
const { list, info, add, useNote, getUseNote } = require('../controllers/notes')
const { _JWT_KEY_ } = require('../conf/secretKeys')

const router = new Router({prefix:'/note'})

const auth = jwt({ secret: _JWT_KEY_ })

router.get('/', auth, list)

router.get('/:noteId', auth, info)

router.post('/', auth, add)

router.put('/useNote/:noteId', auth, useNote)

router.get('/useNote', auth, getUseNote)

module.exports = router