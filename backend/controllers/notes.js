const notesRouter = require('express').Router()
const Note = require('../models/note')
const { info } = require('../utils/logger')

notesRouter.get('/', async (_req, res) => {
  info('--route handler called--')
  const notes = await Note.find({})
  res.json(notes)
})

notesRouter.get('/:id', async (req, res) => {
  const id = req.params.id

  const note = await Note.findById(id)
  if (!note) {
    return res.status(204).end()
  }
  res.json(note)
})

notesRouter.post('/',  async (req, res) => {
  const body = req.body

  const note = new Note({
    content: body.content,
    important: body.important || false
  })

  const savedNote = await note.save()  // await の throw は Express が自動で拾える
  res.status(201).json(savedNote)
})

notesRouter.delete('/:id', async (req, res) => {
  const id = req.params.id

  await Note.findByIdAndDelete(id)
  res.status(204).end()
})

notesRouter.put('/:id', (request, response, next) => {
  const { content, important } = request.body

  Note.findById(request.params.id)
    .then(note => {
      if (!note) {
        return response.status(404).end()
      }

      note.content = content
      note.important = important

      return note.save().then((updatedNote) => {
        response.json(updatedNote)
      })
    })
    .catch(error => next(error))
})

module.exports = notesRouter