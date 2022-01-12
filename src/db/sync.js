const seq = require('./seq')
require('../models/index')
// 测试连接
seq.authenticate().then(() => {
  console.log('auth ok')
}).catch(() => {
  console.log('auth err')
})

/**
 * @description 执行同步
 * @param Object alter 会尽量的去修正表的内容,force 会强制重置表内容
 */
seq.sync({ force: true }).then(() => {
  console.log('sync ok')
  process.exit()
})
