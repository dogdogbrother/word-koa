const { Word, Youdao } = require('../models/index')
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

  // 获取有道词典对单词的翻译,先要找下数据库,找不到再请求有道API,在存数据库里面去
  async youdao(ctx) {
    ctx.verifyParams({
      word: { type: 'string', required: true }
    })

    const { word: request_word  } = ctx.request.body
    const searchWrod = await Youdao.findOne({
      where: {
        [Op.or]: [
          {
            word: request_word,
          },
          {
            returnPhrase: request_word
          }
        ]
      }
    })
    // 如果能搜到结果,直接给用户即可
    if (searchWrod) {
      const { explains, web, ...rest } = searchWrod.dataValues
      return ctx.body = {
        ...rest,
        explains: JSON.parse(explains),
        web: web ? JSON.parse(web) : null
      }
    }
    const salt = uuidv4()
    const curtime = Math.round(new Date().getTime() / 1000)
    const str = YOUDAO_KEY + request_word + salt + curtime + YOUDAO_SECRET
    const hash = crypto.createHash('sha256').update(str)
    const sign = hash.digest('hex')
    
    const res = await axios({
      method: 'POST',
      url: YOUDAO_URL,
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      params: {
        q: request_word,
        from: 'en',
        to: 'zh-CHS',
        appKey: YOUDAO_KEY,
        salt,
        sign,
        signType: 'v3',
        curtime,
      }
    }).then(res => res.data)
    const { 
      errorCode,
      word, 
      isWord, 
      translation, 
      webdict, 
      speakUrl, 
      basic, 
      returnPhrase,
      web
    } = res
    if (errorCode !== "0") {
      return ctx.throw(400, '翻译失败了呀,请检查下单词是否正常')
    }
    // 用于存最后放在数据库里面的对象
    const _youdao_ = { 
      isWord, 
      translation: translation.join(','), 
      webdict: 
      webdict.url, speakUrl 
    }
    
    if (isWord) {
      _youdao_.explains = JSON.stringify(basic.explains)
      _youdao_.ukPhonetic = basic['uk-phonetic']
      _youdao_.ukSpeech = basic['uk-speech']
      _youdao_.usPhonetic = basic['us-phonetic']
      _youdao_.usSpeech = basic['us-speech']
    }
    if (returnPhrase) {
      _youdao_.word = returnPhrase[0]
    } else if (word) {
      _youdao_.word = word[0] 
    } else {
      // 不是单词 也不是短语的内容,没有 returnPhrase 和 word
      _youdao_.word = request_word
    }
    if (web) {
      _youdao_.web = web ? JSON.stringify(web) : null
    }
    const saveWord = await Youdao.create(_youdao_)
    const { explains, web: _web, ...rest } = saveWord.dataValues
    ctx.body = {
      ...rest,
      explains: JSON.parse(explains),
      web: _web ? JSON.parse(_web) : null
    }
  }
}

module.exports = new WordCtl()


