const notesRouter = require('express').Router()
const Note = require('../models/note')

notesRouter.get('/', (_req, res) => {
  console.log('--route handler called--')
  Note.find({}).then(notes => {
    res.json(notes)
  })
})

notesRouter.get('/:id', (req, res, next) => {
  const id = req.params.id
  Note.findById(id)
    .then(note => {
      if (!note) {
        return res.status(404).end()
      }
      console.log('note found:\n', note)
      res.json(note)
    })
    .catch(e => {next(e)})
})

notesRouter.delete('/:id', (req, res, next) => {
  const id = req.params.id
  Note.findByIdAndDelete(id)
    .then(() => {
      res.status(204).end()
    })
    .catch(e => next(e))
})

notesRouter.post('/', (req, res, next) => {
  const body = req.body

  const note = new Note({
    content: body.content,
    important: body.important || false
  })

  note.save()
    .then(savedNote => {
      console.log('note was saved in DB:\n', savedNote)
      res.json(savedNote)
    })
    .catch(e => next(e))
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