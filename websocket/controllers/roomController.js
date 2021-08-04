module.exports = {
  joinRoom,
}

const { getUserFullName } = require('../helpers')

const { getChatData } = require('../services/roomService')
const { userJoinsSchema } = require('../validation/schemas')

// const users = []
async function joinRoom(socket, data) {
  const { error } = userJoinsSchema.validate(data)

  if (error) {
    return socket.emit('room:join:failed', { error })
  }

  const { roomName } = data
  const userName = getUserFullName(socket.user)

  // const userIndex = users.findIndex((user) => user.userId === socket.user.id)
  // if (userIndex === -1) {
  //   users.push({
  //     userName,
  //     roomName,
  //     userId: socket.user.id,
  //   })
  // }

  // const onlineUsersInThisRoom = users.filter(
  //   (user) => user.roomName === roomName,
  // )

  getChatData(roomName, socket.user.ClassId)
    .then((data) => {
      socket.join(roomName)
      socket.emit('room:joined', { ...data, you: true })
      socket.broadcast.to(roomName).emit('room:joined', {
        you: false,
        userName,
      })
    })
    .catch((error) => {
      console.log(error)
      socket.emit('room:join:failed', { error })
    })
}

// async function leaveRoom(socket) {
//   const userIndex = users.findIndex((user) => user.userId === socket.user.id)
//   if (userIndex !== -1) {
//     users.splice(userIndex, 1)
//     socket.broadcast.to(users[userIndex].roomName).emit('room:left', {
//       userName: getUserFullName(socket.user),
//     })
//   }
// }
