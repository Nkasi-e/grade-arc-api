const jwt = require('jsonwebtoken')
const { secret } = require('../../config.json')

const {
  Teacher,
  Student,
  Parents,
  DistrictAdmin,
} = require('../../_middleware/role')

const { getById } = require('../../services/userService')

module.exports = async function (socket, next) {
  const token = socket.handshake.auth.token

  // Throw Unauthorized if token is absent, invlid or user doesn't have the permission.
  if (token) {
    try {
      const data = jwt.verify(token, secret)
      const roles = [
        ...Object.values({ Teacher, Student, Parents, DistrictAdmin }),
      ]
      if (roles.includes(data.role)) {
        const user = await getById(data.sub)
        if(user) {
          socket.user = user.get()
          return next()
        }
        return next(new Error('Unauthorized'))
      } else {
        return next(new Error('Unauthorized'))
      }
    } catch (error) {
      return next(new Error('Unauthorized'))
    }
  }
  next(new Error('Unauthorized'))
}
