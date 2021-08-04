const express = require('express')
const router = express.Router()
const assignmentController = require('../controllers/assignmentController')
const authorize = require('../_middleware/authorize')
const Role = require('../_middleware/role')

const { createSchema, getAllAssignments, createAssignment } = assignmentController

// Routes
router.post('/assignments/create', authorize([Role.Teacher]), createSchema, createAssignment)
router.get(
    '/assignments/',
    authorize([
        Role.Teacher
    ]),
    getAllAssignments
)

module.exports = router
