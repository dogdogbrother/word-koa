const { Square, User, Note } = require('../models/index')
const Sequelize = require('sequelize')

class SquareCtl {
  // 广场动态
  async list(ctx) {
    const { userId } = ctx.request.query
    const where = {}
    if (userId) where.userId = userId
    const squares = await Square.findAll({
      order: [
        ['createdAt', 'desc']
      ],
      include: [
        { 
          model: User,
          attributes: {
            include: [
              [
                Sequelize.literal(`(
                  select count(plan)
                  from wordPlans as wordPlan 
                  where
                    userId = user.id
                )`),
                'allWord'
              ],
              [
                Sequelize.literal(`(
                  select count(plan)
                  from wordPlans as wordPlan 
                  where
                    userId = user.id and wordPlan.plan = '6'
                )`),
                'masterWord'
              ]
            ]
          }
        },
        { model: Note }
      ],
      where
    })
    ctx.body = squares
  }
}

module.exports = new SquareCtl()