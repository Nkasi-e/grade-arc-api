const express = require('express')
const router = express.Router()
const schoolController = require('../controllers/schoolController')
const authorize = require('../_middleware/authorize')
const Role = require('../_middleware/role')

const {
  createSchema,
  getAllSchool,
  getSchoolById,
  updateSchool,
  createSchool,
  updateSchema,
  _deleteSchool,
  getAllSchoolByDistrictName,
} = schoolController

// Routes
router.post(
  '/schools/create',
  authorize([Role.DistrictAdmin]),
  createSchema,
  createSchool,
)
router.get('/schools/', authorize([Role.DistrictAdmin]), getAllSchool)
router.get(
  '/schools_by_district/:district_name',
  authorize([Role.DistrictAdmin]),
  getAllSchoolByDistrictName,
)
router.get('/schools/:id', authorize([Role.DistrictAdmin]), getSchoolById)
router.put(
  '/schools/:id',
  authorize([Role.DistrictAdmin]),
  updateSchema,
  updateSchool,
)
router.delete('/schools/:id', authorize([Role.DistrictAdmin]), _deleteSchool)

module.exports = router
