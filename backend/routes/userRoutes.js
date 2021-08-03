const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const authorize = require('../_middleware/authorize')
const Role = require('../_middleware/role')

const {
  authenticateSchema,
  authenticate,
  getAllStudentsAndTeachersByClassInstance,
  registerSchema,
  register,
  getAll,
  getCurrent,
  getById,
  updateSchema,
  update,
  _delete,
} = userController

// Routes
router.post('/users/login', authenticateSchema, authenticate)
router.post('/users/register', registerSchema, register)
router.get('/users/', authorize([Role.DistrictAdmin]), getAll)
router.get(
  '/users/students_and_teachers_by_class/:class_instance',
  authorize([Role.DistrictAdmin]),
  getAllStudentsAndTeachersByClassInstance,
)
router.get('/users/current', authorize(), getCurrent)
router.get('/users/:id', authorize(), getById)
router.put('/users/:id', authorize(), updateSchema, update)
router.delete('/users/:id', authorize(), _delete)

module.exports = router
