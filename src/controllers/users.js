const { User, Square } = require('../models/index')
const doCrypto = require('../utils/cryp')
const { _JWT_KEY_ } = require('../conf/secretKeys')
const Sequelize = require('sequelize');
const Op = Sequelize.Op
const jsonwebtoken = require('jsonwebtoken')
const HOST = require('../utils/host')
const { getUserById } = require('../server/user')
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
    const avatarLength = 19
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
    const user = await getUserById(id)
    // 分组查询 所有学习单词的熟练度
    // const wordPlan = await WordPlan.count({
      // attributes: ["keyWord"],
      // where: {
      //   id: 1
      // },
      // group: "keyWord",
    // })
    ctx.body = user
  }

  // 查询某个用户信息
  async userInfo(ctx) {
    const { userId } = ctx.params
    const user = await getUserById(userId)
    ctx.body = user
  }

  // 更新用户的个人信息
  async update(ctx) {
    const { id } = ctx.state.user
    ctx.verifyParams({
      nickname: { type: 'string', required: true },
    })
    const { 
      avatar,
      nickname, 
      introduce, 
      autoPlay, 
      defaultPhonetic
    } = ctx.request.body
    await User.update(
      { nickname, introduce, autoPlay, defaultPhonetic, avatar },
      { where: { id } }
    )
    const user = await getUserById(id)
    ctx.body = user
  }
}

module.exports = new UsersCtl()