const { Square, User, Note } = require('../models/index')

class SquareCtl {
  // 广场动态
  async list(ctx) {
    const squares = await Square.findAll({
      include: [
        { model: User },
        { model: Note }
      ]
    })
    ctx.body = squares
  }
}

module.exports = new SquareCtl()