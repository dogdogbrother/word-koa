// const { User } = require('../models/index');
// const doCrypto = require('../utils/cryp')
// const Sequelize = require('sequelize');
// const Op = Sequelize.Op;
// const uuid = require('node-uuid');

class UsersCtl {
  // 注册
  async register(ctx) {
    ctx.verifyParams({
      username: { type: 'string', required: true },
      password: { type: 'string', required: true },
      affirmPassword: { type: 'string', required: true },
    })
    // ctx.body = 123
  }
}

module.exports = new UsersCtl()