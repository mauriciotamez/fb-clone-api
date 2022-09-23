const { app } = require('./app')

const PORT = process.env.PORT || 4900
const HOST = process.env.HOST || 'localhost'

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://${HOST}:${PORT}.`)
})
