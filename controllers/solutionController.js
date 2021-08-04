const Joi = require('joi')
const validateRequest = require('../_middleware/validate-request')
const solutionService = require('../services/solutionsService')
const getPagination = require('../_helpers/getPagination')
const auditService = require('../services/auditService')
const truncate = require('../_helpers/truncate')


exports.createSchema = (req, res, next) => {
    const schema = Joi.object({
        file_url: Joi.string().optional(),
        answer: Joi.string().optional(),
        assignment_id: Joi.string().required(),
    })
    validateRequest(req, next, schema)
}

exports.submitSolution = (req, res, next) => {
    solutionService
        .create(req.user.id, req.body)
        .then((solution) => {
            auditService
                .create(req.user.id, { action: `submitted solution: ${truncate(solution.answer)}` })
                .then(() => res.json({message: 'Solution submitted successful'}))
                .catch(next)
        })
        .catch(next)
}

exports.getAllSolutions = (req, res, next) => {
    const { page, size } = req.query
    const { limit, offset } = getPagination(page, size)

    solutionService
        .getAllSolutions( limit, offset, req.user.id )
        .then(data => {
            const response = getPagingData(data, page, limit)
            auditService
                .create(req.user.id, { action: `fetched all submitted solutions` })
                .then(() => res.json(response))
                .catch(next)
        })
        .catch(next)
}

const getPagingData = (data, page, limit) => {
    const { count: total_items, rows: solutions } = data
    const current_page = page ? +page : 0
    const total_pages = Math.ceil(total_items / limit)

    return { total_items, solutions, total_pages, current_page }
}
