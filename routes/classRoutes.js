const express = require('express')
const router = express.Router()
const classController = require('../controllers/classController')
const authorize = require('../_middleware/authorize')
const Role = require('../_middleware/role')

const {
  createSchema,
  getAllClasss,
  getAllClassesByCourseName,
  getClassById,
  updateClass,
  createClass,
  updateSchema,
  _deleteClass,
} = classController

// Routes
router.post(
  '/class/create',
  authorize([Role.DistrictAdmin]),
  createSchema,
  createClass,
)
router.get('/classes/', authorize([Role.DistrictAdmin]), getAllClasss)
router.get(
  '/classes_by_course/:course_name',
  authorize([Role.DistrictAdmin]),
  getAllClassesByCourseName,
)
router.get('/class/:id', authorize([Role.DistrictAdmin]), getClassById)
router.put(
  '/class/:id',
  authorize([Role.DistrictAdmin]),
  updateSchema,
  updateClass,
)
router.delete('/class/:id', authorize([Role.DistrictAdmin]), _deleteClass)

module.exports = router
