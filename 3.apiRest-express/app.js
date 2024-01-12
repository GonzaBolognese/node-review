const express = require('express')
const moviesJSON = require('./movies.json')

const app = express()
app.disable('x-powered-by')

app.get('/', (req, res) => {
  res.json({ message: 'Hola Mundo' })
})

app.get('/movies', (req, res) => {
  const { genre } = req.query
  const listGenre = moviesJSON.filter((m) => m.genre.includes(genre))
  if (listGenre.length !== 0) return res.status(200).json(listGenre)
  res.status(200).json(moviesJSON)
})

app.get('/movies/:id', (req, res) => {
  const { id } = req.params
  res.status(200).json(moviesJSON[id - 1])
})

const PORT = process.env.PORT ?? 3000

app.listen(PORT, () => {
  console.log(`listening on port http://localhost:${PORT}`)
})
