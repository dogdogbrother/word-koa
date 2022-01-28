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
    comment: '单词名'
  },
  wordMark: {
    type: STRING,
    allowNull: true,
    comment: '单词笔记'
  },
  keyWord: {
    type: STRING,
    allowNull: false,
    comment: '关联有道翻译API的'
  },
  fileList: {
    type: STRING,
    allowNull: true,
    default: '',
    comment: '上次的图片'
  }
})

module.exports = Word