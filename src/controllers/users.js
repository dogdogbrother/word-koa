const { User, Square, WordPlan } = require('../models/index')
const doCrypto = require('../utils/cryp')
const { _JWT_KEY_ } = require('../conf/secretKeys')
const Sequelize = require('sequelize');
const Op = Sequelize.Op
const jsonwebtoken = require('jsonwebtoken')
const HOST = require('../utils/host')

class UsersCtl {
  // 注册
  async register(ctx) {
    ctx.verifyParams({
      username: { type: 'string', required: true },
      password: { type: 'string', required: true },
      affirmPassword: { type: 'string', required: true },
    })
    const { username, password, affirmPassword } = ctx.request.body
    if (password !== affirmPassword) {
      return ctx.throw(403, '两次密码输入不一致')
    }
    const avatarLength = 20
    const avatarIndex = Math.floor(Math.random() * avatarLength)

    const [
      {username: _username, id, nickname: searchNickName, avatar}, 
      created
    ] = await User.findOrCreate({
      where: {
        username
      },
      defaults: {
        password: doCrypto(password),
        avatar: `${HOST}/avatar/${avatarIndex}.jpeg`,
        nickname: username
      }
    })
    if (!created) {
      return ctx.throw(409, '用户名已占用')
    }
    const token = jsonwebtoken.sign(
      { 
        id,
      },
      _JWT_KEY_,
      { expiresIn: '20d' }
    )
    ctx.body = {
      token,
      nickname: searchNickName,
      avatar,
      id
    }
    // 加入广场状态中去
    Square.create({
      type: '1',
      userId: id
    })
  }

  // 登录
  async login(ctx) {
    ctx.verifyParams({
      username: { type: 'string', required: true },
      password: { type: 'string', required: true },
    })
    const { username, password } = ctx.request.body
    const user = await User.findOne({
      attributes: ['username', 'id', 'nickname', 'avatar' ],
      where: {
        [Op.and]: [{ username },{ password: doCrypto(password) }]
      }
    })
    if (user) {
      const { nickname, id, avatar } = user
      const token = jsonwebtoken.sign(
        { 
          id,
        }, 
        _JWT_KEY_, 
        { expiresIn: '20d' }
      )
      ctx.body = {
        nickname,
        id,
        avatar,
        token
      }
    } else {
      return ctx.throw(403, '账户名或者密码错误')
    }
  }

  // 用户信息
  async info(ctx) {
    const { id } = ctx.state.user
    const user = await User.findByPk(id, {
      attributes: {
        include: [
          [
            Sequelize.literal(`(
              select noteId
              from userNoteRelations
              where
                userId = ${id}
            )`),
            'useNote'
          ],
          // 完全掌握的单词
          [
            Sequelize.literal(`(
              select count(plan)
              from WordPlans as wordPlan 
              where
                userId = ${id} and wordPlan.plan = '6'
            )`),
            'masterWord'
          ],
          // 所有学习过的单词
          [
            Sequelize.literal(`(
              select count(plan)
              from WordPlans as wordPlan 
              where
                userId = ${id}
            )`),
            'allWord'
          ],
        ],
      },
    })
    // 分组查询 所有学习单词的熟练度
    const wordPlan = await WordPlan.count({
      // attributes: ["keyWord"],
      // where: {
      //   id: 1
      // },
      // group: "keyWord",
    })
    console.log(wordPlan);
    ctx.body = user
  }

  // 查询某个用户信息
  async userInfo(ctx) {
    const { userId } = ctx.params
    const user = await User.findByPk(userId, {
      attributes: {
        include: [
          // 完全掌握的单词
          [
            Sequelize.literal(`(
              select count(plan)
              from WordPlans as wordPlan 
              where
                userId = ${userId} and wordPlan.plan = '6'
            )`),
            'masterWord'
          ],
          // 所有学习过的单词
          [
            Sequelize.literal(`(
              select count(plan)
              from WordPlans as wordPlan 
              where
                userId = ${userId}
            )`),
            'allWord'
          ],
        ],
      },
    })
    ctx.body = user
  }
}

module.exports = new UsersCtl()