const seq = require('../db/seq')
const { INTEGER, STRING } = require('../db/types')

// 用户的活跃度统计,用户输入新词加(4),背单词也加(1)
const Active = seq.define('active', {
  userId: {
    type: INTEGER,
    allowNull: false,
    comment: '关联的活跃用户id'
  },
  active: {
    type: INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: '用户活跃度'
  },
  createdTime: {
    type: STRING,
    allowNull: false,
    comment: '单词创建时间,虽然默认有createdAt,但是好像不能作为查询条件'
  }
})

module.exports = Active