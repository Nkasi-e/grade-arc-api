const Joi = require('joi')
const validateRequest = require('../_middleware/validate-request')
const schoolService = require('../services/schoolService')

exports.createSchema = (req, res, next) => {
  const schema = Joi.object({
    course_name: Joi.string().required(),
    district_id: Joi.string().required(),
  })
  validateRequest(req, next, schema)
}

exports.createSchool = (req, res, next) => {
  schoolService
    .create(req.body)
    .then(() => res.json({ message: 'School Added successful' }))
    .catch(next)
}

exports.getAllSchoolByDistrictName = (req, res, next) => {
  schoolService
    .getAllSchoolByDistrictName(req.params.district_name)
    .then((schools) => res.json(schools))
    .catch(next)
}

exports.getAllSchool = (req, res, next) => {
  schoolService
    .getAllSchool()
    .then((schools) => res.json(schools))
    .catch(next)
}

exports.getSchoolById = (req, res, next) => {
  // const currentUser = req.user;
  // const id = parseInt(req.params.id);
  // // only allow admins to access other user records
  // if (id !== currentUser.sub && currentUser.role !== Role.SchoolAdmin) {
  //   return res.status(401).json({ message: 'Unauthorized' });
  // }
  schoolService
    .getSchoolById(req.params.id)
    .then((school) => res.json(school))
    .catch(next)
}

exports.updateSchema = (req, res, next) => {
  const schema = Joi.object({
    school_name: Joi.string(),
    district_id: Joi.string(),
  })
  validateRequest(req, next, schema)
}

exports.updateSchool = (req, res, next) => {
  schoolService
    .updateSchool(req.params.id, req.body)
    .then((school) => res.json(school))
    .catch(next)
}

exports._deleteSchool = (req, res, next) => {
  schoolService
    .deleteSchool(req.params.id)
    .then(() => res.json({ message: 'School deleted successfully' }))
    .catch(next)
}
