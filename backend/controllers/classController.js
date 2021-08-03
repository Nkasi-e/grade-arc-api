const Joi = require('joi')
const validateRequest = require('../_middleware/validate-request')
const classService = require('../services/ClassService')

exports.createSchema = (req, res, next) => {
  const schema = Joi.object({
    class_name: Joi.string().required(),
  })
  validateRequest(req, next, schema)
}

exports.createClass = (req, res, next) => {
  classService
    .create(req.body)
    .then(() => res.json({ message: 'Class Added successful' }))
    .catch(next)
}

exports.getAllClasss = (req, res, next) => {
  classService
    .getAllClasss()
    .then((classs) => res.json(classs))
    .catch(next)
}

exports.getAllClassesByCourseName = (req, res, next) => {
  classService
    .getAllClassesByCourseName(req.params.course_name)
    .then((classes) => res.json(classes))
    .catch(next)
}

exports.getClassById = (req, res, next) => {
  // const currentUser = req.user;
  // const id = parseInt(req.params.id);
  // // only allow admins to access other user records
  // if (id !== currentUser.sub && currentUser.role !== Role.DistrictAdmin) {
  //   return res.status(401).json({ message: 'Unauthorized' });
  // }
  classService
    .geClassById(req.params.id)
    .then((classInstance) => res.json(classInstance))
    .catch(next)
}

exports.updateSchema = (req, res, next) => {
  const schema = Joi.object({
    class_name: Joi.string().empty(''),
  })
  validateRequest(req, next, schema)
}

exports.updateClass = (req, res, next) => {
  ClassService.updateClass(req.params.id, req.body)
    .then((Class) => res.json(Class))
    .catch(next)
}

exports._deleteClass = (req, res, next) => {
  ClassService.deleteClass(req.params.id)
    .then(() => res.json({ message: 'Class deleted successfully' }))
    .catch(next)
}
