const notesRouter = require('express').Router()
const Note = require('../models/note')
const { info } = require('../utils/logger')

notesRouter.get('/', async (_req, res) => {
  info('--route handler called--')
  const notes = await Note.find({})
  res.json(notes)
})

notesRouter.get('/:id', (req, res, next) => {
  const id = req.params.id
  Note.findById(id)
    .then(note => {
      if (!note) {
        return res.status(404).end()
      }
      info('note found:\n', note)
      res.json(note)
    })
    .catch(e => {next(e)})
})

notesRouter.delete('/:id', async (req, res, next) => {
  const id = req.params.id

  Note.findByIdAndDelete(id)
    .then(() => {
      res.status(204).end()
    })
    .catch(e => next(e))
})

notesRouter.post('/',  async (req, res) => {
  const body = req.body

  const note = new Note({
    content: body.content,
    important: body.important || false
  })

  const savedNote = await note.save()  // await の throw は Express が自動で拾える
  res.status(201).json(savedNote)

  // プロミスチェーンよりエラーハンドラの分記述が少なく済む
  // note.save()
  //   .then(savedNote => {
  //     info('note was saved in DB:\n', savedNote)
  //     res.status(201).json(savedNote)
  //   })
  //   .catch(e => next(e))
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