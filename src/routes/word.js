const Router = require('koa-router')
const jwt = require('koa-jwt')
const { 
  list, 
  add, 
  onDelete,
  checkWordExist, 
  youdao, 
  wordPlan, 
  useUsers 
} = require('../controllers/words')
const { _JWT_KEY_ } = require('../conf/secretKeys')

const router = new Router({prefix:'/word'})

const auth = jwt({ secret: _JWT_KEY_ })

router.get('/list/:noteId', auth, list)

router.post('/add', auth, add)

router.delete('/:wordId', auth, onDelete)

router.get('/:noteId/:word', auth, checkWordExist)

router.post('/youdao', auth, youdao)

router.put('/plan', auth, wordPlan)

router.get('/useUser', useUsers)

module.exports = router