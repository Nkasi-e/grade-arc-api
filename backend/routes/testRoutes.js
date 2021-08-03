const express = require('express')
const router = express.Router()
const auditController = require('../controllers/auditController')
const authorize = require('../_middleware/authorize')
const Role = require('../_middleware/role')

const { createSchema, getAllAudits, createAuditLog } = auditController

// Routes
router.post('/audits/create', authorize(), createSchema, createAuditLog)
router.get(
  '/audits/',
  authorize([
    Role.DistrictAdmin,
    Role.SchoolAdmin,
    Role.SuperAdmin,
    Role.Teacher
  ]),
  getAllAudits
)

module.exports = router
