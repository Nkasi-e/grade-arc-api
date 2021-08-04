const Joi = require('joi')
const validateRequest = require('../_middleware/validate-request')
const auditService = require('../services/auditService')
const getPagination = require('../_helpers/getPagination')

exports.createSchema = (req, res, next) => {
  const schema = Joi.object({
    action: Joi.string().required()
  })
  validateRequest(req, next, schema)
}

exports.createAuditLog = (req, res, next) => {
  auditService
    .create(req.user.id, req.body)
    .then(() => res.json({ message: 'Audit Log Added successful' }))
    .catch(next)
}

exports.getAllAudits = (req, res, next) => {
  const role = req.user.role
  const { page, size } = req.query
  const { limit, offset } = getPagination(page, size)

  auditService
    .getAllAudits(role, limit, offset, req.query )
    .then(data => {
      const response = getPagingData(data, page, limit)
      res.json(response)
    })
    .catch(next)
}

const getPagingData = (data, page, limit) => {
  const { count: total_items, rows: audits } = data
  const current_page = page ? +page : 0
  const total_pages = Math.ceil(total_items / limit)

  return { total_items, audits, total_pages, current_page }
}
