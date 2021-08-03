const config = require('config.json')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const db = require('../_helpers/db')
const keysToCamel = require('../_helpers/keysToCarmelConverter')


module.exports = {
    getAllDistrict,
    getDistrictById,
    create,
    updateDistrict,
    deleteDistrict: _deleteDistrict
}


async function getAllDistrict () {
    return await db.District.findAll()
}

async function getDistrictById (id) {
    return await getDistrict(id)
}

async function create (params) {
    params = keysToCamel(params)
    // validate
    if (await db.District.findOne({ where: { districtName: params.districtName } })) {
        throw 'District "' + params.districtName + '" is already taken'
    }

    // save user
    await db.District.create(params)
}

async function updateDistrict (id, params) {
    const district = await getDistrict(id)
    params = keysToCamel(params)
    // validate
    const districtChanged = params.districtName && district.districtName !== params.districtName
    if (
        districtChanged &&
        (await db.District.findOne({ where: { districtName: params.districtName } }))
    ) {
        throw 'District "' + params.districtName + '" is already taken'
    }


    // copy params to user and save
    Object.assign(district, params)
    await district.save()

    return district.get()
}

async function _deleteDistrict (id) {
    const district = await getDistrict(id)
    await district.destroy()
}

// helper functions

async function getDistrict (id) {
    const district = await db.District.findByPk(id)
    if (!district) throw 'District not found'
    return district
}
