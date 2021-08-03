const express = require('express')
const router = express.Router()
const courseController = require('../controllers/courseController')
const authorize = require('../_middleware/authorize')
const Role = require('../_middleware/role')

const {
  createSchema,
  getAllCourses,
  getAllCoursesBySchoolName,
  getCourseById,
  updateCourse,
  createCourse,
  updateSchema,
  _deleteCourse,
} = courseController

// Routes
router.post(
  '/courses/create',
  authorize([Role.DistrictAdmin]),
  createSchema,
  createCourse,
)
router.get('/courses/', authorize([Role.DistrictAdmin]), getAllCourses)
router.get(
  '/courses_by_school/:school_name',
  authorize([Role.DistrictAdmin]),
  getAllCoursesBySchoolName,
)
router.get('/courses/:id', authorize([Role.DistrictAdmin]), getCourseById)
router.put(
  '/courses/:id',
  authorize([Role.DistrictAdmin]),
  updateSchema,
  updateCourse,
)
router.delete('/courses/:id', authorize([Role.DistrictAdmin]), _deleteCourse)

module.exports = router
