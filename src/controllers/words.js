const { Word } = require('../models/index')
const Op = require('sequelize').Op
const { v4: uuidv4 } = require('uuid')
const crypto = require('crypto')
const axios = require('axios')
const { YOUDAO_KEY, YOUDAO_SECRET } = require('../conf/secretKeys')

const YOUDAO_URL = 'https://openapi.youdao.com/api'

class WordCtl {

  // 单词列表
  async list(ctx) {
    ctx.verifyParams({
      noteId: { type: 'string', required: true },
    })
    const { noteId } = ctx.params
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

    const { word } = ctx.request.body

    const salt = uuidv4()
    const curtime = Math.round(new Date().getTime() / 1000)
    const str = YOUDAO_KEY + word + salt + curtime + YOUDAO_SECRET
    const hash = crypto.createHash('sha256').update(str)
    const sign = hash.digest('hex')
    
    const res = await axios({
      method: 'POST',
      url: YOUDAO_URL,
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      params: {
        q: word,
        from: 'en',
        to: 'zh-CHS',
        appKey: YOUDAO_KEY,
        salt,
        sign,
        signType: 'v3',
        curtime,
      }
    }).then(res => res.data)
    // 发音地址,确定下过期时间,再设计表
    // https://openapi.youdao.com/ttsapi?q=my+name+is&langType=en&sign=4B1F13245E4FE18979122B64D5263BFF&salt=1642232174197&voice=4&format=mp3&appKey=32c6f51ea1dd8a73&ttsVoiceStrict=false
    ctx.body = res
  }
}

module.exports = new WordCtl()


