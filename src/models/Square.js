const seq = require('../db/seq')
const { ENUM, INTEGER } = require('../db/types')

const Square = seq.define('square', {
  type: {
    type: ENUM('1', '2', '3', '4'), 
    allowNull: false,
    comment: '广场消息的类型,1为注册用户,2为创建单词本,'
  },
  userId: {
    type: INTEGER,
    allowNull: false,
    comment: '消息用户'
  },
  noteId: {
    type: INTEGER,
    allowNull: true,
    comment: '如果是创建单词本时,有值'
  }
})

module.exports = Square