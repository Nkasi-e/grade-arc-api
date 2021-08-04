const config = require('config.json')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const db = require('../_helpers/db')
const keysToCamel = require('../_helpers/keysToCarmelConverter')

module.exports = {
  getAllCourses,
  getAllCoursesBySchoolName,
  getCourseById,
  create,
  updateCourse,
  deleteCourse: _deleteCourse,
}

async function getAllCourses() {
  return await db.Course.findAll()
}

async function getAllCoursesBySchoolName(school_name) {
  const school = await db.School.findOne({
    where: {
      schoolName: school_name,
    },
    attributes: ['id'],
  })

  if (!school) throw 'School not found'

  return await db.Course.findAll({
    where: {
      school_id: school.id,
    },
  })
}

async function getCourseById(id) {
  return await getCourse(id)
}

async function create(params) {
  params = keysToCamel(params)
  // validate
  if (await db.Course.findOne({ where: { courseName: params.courseName } })) {
    throw 'Course "' + params.courseName + '" is already taken'
  }

  // save user
  await db.Course.create(params)
}

async function updateCourse(id, params) {
  const course = await getCourse(id)
  params = keysToCamel(params)
  // validate
  const courseChanged =
    params.courseName && course.courseName !== params.courseName
  if (
    courseChanged &&
    (await db.Course.findOne({ where: { courseName: params.courseName } }))
  ) {
    throw 'Course "' + params.courseName + '" is already taken'
  }

  // copy params to user and save
  Object.assign(course, params)
  await course.save()

  return course.get()
}

async function _deleteCourse(id) {
  const course = await getCourse(id)
  await course.destroy()
}

// helper functions

async function getCourse(id) {
  const course = await db.Course.findByPk(id)
  if (!course) throw 'Course not found'
  return course
}
