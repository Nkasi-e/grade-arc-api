module.exports = {
  getFileName,
  uploadFile,
  getUserFullName,
}
const mimeTypes = require('mime-types')
const uuid = require('uuid').v4
const fs = require('fs')
const path = require('path')

function getFileName(file) {
  let { type, name } = file

  // malicious attack protection
  type = type.replace(/[/\\]/, '')
  name = name.replace(/[/\\]/, '')

  let fileName = ''

  // getting file extension or file name from file metadata or fallback to uuid

  // get file extension from mime type
  const fileExtension = mimeTypes.extension(type)
  if (fileExtension) {
    fileName = `${uuid()}.${fileExtension}`
  } else if (name) {
    fileName = `${uuid()}-${name}`
  } else {
    fileName = uuid()
  }
  return fileName
}

function uploadFile(file) {
  const fileName = getFileName(file)

  fs.writeFileSync(
    path.join(__dirname, '../public/uploads/chat/', fileName),
    file.raw,
    {
      encoding: 'base64',
    },
  )

  return fileName
}

function getUserFullName(user) {
  return `${user.firstName} ${user.lastName}`
}
