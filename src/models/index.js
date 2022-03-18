const User = require('./User')
const Note = require('./Note')
const Word = require('./Word')
const Square = require('./Square')
const UserNoteRelation = require('./UserNoteRelation')
const Youdao = require('./Youdao')
const WordPlan = require('./WordPlan')
const Active = require('./Active')

Note.belongsTo(User, {
  foreignKey: 'userId'
})

Word.belongsTo(User, {
  foreignKey: 'userId'
})

Word.belongsTo(Note, {
  foreignKey: 'noteId'
})

Word.belongsTo(Youdao, {
  foreignKey: 'keyWord'
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

UserNoteRelation.belongsTo(Note, {
  foreignKey: 'noteId'
})

UserNoteRelation.belongsTo(User, {
  foreignKey: 'userId'
})

WordPlan.belongsTo(User, {
  foreignKey: 'userId'
})

WordPlan.belongsTo(Word, {
  foreignKey: 'wordId'
})

Active.belongsTo(User, {
  foreignKey: 'userId'
})

module.exports = {
  User,
  Note,
  Word,
  Square,
  UserNoteRelation,
  Youdao,
  WordPlan,
  Active
}