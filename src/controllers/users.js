const { User } = require('../models/index')
const doCrypto = require('../utils/cryp')
const { _JWT_KEY_ } = require('../conf/secretKeys')
const Sequelize = require('sequelize');
const Op = Sequelize.Op
// const uuid = require('node-uuid');
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
    const repetitionUser = await User.findOne({
      where: {
        username
      }
    })
    if (repetitionUser) {
      return ctx.throw(409, '用户名已占用')
    }
    const { username: _username, id } = await User.create({
      username,
      password: doCrypto(password),
    })
    const token = jsonwebtoken.sign(
      { 
        username: _username,
        id: id
      },
      _JWT_KEY_,
      { expiresIn: '20d' }
    )
    ctx.body = {
      token,
      username
    }
  }

  // 登录
  async login(ctx) {
    ctx.verifyParams({
      username: { type: 'string', required: true },
      password: { type: 'string', required: true },
    })
    const { username, password } = ctx.request.body
    const user = await User.findOne({
      attributes: ['username', 'id' ],
      where: {
        [Op.and]: [{ username },{ password: doCrypto(password) }]
      }
    })
    if (user) {
      const token = jsonwebtoken.sign(
        { 
          username: user.dataValues.username,
          id: user.dataValues.id
        }, 
        _JWT_KEY_, 
        { expiresIn: '20d' }
      )
      ctx.body = {
        ...user.dataValues,
        token
      }
    } else {
      return ctx.throw(403, '账户名或者密码错误')
    }
  }

  // 用户信息
  async info(ctx) {
    const { username } = ctx.state.user
    ctx.body = {
      username
    }
  }
}

module.exports = new UsersCtl()