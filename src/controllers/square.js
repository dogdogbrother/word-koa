const { Square, User, Note } = require('../models/index')

class SquareCtl {
  // 广场动态
  async list(ctx) {
    const { userId } = ctx.request.query
    const where = {}
    if (userId) where.userId = userId
    const squares = await Square.findAll({
      include: [
        { model: User },
        { model: Note }
      ],
      where
    })
    ctx.body = squares
  }
}
module.exports = new SquareCtl()