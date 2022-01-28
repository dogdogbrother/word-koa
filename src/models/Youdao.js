const seq = require('../db/seq')
const { BOOLEAN, STRING } = require('../db/types')

/**
 * @description 存有道翻译返回的内容,这样就能少一些请求了,搜索同样的单词就从数据库拿
 */
const Youdao = seq.define('youdao', {
  // 也有可能不是单词,看isWord字段  如果returnPhrase有值,存returnPhrase内容
  word: {
    type: STRING,
    allowNull: false,
    primaryKey: true,
    comment: '搜索的单词'
  },
  // 如果用户搜索的是中文符号,或者短句,为false
  isWord: {
    type: BOOLEAN,
    allowNull: false,
    comment: '是否是单词'
  },
  // 在isWord为true时,有道过来的内容会有basic,basic.explains为数组,存的时候用转字符串
  explains: {
    type: STRING,
    allowNull: true,
    comment: '单词的翻译,',
    get() {
      const rawValue = this.getDataValue('explains')
      return rawValue ? JSON.parse(rawValue) : []
    }
  },
  // 能把大小写,多余的符号去除掉,所以,如果有这个值,这个值才是才是真正word
  returnPhrase: {
    type: STRING,
    allowNull: true,
    comment: '校验后的结果'
  },
  // isWord为true时,有值 basic.uk-phonetic
  ukPhonetic: {
    type: STRING,
    allowNull: true,
    comment: '英标'
  },
  // isWord为true时,有值 basic.uk-speech
  ukSpeech: {
    type: STRING,
    allowNull: true,
    comment: '英标发音地址'
  },
  // isWord为true时,有值 basic.us-phonetic
  usPhonetic: {
    type: STRING,
    allowNull: true,
    comment: '美标'
  },
  // isWord为true时,有值 basic.us-speech
  usSpeech: {
    type: STRING,
    allowNull: true,
    comment: '美标发音地址'
  },
  // 基本都会有值,和explains不同的是,假如你搜索的不是单词,也会给你个中文翻译
  translation: {
    type: STRING,
    allowNull: false,
    comment: '翻译结果'
  },
  // 在有道结果里是 webdict.url, 随便输入的无效内容为空
  webdict: {
    type: STRING,
    allowNull: false,
    comment: '有道词典翻译的url'
  },
  // 假如输入my name is 汉字,只会翻译my name
  speakUrl: {
    type: STRING,
    allowNull: false,
    comment: '翻译整句的语音url'
  },
  // 不一定会有,object[],key是英文,value是string[] 装的翻译,存的时候用转字符串
  web: {
    type: STRING,
    allowNull: true,
    comment: '词义,类似于短语',
    get() {
      const rawValue = this.getDataValue('web');
      return rawValue ? JSON.parse(rawValue) : []
    }
  },
})

module.exports = Youdao