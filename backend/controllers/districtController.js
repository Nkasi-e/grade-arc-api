const Joi = require('joi')
const validateRequest = require('../_middleware/validate-request')
const districtService = require('../services/districtService')

exports.createSchema = (req, res, next) => {
    const schema = Joi.object({
        district_name: Joi.string().required()
    })
    validateRequest(req, next, schema)
}

exports.createDistrict = (req, res, next) => {
    districtService
        .create(req.body)
        .then(() => res.json({ message: 'District Added successful' }))
        .catch(next)
}

exports.getAllDistrict = (req, res, next) => {
    districtService
        .getAllDistrict()
        .then(districts => res.json(districts))
        .catch(next)
}

exports.getDistrictById = (req, res, next) => {
    // const currentUser = req.user;
    // const id = parseInt(req.params.id);
    // // only allow admins to access other user records
    // if (id !== currentUser.sub && currentUser.role !== Role.DistrictAdmin) {
    //   return res.status(401).json({ message: 'Unauthorized' });
    // }
    districtService
        .getDistrictById(req.params.id)
        .then(district => res.json(district))
        .catch(next)
}

exports.updateSchema = (req, res, next) => {
    const schema = Joi.object({
        district_name: Joi.string().empty(''),
    })
    validateRequest(req, next, schema)
}

exports.updateDistrict = (req, res, next) => {
    districtService
        .updateDistrict(req.params.id, req.body)
        .then(district => res.json(district))
        .catch(next)
}

exports._deleteDistrict = (req, res, next) => {
    districtService
        .deleteDistrict(req.params.id)
        .then(() => res.json({ message: 'District deleted successfully' }))
        .catch(next)
}
