const Joi = require('joi')
const validateRequest = require('../_middleware/validate-request')
const noteService = require('../services/noteService')

exports.createNoteSchema = (req, res, next) => {
  const schema = Joi.object({
    note_name: Joi.string().required(),
    // shared_note: Joi.string().optional(),
  })
  validateRequest(req, next, schema)
}
exports.makeNoteSharedSchema = (req, res, next) => {
  const schema = Joi.object({
    id: Joi.number().required(),
  })
  validateRequest(req, next, schema)
}
exports.saveNoteSchema = (req, res, next) => {
  const schema = Joi.object({
    content: Joi.string().required(),
  })
  validateRequest(req, next, schema)
}

exports.makeNoteShared = (req, res, next) => {
  noteService
    .makeNoteShared(req.params.id)
    .then(() => res.json({ message: 'Note made shared succesfully' }))
    .catch(next)
}

exports.updateNoteSchema = (req, res, next) => {
  const schema = Joi.object({
    note_name: Joi.string().required(),
  })
  validateRequest(req, next, schema)
}

exports.createFolder = (req, res, next) => {
  noteService
    .createFolder(req.user.ClassId)
    .then(() => res.json({ message: 'Folder Added successful' }))
    .catch(next)
}

exports.createNote = (req, res, next) => {
  noteService
    .createNote(req.body, req.user.ClassId, req.user.id)
    .then((note) => res.json({ note, message: 'Note created successful' }))
    .catch(next)
}

exports.getAllNotes = (req, res, next) => {
  noteService
    .getAllNotes(req.user.id)
    .then((notes) => res.json(notes))
    .catch(next)
}

exports.getNoteById = (req, res, next) => {
  noteService
    .getNoteById(req.params.id)
    .then((note) => res.json(note))
    .catch(next)
}

exports.updateNote = (req, res, next) => {
  noteService
    .updateNote(req.body, req.params.id)
    .then((note) => res.json(note))
    .catch(next)
}

exports._deleteNote = (req, res, next) => {
  noteService
    .deleteNote(req.params.id)
    .then(() => res.json({ message: 'Note deleted successfully' }))
    .catch(next)
}

// exports.writeNote = (req, res, next) => {
//   noteService
//     .writeNote(req.body.content, req.params.note_name, req.user.id)
//     .then(() => res.json({ message: 'Message edited succesfully' }))
//     .catch(next)
// }
exports.readNote = (req, res, next) => {
  noteService
    .readNote(req.params.note_name, req.user.id)
    .then((note) => res.json({ note }))
    .catch(next)
}
exports.saveNote = (req, res, next) => {
  noteService
    .saveNote(req.body.content, req.params.note_name, req.user.id)
    .then(() => res.json({ message: 'Note saved succesfully' }))
    .catch(next)
}

exports.downloadNote = (req, res, next) => {
  noteService
    .downloadNote(req.params.id)
    .then((pathToFile) => {
      res.download(pathToFile)
    })
    .catch(next)
}
