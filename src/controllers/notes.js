const { Note, User, Square, UserNoteRelation } = require('../models/index')
const Sequelize = require('sequelize')
const HOST = require('../utils/host')

class NotesCtl {
  // 单词本列表
  async list(ctx) {
    const { userId } = ctx.request.query
    const where = {}
    if (userId) where.userId = userId

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
      ],
      where
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
    const noteCover = Math.floor(Math.random() * coverLength)

    const { id } = await Note.create({
      noteName,
      noteSummary,
      userId,
      noteCover: `${HOST}/noteCard/${noteCover}.jpg`
    })
    ctx.status = 201
    // 加入广场动态
    Square.create({
      type: '2',
      noteId: id,
      userId
    })
  }

  // 使用单词本
  async useNote(ctx) {
    const { id: userId } = ctx.state.user
    const { noteId } = ctx.params

    await UserNoteRelation.upsert({
      userId,
      noteId
    })
    ctx.status = 201
  }

  // 获取当前用户使用的单词本
  async getUseNote(ctx) {
    const { id: userId } = ctx.state.user
    const useNote = await UserNoteRelation.findByPk(userId, {
      attributes: [],
      include: [
        { 
          model: Note,  
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
            ],
          },
          include: [
            {
              model: User,
            }
          ]
        },
      ]
    })
    // 有内容就把node给了
    ctx.body = useNote ? useNote.dataValues.note : null
  }
}

module.exports = new NotesCtl()
