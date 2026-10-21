const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Note = require('../models/note')

const api = supertest(app)

const initialNotes = [
  {
    content: 'HTML is easy',
    important: false,
  },
  {
    content: 'Browser can execute only JavaScript',
    important: true,
  },
]

beforeEach(async () => {
  await Note.deleteMany({})
  let note = new Note(initialNotes[0])
  await note.save()
  note = new Note(initialNotes[1])
  await note.save()
})

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all notes are returned', async () => {
  const res = await api.get('/api/notes')
  assert.strictEqual(res.body.length, initialNotes.length)
})

test('a specific note is within the reutrned notes', async () => {
  const res = await api.get('/api/notes')

  const contents = res.body.map(e => e.content)
  assert.strictEqual(contents.includes('HTML is easy'), true)
})

after(async () => {
  await mongoose.connection.close()
})