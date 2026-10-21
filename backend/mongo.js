/*
 * mongoDB atlas・mongooseを使ったmongoDbエクササイズ
 */
const { MONGODB_URI } = require('./utils/config')
const mongoose = require('mongoose')

mongoose.set('strictQuery',false)

// 1. DBに接続
mongoose.connect(MONGODB_URI, { family: 4 })
  .then(() => {
    console.log('connected\n')
  })
  .catch(e => {
    console.log(e)
  })

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

// 2. モデルの作成
const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: 'HTML is easy',
  important: true,
})

// 3. ドキュメントをDBに保存 & DBから切断
note.save().then(() => {
  console.log('note saved!')
  mongoose.connection.close()
})