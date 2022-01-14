const { Word } = require('../models/index')
const Op = require('sequelize').Op

const YOUDAO_URL = 'https://openapi.youdao.com/api'

class WordCtl {

  // 单词列表
  async list(ctx) {
    ctx.verifyParams({
      noteId: { type: 'string', required: true },
    })
    const { noteId } = ctx.params
    console.log(noteId);
    const words = await Word.findAll({
      where: {
        noteId
      }
    })
    ctx.body = words
  }

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
    await Word.create({
      word,
      chineseMeaning,
      userId,
      noteId
    })
    ctx.status = 201
  }

  // 检查此单词本单词是否存在
  async checkWordExist(ctx) {
    ctx.verifyParams({
      noteId: { type: 'string', required: true },
      word: { type: 'string', required: true },
    })
    const { noteId, word } = ctx.params
    const existWord = await Word.findOne({
      where: {
        [Op.and]: [
          { word }, { noteId }
        ]
      }
    })
    if (existWord) {
      ctx.throw(409, '此单词已存在')
    } else ctx.status = 200
  }

  // 获取有道词典对单词的翻译
  async youdao(ctx) {
    ctx.verifyParams({
      word: { type: 'string', required: true }
    })
    // 文档地址 https://ai.youdao.com/DOCSIRMA/html/%E8%87%AA%E7%84%B6%E8%AF%AD%E8%A8%80%E7%BF%BB%E8%AF%91/API%E6%96%87%E6%A1%A3/%E6%96%87%E6%9C%AC%E7%BF%BB%E8%AF%91%E6%9C%8D%E5%8A%A1/%E6%96%87%E6%9C%AC%E7%BF%BB%E8%AF%91%E6%9C%8D%E5%8A%A1-API%E6%96%87%E6%A1%A3.html#section-9
    // YOUDAO_URL
  }
}

module.exports = new WordCtl()


