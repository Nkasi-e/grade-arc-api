const db = require('../_helpers/db')
const keysToCamel = require('../_helpers/keysToCarmelConverter')
const { Op } = require('sequelize')

module.exports = {
    getAllSolutions,
    create
}

async function getAllSolutions (limit, offset, id) {

    return await db.Solution.findAndCountAll({
        where: {studentId: id},
        limit,
        offset,
        attributes: ['id','file_url', 'answer',['created_at', 'submitted']],
    })

}

async function create (studentId, params) {
    params = keysToCamel(params)
    params.studentId = studentId
    params.assignmentId = parseInt(params.assignmentId)
    const assignment = await db.Assignment.findByPk(params.assignmentId)
    if(await db.Solution.findOne({
        where: {
            [Op.and] : {
                assignmentId: params.assignmentId,
                studentId: studentId
            }
        }
    })) throw 'You have already made submission for this assignment'

    if (
        params.assignmentId === NaN ||
        !(assignment)
    )
        throw 'Assignment does not exist'
    if(assignment.fileSubmission && !params.fileUrl) throw 'Upload file attachment as it is required for this assignment'

    // save assignment
    return await db.Solution.create(params)
}
