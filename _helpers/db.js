const mysql = require('mysql2/promise')
const { Sequelize } = require('sequelize')

const db = {}
module.exports = db
initialize()

async function initialize() {
  // create db if it doesn't already exist
  const host = process.env['HOST']
  const port = process.env['PORT']
  const user = process.env['USER']
  const password = process.env['PASSWORD']
  const database = process.env['DATABASE']
  const connection = await mysql.createConnection({
    host,
    port,
    user,
    password,
  })
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`)
  // connect to db
  const sequelize = new Sequelize(database, user, password, {
    dialect: 'mysql',
    host,
    port,
  })

  // init models and add them to the exported db object
  db.User = require('../models/user')(sequelize)
  db.Class = require('../models/class')(sequelize)
  db.Course = require('../models/course')(sequelize)
  db.School = require('../models/school')(sequelize)
  db.District = require('../models/district')(sequelize)
  db.UserClass = require('../models/userClass')(sequelize)
  db.NoteFolder = require('../models/noteFolder')(sequelize)
  db.Note = require('../models/note')(sequelize)
  db.ChatMessage = require('../models/chatMessage')(sequelize)
  db.AuditLog = require('../models/auditLog')(sequelize)
  db.ChatPrivateMessage = require('../models/chatPrivateMessage')(sequelize)
  db.Assignment = require('../models/assignment')(sequelize)
  db.Solution = require('../models/solution')(sequelize)

  db.User.belongsToMany(db.Class, { through: db.UserClass, as: 'class' })
  db.Class.belongsToMany(db.User, { through: db.UserClass, as: 'user' })
  db.Class.belongsTo(db.Course, { as: 'course' })
  db.Course.belongsTo(db.School, { as: 'school' })
  db.School.belongsTo(db.District, { as: 'district' })
  db.AuditLog.belongsTo(db.User, { as: 'user' })

  db.NoteFolder.belongsTo(db.Class, { as: 'class' })
  db.Note.belongsTo(db.NoteFolder, { as: 'note_folder' })
  db.Note.belongsTo(db.User, { as: 'user' })
  db.ChatMessage.belongsTo(db.ChatMessage, { foreignKey: 'replyTo' })

  db.District.hasMany(db.School)
  db.User.hasMany(db.AuditLog, { onDelete: 'cascade' })

  db.Assignment.belongsTo(db.User, { as: 'teacher', foreignKey: 'teacherId' })
  db.Solution.belongsTo(db.Assignment, { as: 'assignment', foreignKey: 'assignmentId' })
  db.Solution.belongsTo(db.User, { as: 'student', foreignKey: 'studentId' })

  db.District.hasMany(db.School)
  db.User.hasMany(db.AuditLog, { onDelete: 'cascade' })
  db.User.hasMany(db.Assignment, { onDelete: 'cascade', foreignKey: 'teacherId'})
  db.User.hasMany(db.Solution, { onDelete: 'cascade', foreignKey: 'studentId' })
  db.Assignment.hasMany(db.Solution, { onDelete: 'cascade', foreignKey: 'assignmentId' })

  db.School.hasMany(db.Course)
  db.Course.hasMany(db.Class)
  db.Class.hasMany(db.User)
  db.User.hasMany(db.Note)
  db.Class.hasOne(db.NoteFolder)
  db.NoteFolder.hasMany(db.Note)
  db.ChatMessage.hasOne(db.ChatMessage, {
    foreignKey: 'replyTo',
    as: 'reply',
  })

  // sync all models with database
  await sequelize.sync()
}
