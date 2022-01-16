const seq = require('../db/seq')
const { STRING, INTEGER } = require('../db/types')

const Note = seq.define('note', {
  userId: {
    type: INTEGER,
    allowNull: false,
    comment: '关联的上传用户id'
  },
  noteName: {
    type: STRING,
    allowNull: false,
    unique: true,
    comment: '单词本名'
  },
  noteSummary: {
    type: STRING,
    allowNull: false,
    comment: '单词本名描述'
  },
  noteCover: {
    type: STRING,
    allowNull: false,
    comment: '单词本封面索引'
  }
})

module.exports = Note