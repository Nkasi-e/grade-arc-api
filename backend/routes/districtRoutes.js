const express = require('express')
const router = express.Router()
const districtController = require('../controllers/districtController')
const authorize = require('../_middleware/authorize')
const Role = require('../_middleware/role')

const {
  createSchema,
  getAllDistrict,
  getDistrictById,
  updateDistrict,
  createDistrict,
  updateSchema,
  _deleteDistrict,
} = districtController

// Routes
router.post(
  '/districts/create',
  authorize([Role.DistrictAdmin]),
  createSchema,
  createDistrict,
)
router.get('/districts/', authorize([Role.DistrictAdmin]), getAllDistrict)
router.get('/districts/:id', authorize([Role.DistrictAdmin]), getDistrictById)
router.put(
  '/districts/:id',
  authorize([Role.DistrictAdmin]),
  updateSchema,
  updateDistrict,
)
router.delete(
  '/districts/:id',
  authorize([Role.DistrictAdmin]),
  _deleteDistrict,
)

module.exports = router
