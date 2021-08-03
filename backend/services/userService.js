const config = require('config.json')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const db = require('../_helpers/db')
const keysToCamel = require('../_helpers/keysToCarmelConverter')

module.exports = {
  getAllStudentsAndTeachersByClassInstance,
  authenticate,
  getAllInClass,
  getAll,
  getById,
  create,
  update,
  delete: _delete,
}

const { Student, Teacher } = require('../_middleware/role')

async function authenticate({ email, password }) {
  const user = await db.User.scope('withHash').findOne({ where: { email } })

  if (!user || !(await bcrypt.compare(password, user.password)))
    throw 'Email or password is incorrect'

  // authentication successful
  const token = jwt.sign({ sub: user.id, role: user.role }, config.secret, {
    expiresIn: '7d',
  })
  return { ...omitHash(user.get()), token }
}

async function getAll() {
  return await db.User.findAll()
}
async function getAllInClass(classId) {
  return await db.User.findAll({
    where: {
      ClassId: classId,
    },
  })
}

async function getAllStudentsAndTeachersByClassInstance(class_instance) {
  const classItem = await db.Class.findOne({
    where: {
      classInstance: class_instance,
    },
    attributes: ['id'],
  })

  if (!classItem) throw 'Class not found'

  const students = await db.User.findAll({
    where: { class_id: classItem.id, role: Student },
  })
  const teachers = await db.User.findAll({
    where: { class_id: classItem.id, role: Teacher },
  })

  return { students, teachers }
}

async function getById(id) {
  return await getUser(id)
}

async function create(params) {
  params = keysToCamel(params)
  // validate
  if (await db.User.findOne({ where: { email: params.email } })) {
    throw 'Email "' + params.email + '" is already taken'
  }

  // hash password
  if (params.password) {
    params.password = await bcrypt.hash(params.password, 10)
  }

  // save user
  return await db.User.create(params)
}

async function update(id, params) {
  const user = await getUser(id)

  // validate
  const emailChanged = params.email && user.email !== params.email
  if (
    emailChanged &&
    (await db.User.findOne({ where: { email: params.email } }))
  ) {
    throw 'Email "' + params.email + '" is already taken'
  }

  // hash password if it was entered
  if (params.password) {
    params.password = await bcrypt.hash(params.password, 10)
  }

  // copy params to user and save
  Object.assign(user, params)
  await user.save()

  return omitHash(user.get())
}

async function _delete(id) {
  const user = await getUser(id)
  await user.destroy()
}

// helper functions

async function getUser(id) {
  const user = await db.User.findByPk(id)
  if (!user) throw 'User not found'
  return user
}

function omitHash(user) {
  const { password, ...userWithoutHash } = user
  return userWithoutHash
}
