<!-- Workflow -->

<!-- User joins a room -->

Client:
socket.emit('room:join', {
userName: <String>,
roomName: <String>
})

Server:
socket.emit('room:joined', {
messages: [{
id: <Number>,
messageText: <String>,
author: <String>,
created_at: <Number>,
roomName: <String>,
isMessageEdited: null || true,
isMessageFile: null || true,
}] | undefined, userName: <String> | undefined, you: <Boolean> | undefined
})

<!-- Server will send "messages" array to the new socket and "userName" to everyone else -->
<!-- if isMessageFile is true then messageText will have the name of an uploaded file -->
<!-- In case there is an error on server: -->

Server:
socket.emit('room:join:failed', {
error: <String>
})

<!-- Send a message -->

Client:
socket.emit('message:send', {
roomName: <String>,
author: <String>,
messageText: <String>,
isMessageFile: true | undefined,
file: undefined | Object
})

<!-- to send a file to server use something like this -->

el.onchange = function (e) {
const files = [...this.files]
files.forEach((file) => {
const reader = new FileReader()
reader.readAsDataURL(file)
reader.onload = function () {
socket.emit('message:send', {
isMessageFile: true,
author: 'lenon',
file: {
raw: reader.result.split(',')[1],
type: file.type,
name: file.name,
},
})
}
})
}

Server:
socket.emit('message:sent', {
author: <String>,
messageText: <String>,
messageId: <Number>
})

<!-- reply to a message -->

Client:
socket.emit('message:reply', {
author: <String>,
roomName: <String>,
parentId: <Number>,
messageText: <String>
isMessageFile: true | undefined,
file: undefined | Object
})

Server:
socket.emit('message:replied', {
author: <String>,
messageText: <String>,
messageId: <Number>,
parentId: <Number>,
isMessageFile: true | undefined,
})

<!-- Edit message -->

Client:
socket.emit('message:edit', {
roomName: <String>,
messageId: <Number>,
messageText: <String>,
author: <String>,
isMessageFile: true | undefined,
file: undefined | Object
})

<!-- If sending a file it's almost the same  -->

el.onchange = function (e) {
const files = [...this.files]
files.forEach((file) => {
const reader = new FileReader()
reader.readAsDataURL(file)
reader.onload = function () {
socket.emit('message:edit', {
messageId: 3,
isMessageFile: true,
author: 'john',
file: {
raw: reader.result.split(',')[1],
type: file.type,
name: file.name,
},
})
}
})
}

Server:
socket.emit('message:edit', {
messageId: <Number>,
messageText: <String>,
author: <String>,
isMessageFile: true | undefined,
isMessageEdited: true
})

<!-- delete message -->

Client:
socket.emit('delete:delete' {
messageId: <Number>,
isMessageFile: undefined | true
})

Server
socket.emit('delete:delete' {
messageId: <Number>,
})

<!-- Failure -->

Server:
socket.emit('message:failed', {
error: <String>
})
