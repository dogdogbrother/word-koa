const { Active } = require('../models/index')
const Sequelize = require('sequelize');
const Op = Sequelize.Op
const dayjs = require('dayjs')

function getActive(userId, today) {
  return Active.findOne({
    where: {
      [Op.and]: [
        { userId },
        { createdTime: today }
      ]
    }
  })
}

function createActive(userId, today, active) {
  return Active.create({
    userId,
    active,
    createdTime: today
  })
}

/**
 * @param {*} userId 用户id
 * @param {*} today 今日日期 ps:2008-08-08
 * @param {*} active 自身的活跃度的值
 * @param {*} addNumber 需要增加的数值
 */
function updateActive(userId, today, active, addNumber) {
  return Active.update(
    { active: active + addNumber},
    { 
      where: {
        [Op.and]: [
          { userId },
          { createdTime: today }
        ]
      }
    } 
  )
}

class ActiveServer {
  /**
   * @description 先找数据,没有的话创建,有的话更新,就是把上面的三个函数整合了一下
   * @param {*} userId 
   * @param {*} addNumber 需要增加的数值
   */
  async findAndUpdate(userId, addNumber) {
    const today = dayjs().format("YYYY-MM-DD")
    const findActive = await getActive(userId, today)
    if (findActive) {
      updateActive(userId, today, findActive.active, addNumber)
    } else {
      createActive(userId, today, addNumber)
    }
  }
}

module.exports = new ActiveServer()