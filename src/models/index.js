const User = require('./User')
const Note = require('./Note')
const Word = require('./Word')

Note.belongsTo(User, {
  foreignKey: 'userId'
})

Word.belongsTo(User, {
  foreignKey: 'userId'
})

Word.belongsTo(Note, {
  foreignKey: 'noteId'
})

module.exports = {
  User,
  Note,
  Word
}