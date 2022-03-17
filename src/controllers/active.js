const { Active } = require('../models/index')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

class ActiveCtl {
  async yearAllActive(ctx) {
    ctx.verifyParams({
      year: { type: 'string', required: true },
    })
    const { id: userId } = ctx.state.user
    const { year } = ctx.params
    const findActive = await Active.findAll({
      where: {
        [Op.and]: [
          { userId },
          { createdTime: {[Op.like]: year + '%' } }
        ]
      }
    })
    ctx.body = findActive || {}
  }
}

module.exports = new ActiveCtl()