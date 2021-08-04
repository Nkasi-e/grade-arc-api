const Joi = require('joi')
const validateRequest = require('../_middleware/validate-request')
const userService = require('../services/userService')
const auditService = require('../services/auditService')

exports.authenticateSchema = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  })
  validateRequest(req, next, schema)
}

exports.authenticate = (req, res, next) => {
  userService
    .authenticate(req.body)
    .then((user) => {
      auditService
        .create(user.id, { action: 'logged in' })
        .then(() => res.json(user))
        .catch(next)
    })
    .catch(next)
}

exports.registerSchema = (req, res, next) => {
  const schema = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string()
  })
  validateRequest(req, next, schema)
}

exports.register = (req, res, next) => {
  userService
    .create(req.body)
    .then((user) => {
      auditService
        .create(user.id, { action: 'registered into the system' })
        .then(() => res.json({ message: 'Registration successful' }))
        .catch(next)
    })
    .catch(next)
}

exports.getAll = (req, res, next) => {
  userService
    .getAll()
    .then((users) => {
      auditService
        .create(req.user.id, { action: 'retrived all users' })
        .then(() => res.json(users))
        .catch(next)
    })
    .catch(next)
}

exports.getAllStudentsAndTeachersByClassInstance = (req, res, next) => {
  userService
    .getAllStudentsAndTeachersByClassInstance(req.params.class_instance)
    .then((users) => res.json(users))
    .catch(next)
}

exports.getCurrent = (req, res, next) => {
  res.json(req.user)
}

exports.getById = (req, res, next) => {
  // const currentUser = req.user;
  // const id = parseInt(req.params.id);
  // // only allow admins to access other user records
  // if (id !== currentUser.sub && currentUser.role !== Role.DistrictAdmin) {
  //   return res.status(401).json({ message: 'Unauthorized' });
  // }
  userService
    .getById(req.params.id)
    .then((user) => {
      auditService
        .create(req.user.id, {
          action: `retrived user: ${user.firstName} ${user.lastName}`,
        })
        .then(() => res.json(user))
        .catch(next)
    })
    .catch(next)
}

exports.updateSchema = (req, res, next) => {
  const schema = Joi.object({
    first_name: Joi.string().empty(''),
    last_name: Joi.string().empty(''),
    email: Joi.string().empty(''),
    password: Joi.string().min(6).empty(''),
  })
  validateRequest(req, next, schema)
}

exports.update = (req, res, next) => {
  userService
    .update(req.params.id, req.body)
    .then((user) => {
      auditService
        .create(user.id, { action: 'updated details' })
        .then(() => res.json(user))
        .catch(next)
    })
    .catch(next)
}

exports._delete = (req, res, next) => {
  userService
    .delete(req.params.id)
    .then(() => {
      auditService
        .create(req.user.id, { action: `deleted user: id: ${req.params.id}` })
        .then(() => res.json({ message: 'User deleted successfully' }))
        .catch(next)
    })
    .catch(next)
}
