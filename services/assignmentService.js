const db = require('../_helpers/db')
const keysToCamel = require('../_helpers/keysToCarmelConverter')


module.exports = {
    getAllAssignments,
    create
}

async function getAllAssignments (limit, offset) {

    return await db.Assignment.findAndCountAll({
        limit,
        offset,
        attributes: ['id','question', 'due_date',['file_submission', 'upload_files'], ['created_at', 'created']],
        include: [
            {
                model: db.Solution,
                attributes: ['answer', ['created_at', 'submitted'], 'file_url'],
                include: [
                    {
                        model: db.User,
                        as: 'student',
                        attributes: ['first_name', 'last_name']
                    }
                ]
            }
        ]
    })

}

async function create (teacherId, params) {
    params = keysToCamel(params)
    params.teacherId = teacherId
    params.dueDate = new Date(params.dueDate)
    if(params.dueDate <= new Date()) throw 'Due date must be greater than current date'
    // save assignment
    return await db.Assignment.create(params)
}
