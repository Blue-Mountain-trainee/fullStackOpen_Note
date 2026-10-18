const app = require('./app')
const { PORT: port } = require('./utils/config')
const { info } = require('./utils/logger')

app.get('/', (_req, res) => {
  res.send('<h1>Hello world!</h1>')
})

app.listen(port, () => {
  info(`Server runnning on port ${port}...`)
})
