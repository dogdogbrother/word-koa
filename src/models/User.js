const seq = require('../db/seq')
const { STRING } = require('../db/types')

const User = seq.define('user', {
  id: {
    type: STRING,
    primaryKey: true
  },
  password: {
    type: STRING,
    allowNull: false,
    comment: '密码'
  },
}, {
  defaultScope: {
    attributes: {
      // 排除密码，不返回密码
      exclude: ['password']
    }
  }
})

module.exports = User