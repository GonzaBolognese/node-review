const express = require('express')
const crypto = require('node:crypto')
const moviesJSON = require('./movies.json')
const { validateMovie } = require('./schemas/movies')

const app = express()
app.disable('x-powered-by')

app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'Hola Mundo' })
})

app.get('/movies', (req, res) => {
  const { genre } = req.query
  if (genre) {
    const listGenre = moviesJSON.filter((m) => m.genre.some(g => g.toLowerCase() === genre.toLowerCase()))
    return res.status(200).json(listGenre)
  }
  return res.status(200).json(moviesJSON)
})

app.get('/movies/:id', (req, res) => {
  const { id } = req.params
  res.status(200).json(moviesJSON[id - 1])
})

app.post('/movies', (req, res) => {
  const result = validateMovie(req.body)

  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }
  const newMovie = {
    id: crypto.randomUUID(), // Esto crea un uuid v4
    ...result.data
  }

  // Esto hace que no sea REST, porque estamos guardando
  // El estado de la aplicación en memoria
  moviesJSON.push(newMovie)

  res.status(201).json(newMovie)
})

const PORT = process.env.PORT ?? 3000

app.listen(PORT, () => {
  console.log(`listening on port http://localhost:${PORT}`)
})
