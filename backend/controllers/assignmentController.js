const Joi = require('joi')
const validateRequest = require('../_middleware/validate-request')
const assignmentService = require('../services/assignmentService')
const getPagination = require('../_helpers/getPagination')
const auditService = require('../services/auditService')
const truncate = require('../_helpers/truncate')


exports.createSchema = (req, res, next) => {
    const schema = Joi.object({
        question: Joi.string().required(),
        due_date: Joi.date().raw().required(),
        file_submission: Joi.boolean().required(),
    })
    validateRequest(req, next, schema)
}

exports.createAssignment = (req, res, next) => {
    assignmentService
        .create(req.user.id, req.body)
        .then((assignment) => {
            auditService
                .create(req.user.id, { action: `added assignment: ${truncate(assignment.question)}` })
                .then(() => res.json({message: 'Assignment creation successful'}))
                .catch(next)
        })
        .catch(next)
}

exports.getAllAssignments = (req, res, next) => {
    const { page, size } = req.query
    const { limit, offset } = getPagination(page, size)

    assignmentService
        .getAllAssignments( limit, offset )
        .then(data => {
            const response = getPagingData(data, page, limit)
            auditService
                .create(req.user.id, { action: `fetched all created assignments` })
                .then(() => res.json(response))
                .catch(next)
        })
        .catch(next)
}

const getPagingData = (data, page, limit) => {
    const { count: total_items, rows: assignments } = data
    const current_page = page ? +page : 0
    const total_pages = Math.ceil(total_items / limit)

    return { total_items, assignments, total_pages, current_page }
}
