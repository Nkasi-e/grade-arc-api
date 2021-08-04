const Joi = require('joi')
const validateRequest = require('../_middleware/validate-request')
const courseService = require('../services/courseService')

exports.createSchema = (req, res, next) => {
  const schema = Joi.object({
    course_name: Joi.string().required(),
  })
  validateRequest(req, next, schema)
}

exports.createCourse = (req, res, next) => {
  courseService
    .create(req.body)
    .then(() => res.json({ message: 'Course Added successful' }))
    .catch(next)
}

exports.getAllCourses = (req, res, next) => {
  courseService
    .getAllCourses()
    .then((courses) => res.json(courses))
    .catch(next)
}

exports.getAllCoursesBySchoolName = (req, res, next) => {
  courseService
    .getAllCoursesBySchoolName(req.params.school_name)
    .then((courses) => res.json(courses))
    .catch(next)
}

exports.getCourseById = (req, res, next) => {
  // const currentUser = req.user;
  // const id = parseInt(req.params.id);
  // // only allow admins to access other user records
  // if (id !== currentUser.sub && currentUser.role !== Role.DistrictAdmin) {
  //   return res.status(401).json({ message: 'Unauthorized' });
  // }
  courseService
    .geCourseById(req.params.id)
    .then((course) => res.json(course))
    .catch(next)
}

exports.updateSchema = (req, res, next) => {
  const schema = Joi.object({
    course_name: Joi.string().empty(''),
  })
  validateRequest(req, next, schema)
}

exports.updateCourse = (req, res, next) => {
  courseService
    .updatecourse(req.params.id, req.body)
    .then((course) => res.json(course))
    .catch(next)
}

exports._deleteCourse = (req, res, next) => {
  courseService
    .deleteCourse(req.params.id)
    .then(() => res.json({ message: 'Course deleted successfully' }))
    .catch(next)
}
