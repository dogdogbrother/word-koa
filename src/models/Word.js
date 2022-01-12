const seq = require('../db/seq')
const { STRING, INTEGER } = require('../db/types')

const Word = seq.define('word', {
  userId: {
    type: INTEGER,
    allowNull: false,
    comment: '关联的上传用户id'
  },
  noteId: {
    type: INTEGER,
    allowNull: false,
    comment: '关联的单词本id'
  },
  word: {
    type: STRING,
    allowNull: false,
    unique: true,
    comment: '单词名'
  },
  chineseMeaning: {
    type: STRING,
    allowNull: false,
    comment: '单词中译'
  },
})

module.exports = Word