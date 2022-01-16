const User = require('./User')
const Note = require('./Note')
const Word = require('./Word')
const Square = require('./Square')

Note.belongsTo(User, {
  foreignKey: 'userId'
})

Word.belongsTo(User, {
  foreignKey: 'userId'
})

Word.belongsTo(Note, {
  foreignKey: 'noteId'
})

Note.hasMany(Word, {
  foreignKey: 'noteId'
})

Square.belongsTo(Note, {
  foreignKey: 'noteId'
})

Square.belongsTo(User, {
  foreignKey: 'userId'
})

module.exports = {
  User,
  Note,
  Word,
  Square
}