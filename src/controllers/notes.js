const { Note, User } = require('../models/index')

class NotesCtl {
  // 单词本列表
  async list(ctx) {
    const notes = await Note.findAll({
      include: [{ model: User }]
    })
    ctx.body = notes
  }

  // 新建单词本
  async add(ctx) {
    ctx.verifyParams({
      noteName: { type: 'string', required: true },
      noteSummary: { type: 'string', required: true },
    })
    const { id: userId } = ctx.state.user
    const { noteName, noteSummary } = ctx.request.body
    const repetitionNote = await Note.findOne({
      where: {
        noteName
      }
    })
    if (repetitionNote) {
      return ctx.throw(409, '用户名已占用')
    }
    await Note.create({
      noteName,
      noteSummary,
      userId
    })
    ctx.body = 201
  }
}

module.exports = new NotesCtl()
