const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Note = require('../models/note')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await Note.deleteMany({})
  let note = new Note(helper.initialNotes[0])
  await note.save()
  note = new Note(helper.initialNotes[1])
  await note.save()
})

test('all notes are returned', async () => {
  const notes = await helper.notesInDb()
  assert.strictEqual(notes.length, helper.initialNotes.length)
})

test('a specific note is within the reutrned notes', async () => {
  const notes = await helper.notesInDb()
  const contents = notes.map(n => n.content)
  assert.strictEqual(contents.includes('HTML is easy'), true)
})

describe('get /api/notes', () => {
  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
})

describe('post /api/notes', () => {
  test('a valid note can be added ', async () => {
    const newNote = {
      content: 'async/await simplifies making async calls',
      important: true,
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const notes = await helper.notesInDb()
    assert.strictEqual(notes.length, helper.initialNotes.length + 1)

    const contents = notes.map(n => n.content)
    assert(contents.includes('async/await simplifies making async calls'))
  })

  test('note without content is not added', async () => {
    const newNote = {
      important: true
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(400)

    const notes = await helper.notesInDb()

    assert.strictEqual(notes.length, helper.initialNotes.length)
  })
})

describe('get /api/notes/:id', () => {
  test('a specifc note can be viewed', async () => {
    // DBから全ノート取得して抽出した先頭のノートのidだけ使って、apiを叩くてテスト
    const notesAtStart = await helper.notesInDb()
    const noteToView = notesAtStart[0]

    const resultNote = await api
      .get(`/api/notes/${noteToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.deepStrictEqual(resultNote.body, noteToView)
  })
})

describe('delete /api/notes/:id', () => {
  test('a note can be deleted', async () => {
    const notesAtStart = await helper.notesInDb()
    const noteToDelete = notesAtStart[0]

    await api
      .delete(`/api/notes/${noteToDelete.id}`)
      .expect(204)

    const notesAtEnd = await helper.notesInDb()

    const ids = notesAtEnd.map(n => n.id)
    assert(!ids.includes(noteToDelete.id))

    assert.strictEqual(notesAtEnd.length, helper.initialNotes.length - 1)
  })
})

after(async () => {
  await mongoose.connection.close()
})