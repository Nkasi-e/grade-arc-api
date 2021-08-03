const db = require('../_helpers/db')

const pdf = require('html-pdf')

const classService = require('./classService')

module.exports = {
  getAllNotes,
  writeNote,
  readNote,
  getNoteById,
  downloadNote,
  createNote,
  createFolder,
  saveNote,
  updateNote,
  makeNoteShared,
  deleteNote: _deleteNote,
}

const uuid = require('uuid').v4

const path = require('path')
const fs = require('fs')

async function getAllNotes(userId) {
  return await db.Note.findAll({
    where: {
      userId,
    },
  })
}

async function getNoteById(id) {
  return await getNote(id)
}

async function createFolder(classId) {
  const classItem = await classService.getClassById(classId)

  // check if a folder for the current class is present
  if (!(await db.NoteFolder.findOne({ where: { class_id: classItem.id } }))) {
    const folderName = `${classItem.classInstance}-${uuid()}`
    fs.mkdirSync(path.join(__dirname, '../public/uploads/notes/', folderName))

    await db.NoteFolder.create({
      folderName,
      classId: classItem.id,
    })
  }
}

async function createNote(params, classId, userId) {
  // params.note_name = params.note_name.replace(/[/\\]/, '')
  console.log({ params })
  // validate
  if (
    await db.Note.findOne({ where: { noteName: params.note_name, userId } })
  ) {
    throw 'Note "' + params.note_name + '" is already taken'
  }
  console.log('expected')

  const classItem = await classService.getClassById(classId)

  // if (!classItem) {
  //   throw 'not found'
  // }

  const noteFolder = await db.NoteFolder.findOne({
    where: { classId: classItem.id },
    attributes: ['id'],
  })
  // save note
  return await db.Note.create({
    noteName: params.note_name,
    noteFolderId: noteFolder.id,
    userId,
  })
}

async function writeNote(content, noteName, userId) {
  content = content.replace(/<script>.*<\/script>/gi, '')
  const note = await db.Note.findOne({
    where: {
      noteName,
      userId,
    },
  })
  note.content = content
  await note.save()
  return note
}

async function saveNote(content, noteName, userId) {
  const note = await writeNote(content, noteName, userId)
  // get the folder the note belongs to
  const noteFolder = await getFolder(note.noteFolderId)
  const pathToFile = path.join(
    __dirname,
    '../public/uploads/notes',
    noteFolder.folderName,
    `${note.noteName}.pdf`,
  )

  pdf.create(note.content).toStream((err, stream) => {
    if (err) throw err
    stream.pipe(fs.createWriteStream(pathToFile))
  })
}

async function makeNoteShared(id) {
  await db.Note.update(
    {
      sharedNote: true,
    },
    {
      where: {
        id,
      },
    },
  )
}

async function readNote(noteName, userId) {
  const note = await db.Note.findOne({
    where: {
      noteName,
      userId,
    },
  })
  return note.get()
}

async function updateNote(params, id) {
  const note = await db.Note.findOne({
    where: {
      id,
    },
    attributes: { exclude: ['content'] },
  })

  // validate
  const noteChanged = note.noteName !== params.note_name

  if (
    noteChanged &&
    (await db.Note.findOne({
      where: { noteName: params.note_name },
    }))
  ) {
    throw 'Note "' + params.note_name + '" is already taken'
  }

  Object.assign(note, params)
  await note.save()
  return note.get()
}

async function getFolder(id) {
  const noteFolder = await db.NoteFolder.findByPk(id)
  if (!noteFolder) throw 'Note not found'
  return noteFolder
}

async function _deleteNote(id) {
  await db.Note.destroy({
    where: {
      id,
    },
  })
}

async function getNote(id) {
  const note = await db.Note.findByPk(id)
  if (!note) throw 'Note not found'
  return note
}

async function downloadNote(id) {
  const note = await getNote(id)
  const noteFolder = await getFolder(note.noteFolderId)

  const pathToFile = path.join(
    __dirname,
    '../public/uploads/notes',
    noteFolder.folderName,
    `${note.noteName}.pdf`,
  )

  return pathToFile
}
