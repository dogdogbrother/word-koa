const User = require('./User')
const Note = require('./Note')

Note.belongsTo(User, {
  foreignKey: 'userId'
})

module.exports = {
  User,
  Note
}