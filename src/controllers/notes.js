const { Note, User, Square } = require('../models/index')
const Sequelize = require('sequelize')

class NotesCtl {
  // 单词本列表
  async list(ctx) {
    const notes = await Note.findAll({
      attributes: {
        include: [
          [
            Sequelize.literal(`(
              select count(*)
              from words as word
              where
                word.noteId = note.id
            )`),
            'wordCount'
          ]
        ]
      },
      include: [
        { model: User },
      ]
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
      return ctx.throw(409, '单词本名已被占用')
    }

    const coverLength = 16
    const noteCover = Math.round(Math.random() * coverLength)

    const { id } = await Note.create({
      noteName,
      noteSummary,
      userId,
      noteCover
    })
    ctx.body = 201
    // 加入广场动态
    Square.create({
      type: '2',
      noteId: id
    })
  }
}

module.exports = new NotesCtl()
