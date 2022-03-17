const { Word, Youdao, WordPlan, UserNoteRelation, User } = require('../models/index')
const Sequelize = require('sequelize');
const Op = Sequelize.Op
const { getYoudaoAndFormat } = require('../server/word')
const { findAndUpdate } = require('../server/active')

class WordCtl {
  // 单词列表
  async list(ctx) {
    ctx.verifyParams({
      noteId: { type: 'string', required: true },
    })
    const { noteId } = ctx.params
    const { id: userId } = ctx.state.user

    const words = await Word.findAll({
      where: { noteId },
      include: [{ model: Youdao }],
      attributes: {
        include: [
          [
            Sequelize.literal(`(
              select plan
              from wordPlans as wordPlan
              where
                wordPlan.keyWord = word.keyWord and ${userId} = word.userId
            )`),
            'plan'
          ]
        ]
      }
    })
    ctx.body = words
  }

  // 新增单词
  async add(ctx) {
    ctx.verifyParams({
      word: { type: 'string', required: true },
      noteId: { type: 'string', required: true },
      keyWord: { type: 'string', required: true },
    })
    const { id: userId } = ctx.state.user
    const { word, wordMark, noteId, keyWord, fileList = [] } = ctx.request.body
    const repetitionWord = await Word.findOne({
      where: {
        [Op.and]: [ { word }, { noteId } ]
      }
    })
    if (repetitionWord) {
      return ctx.throw(409, '此单词本下已录入此单词')
    }
    await Word.create({
      word,
      wordMark,
      userId,
      noteId,
      keyWord,
      fileList: fileList.join(',')
    })
    // 创建单词要增加活跃度
    findAndUpdate(userId, 4)
    
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
        [Op.and]: [{ word }, { noteId }]
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
        [Op.or]: [{ word: request_word }, { returnPhrase: request_word }]
      }
    })
    // 如果能搜到结果,直接给用户即可
    if (searchWrod) {
      const { explains, web, ...rest } = searchWrod.dataValues
      return ctx.body = {
        ...rest,
        explains: explains? JSON.parse(explains) : null,
        web: web ? JSON.parse(web) : null
      }
    }
    
    const _youdao_ = await getYoudaoAndFormat(request_word)
    if (_youdao_.error) {
      return ctx.throw(400, '翻译失败了呀,请检查下单词是否正常')
    }
    const saveWord = await Youdao.create(_youdao_)
    const { explains, web: _web, ...rest } = saveWord.dataValues
    ctx.body = {
      ...rest,
      explains: JSON.parse(explains),
      web: _web ? JSON.parse(_web) : null
    }
  }

  // 单词计划维护
  async wordPlan(ctx) {
    ctx.verifyParams({
      // 0 陌生, 1 掌握, 2 模糊, 3 认识
      action: { type: 'number', required: true },
      keyWord: { type: 'string', required: true },
    })
    const { action, keyWord } = ctx.request.body
    const { id: userId } = ctx.state.user
    const findPlan = await WordPlan.findOne({
      where: {
        [Op.and]: [
          { keyWord }, { userId }
        ]
      }
    })
    // 如果能找到此单词进度,根据 action 不同,对 plan 的值进行更新(也可能不需要更新,plan值达到边界了)
    if (findPlan) {
      let planNumber = null
      const { plan, id } = findPlan.dataValues
      // 对陌生的单词进行 陌生 或者 模糊 操作,等于没有操作
      if ((action == 0 || action == 2) && plan == 0) {
        return ctx.status = 204
      }
      // 对掌握的单词进行 掌握 或者 认识 操作,等于没有操作 (正常没有这种情况,容错)
      if ((action == 1 || action == 3) && plan == 6) {
        return ctx.status = 204
      }
      if (action == 0) {
        planNumber = 0
      }
      if (action == 1) {
        planNumber = 6
      }
      if (action == 2) {
        planNumber = Number(plan) - 1
      }
      if (action == 3) {
        planNumber = Number(plan) + 1
      }
      await WordPlan.update(
        { plan: planNumber.toString() },
        {
          where: { id }
        }
      )
      return ctx.status = 204
    } else {
      await WordPlan.create({
        userId,
        plan: "0",
        keyWord
      })
      // 更新用户的活跃程度
      findAndUpdate(userId, 1)
      
      ctx.status = 204
    }
  }

  // 单词本的用户们
  async useUsers(ctx) {
    ctx.verifyParams({
      noteId: { type: 'string', required: true },
    })
    const { noteId } = ctx.request.query
    const res = await UserNoteRelation.findAll({
      attributes: [],
      where: { noteId },
      include: [
        { model: User }
      ]
    })
    ctx.body = res.map(item => item.dataValues.user)
  }
}

module.exports = new WordCtl()


