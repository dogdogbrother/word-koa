const seq = require('../db/seq')
const { STRING } = require('../db/types')

const Note = seq.define('note', {
  userId: {
    type: STRING,
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
})

module.exports = Note