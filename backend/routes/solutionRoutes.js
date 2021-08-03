const express = require('express')
const router = express.Router()
const solutionController = require('../controllers/solutionController')
const authorize = require('../_middleware/authorize')
const Role = require('../_middleware/role')

const { createSchema, getAllSolutions, submitSolution } = solutionController

// Routes
router.post('/solutions/submit', authorize([Role.Student]), createSchema, submitSolution)
router.get(
    '/solutions/',
    authorize([
        Role.Student
    ]),
    getAllSolutions
)

module.exports = router
