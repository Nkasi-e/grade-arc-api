const db = require('../_helpers/db')
const { Op } = require('sequelize')
const {
  SuperAdmin,
  DistrictAdmin,
  SchoolAdmin,
  Teacher
} = require('../_middleware/role')

module.exports = {
  getAllAudits,
  create
}

async function getAllAudits (role, limit, offset, query) {
  const {search, user} = query
  let condition = search ? { action: { [Op.like]: `%${search}%` } } : null
  let userConditions = user ? {
    [Op.or]: [
      {firstName: { [Op.like]: `%${user}%` }},
      {lastName: { [Op.like]: `%${user}%` }},
    ]
  } : null

  switch (role) {
    case DistrictAdmin:
      return await db.AuditLog.findAndCountAll({
        where: condition,
        limit,
        offset,
        attributes: ['action', ['created_at', 'created']],
        include: [
          {
            model: db.User,
            as: 'user',
            attributes: ['first_name', 'last_name', 'role'],
            where: {
              [Op.or]: [
                { role: 'schooladmin' },
                { role: 'teacher' },
                { role: 'student' },
                { role: 'parents' }
              ],
              ...userConditions
            }
          }
        ]
      })
    case SchoolAdmin:
      return await db.AuditLog.findAndCountAll({
        where: condition,
        limit,
        offset,
        attributes: ['action', ['created_at', 'created']],
        include: [
          {
            model: db.User,
            as: 'user',
              attributes: ['first_name', 'last_name', 'role'],
            where: {
              [Op.or]: [
                { role: 'teacher' },
                { role: 'student' },
                { role: 'parents' }
              ],
              ...userConditions
            }
          }
        ]
      })
    case Teacher:
      return await db.AuditLog.findAndCountAll({
        where: condition,
        limit,
        offset,
        attributes: ['action', ['created_at', 'created']],
        include: [
          {
            model: db.User,
            as: 'user',
            attributes: ['first_name', 'last_name', 'role'],
            where: {
              [Op.or]: [{ role: 'student' }, { role: 'parents' }],
              ...userConditions
            }
          }
        ]
      })
    case SuperAdmin:
      return await db.AuditLog.findAndCountAll({
        where: condition,
        limit,
        offset,
        attributes: ['action', ['created_at', 'created']],
        include: [
          {
            model: db.User,
            as: 'user',
            attributes: ['first_name', 'last_name', 'role'],
            where: {
              [Op.or]: [
                { role: 'superadmin' },
                { role: 'districtadmin' },
                { role: 'schooladmin' },
                { role: 'teacher' },
                { role: 'student' },
                { role: 'parents' }
              ],
              ...userConditions
            }
          }
        ]
      })
    default:
      throw 'UnauthorizedError'
  }
}

async function create (userId, params) {
  params.userId = userId

  params.userId = parseInt(params.userId)
  if (isNaN(params.userId) || !(await db.User.findByPk(params.userId)))
    throw 'User does not exist'
  // save user
  await db.AuditLog.create(params)
}
