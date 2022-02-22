const { User } = require('../models/index')
const Sequelize = require('sequelize');

class UserServer {
  getUserById(id) {
    return User.findByPk(id, {
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
              from wordPlans as wordPlan 
              where
                userId = ${id} and wordPlan.plan = '6'
            )`),
            'masterWord'
          ],
          // 所有学习过的单词
          [
            Sequelize.literal(`(
              select count(plan)
              from wordPlans as wordPlan 
              where
                userId = ${id}
            )`),
            'allWord'
          ],
        ],
      },
    })
  }
}

module.exports = new UserServer()