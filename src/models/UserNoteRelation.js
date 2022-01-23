const seq = require('../db/seq')
const { INTEGER } = require('../db/types')

/**
 * @description 用于记录 用户和单词本的使用关系,一个用户只能选择一个单词本
 */
const UserNoteRelation = seq.define('userNoteRelation', {
  userId: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,  // 为了使用 upsert api,只好设置了用户id为主键
    comment: '关联的上传用户id'
  },
  noteId: {
    type: INTEGER,
    allowNull: false,
    comment: '关联的单词本id'
  }
})

module.exports = UserNoteRelation