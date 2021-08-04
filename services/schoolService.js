const config = require('config.json')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const db = require('../_helpers/db')
const keysToCamel = require('../_helpers/keysToCarmelConverter')

module.exports = {
  getAllSchoolByDistrictId,
  getAllSchoolByDistrictName,
  getAllSchool,
  getSchoolById,
  create,
  updateSchool,
  deleteSchool: _deleteSchool
}

async function getAllSchool () {
  return await db.School.findAll()
}

async function getSchoolById (id) {
  return await getSchool(id)
}

// async function create (params) {
//   deleteSchool: _deleteSchool,
// }

async function getAllSchoolByDistrictId(district_id) {
  return await db.School.findAll({
    where: {
      district_id,
    },
  })
}

async function getAllSchool() {
  return await db.School.findAll()
}

async function getSchoolById(id) {
  return await getSchool(id)
}

async function create(params) {
  params = keysToCamel(params)
  params.districtId = parseInt(params.districtId)
  if (
    params.districtId === NaN ||
    !(await db.District.findByPk(params.districtId))
  )
    throw 'District does not exist'
  // console.log(params)

  // validate
  if (await db.School.findOne({ where: { schoolName: params.schoolName } })) {
    throw 'School "' + params.SchoolName + '" is already taken'
  }

  // save school
  await db.School.create(params)
}


async function updateSchool (id, params) {
  const school = await getSchool(id)
  params = keysToCamel(params)
  if (params.districtId) {
    params.districtId = parseInt(params.districtId)
    if (
      params.districtId === NaN ||
      !(await db.District.findByPk(params.districtId))
    )
      throw 'District does not exist'
  }
  // validate
  const SchoolChanged =
    params.SchoolName && school.SchoolName !== params.SchoolName
  if (
    SchoolChanged &&
    (await db.School.findOne({ where: { SchoolName: params.SchoolName } }))
  ) {
    throw 'School "' + params.SchoolName + '" is already taken'
  }

  // copy params to school and save
  Object.assign(school, params)
  await school.save()

  return school.get({ includes: [db.District] })
}

async function _deleteSchool(id) {
  const School = await getSchool(id)
  await School.destroy()
}

// helper functions

async function getSchool (id) {
  const School = await db.School.findByPk(id)
  if (!School) throw 'School not found'
  return School
}

async function getAllSchoolByDistrictName(district_name) {
  const district = await db.District.findOne({
    where: {
      districtName: district_name,
    },
    attributes: ['id'],
  })

  if (!district) throw 'District not found'

  return await db.School.findAll({
    where: {
      district_id: district.id,
    },
  })
}
