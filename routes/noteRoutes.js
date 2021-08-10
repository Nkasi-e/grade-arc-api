const express = require('express')
const router = express.Router()
const noteController = require('../controllers/noteController')
const authorize = require('../_middleware/authorize')
const Role = require('../_middleware/role')
const {
  readNote,
  saveNote,
  getAllNotes,
  getNoteById,
  downloadNote,
  updateNote,
  createNote,
  updateNoteSchema,
  _deleteNote,
  createNoteSchema,
  saveNoteSchema,
  createFolder,
} = noteController

router.post(
  '/note/create_folder',
  authorize([Role.DistrictAdmin]),
  createFolder,
)

// Routes
router.post(
  '/note/create',
  authorize([Role.DistrictAdmin]),
  createNoteSchema,
  createNote,
)
router.put(
  '/note/:id',
  authorize([Role.DistrictAdmin]),
  updateNoteSchema,
  updateNote,
)
router.delete('/note/:id', authorize([Role.DistrictAdmin]), _deleteNote)
router.get('/note/:id', authorize([Role.DistrictAdmin]), getNoteById)
router.get('/note/read/:note_name', authorize([Role.DistrictAdmin]), readNote)
router.get('/notes', authorize([Role.DistrictAdmin]), getAllNotes)
router.put(
  '/note/save/:note_name',
  authorize([Role.DistrictAdmin]),
  saveNoteSchema,
  saveNote,
)
router.put('/note/makeShared/:id', authorize([Role.DistrictAdmin]), saveNote)
router.get('/note/download/:id', downloadNote)

module.exports = router
