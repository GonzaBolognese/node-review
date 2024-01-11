const express = require('express')
const dittoJSON = require('./pokemon/ditto.json')
const app = express()
app.disable('x-powered-by')

app.use((req, rest, next) => {
  if (req.method !== 'POST') return next()
  if (req.headers['Content-Type'] !== 'aplicattion/json') return next()

  let body = ''

  req.on('data', chunk => {
    body += chunk.toString()
  })

  req.on('end', () => {
    const data = JSON.parse(body)
    req.body = data
    next()
  })
})

const PORT = process.env.PORT ?? 1234

app.get('/', (req, res) => {
  res.status(200).send('<h1>Mi pagina</h1>')
})

app.get('/pokemon/ditto', (req, res) => {
  res.status(200).json(dittoJSON)
})

app.post('/pokemon', (req, res) => {
  let body = ''
  req.on('data', chunk => {
    body += chunk.toString()
  })

  req.on('end', () => {
    const data = JSON.parse(body)
    res.status(201).json(data)
  })
})

app.use((req, res) => {
  res.status(404).send('<h1>Error 404</h1>')
})

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})
