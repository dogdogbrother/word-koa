const seq = require('../db/seq')
const { ENUM, INTEGER, STRING } = require('../db/types')

const WordPlan = seq.define('wordPlan', {
  userId: {
    type: INTEGER,
    allowNull: false,
    comment: '关联的上传用户id'
  },
  plan: {
    type: ENUM("0", "1", "2", "3", "4", "5", "6"),
    allowNull: false,
    comment: '对单词的熟练程度'
  },
  // 用户背的单词,因为不同的单词本下,会有多个不同的单词.没必要重复学习
  keyWord: {
    type: STRING,
    allowNull: false,
    comment: '字段为word表中的keyWord'
  }
})

module.exports = WordPlan