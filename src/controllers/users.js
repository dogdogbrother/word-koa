const { User, Square } = require('../models/index')
const doCrypto = require('../utils/cryp')
const { _JWT_KEY_ } = require('../conf/secretKeys')
const Sequelize = require('sequelize');
const Op = Sequelize.Op
const jsonwebtoken = require('jsonwebtoken')

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
    const avatarIndex = Math.round(Math.random() * avatarLength)

    const [
      {username: _username, id, nickname: searchNickName, avatar}, 
      created
    ] = await User.findOrCreate({
      where: {
        username
      },
      defaults: {
        password: doCrypto(password),
        avatar: avatarIndex,
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
    const { nickname, id, avatar } = await User.findOne({
      attributes: ['username', 'id', 'nickname', 'avatar' ],
      where: {
        [Op.and]: [{ username },{ password: doCrypto(password) }]
      }
    })
    if (user) {
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
    const user = await User.findByPk(id)
    ctx.body = user
  }
}

module.exports = new UsersCtl()