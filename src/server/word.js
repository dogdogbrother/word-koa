const axios = require('axios')
const { YOUDAO_KEY, YOUDAO_SECRET } = require('../conf/secretKeys')
const { v4: uuidv4 } = require('uuid')
const crypto = require('crypto')
const YOUDAO_URL = 'https://openapi.youdao.com/api'

/**
 * @description 用axios请求有道接,再转换成数据库需要的格式
 */
function getYoudaoAndFormat(request_word) {
  const salt = uuidv4()
  const curtime = Math.round(new Date().getTime() / 1000)
  const str = YOUDAO_KEY + request_word + salt + curtime + YOUDAO_SECRET
  const hash = crypto.createHash('sha256').update(str)
  const sign = hash.digest('hex')
  return axios({
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
  }).then(res => {
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
    } = res.data
    if (errorCode !== "0") {
      return { error: true }
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
    return _youdao_
  })
}

module.exports = {
  getYoudaoAndFormat
}