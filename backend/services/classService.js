const config = require('config.json')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const db = require('../_helpers/db')
const keysToCamel = require('../_helpers/keysToCarmelConverter')

module.exports = {
  getAllClasss,
  getAllClassesByCourseName,
  getClassById,
  create,
  updateClass,
  deleteClass: _deleteClass,
}

async function getAllClasss() {
  return await db.Class.findAll()
}

async function getAllClassesByCourseName(course_name) {
  const course = await db.Course.findOne({
    where: {
      courseName: course_name,
    },
    attributes: ['id'],
  })

  if (!course) throw 'Course not found'

  return await db.Class.findAll({
    where: {
      course_id: course.id,
    },
  })
}

async function getClassById(id) {
  return await getClass(id)
}

async function create(params) {
  params = keysToCamel(params)
  // validate
  if (
    await db.Class.findOne({ where: { classInstance: params.classInstance } })
  ) {
    throw 'Class "' + params.classInstance + '" is already taken'
  }

  // save user
  await db.Class.create(params)
}

async function updateClass(id, params) {
  const classItem = await getClass(id)
  params = keysToCamel(params)
  // validate
  const classItemChanged =
    params.classInstance && classItem.classInstance !== params.classInstance
  if (
    classItemChanged &&
    (await db.Class.findOne({ where: { classInstance: params.classInstance } }))
  ) {
    throw 'Class "' + params.classInstance + '" is already taken'
  }

  // copy params to user and save
  Object.assign(classItem, params)
  await classItem.save()

  return classItem.get()
}

async function _deleteClass(id) {
  const classItem = await getClass(id)
  await classItem.destroy()
}

// helper functions

async function getClass(id) {
  const classItem = await db.Class.findByPk(id)
  if (!classItem) throw 'Class not found'
  return classItem
}
