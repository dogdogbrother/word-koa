const { Word, User } = require('../models/index')
const Op = require('sequelize').Op

class WordCtl {

  // 新增单词
  async add(ctx) {
    ctx.verifyParams({
      word: { type: 'string', required: true },
      chineseMeaning: { type: 'string', required: true },
      noteId: { type: 'string', required: true }
    })
    const { id: userId } = ctx.state.user
    const { word, chineseMeaning, noteId } = ctx.request.body
    const repetitionWord = await Word.findOne({
      where: {
        [Op.and]: [
          { word }, { noteId }
        ]
      }
    })
    if (repetitionWord) {
      return ctx.throw(409, '此单词本下已录入此单词')
    }
    console.log({
      word,
      chineseMeaning,
      userId,
      noteId
    });
    await Word.create({
      word,
      chineseMeaning,
      userId,
      noteId
    })
    ctx.status = 201
  }
}

module.exports = new WordCtl()
