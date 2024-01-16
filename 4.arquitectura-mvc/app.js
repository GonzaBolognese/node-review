import express, { json } from 'express'
import { randomUUID } from 'node:crypto'
import cors from 'cors'
import { validateMovie, validatePartialMovie } from './schemas/movies.js'

// Como leer un json en ESModules
// import fs from 'node:fs'
// const moviesJSON = JSON.parse(fs.readFileSync('./movies.json', 'utf-8'))

// Como leer un json en ESModules recomendado:
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const moviesJSON = require('./movies.json')

const app = express()
app.disable('x-powered-by')
app.use(json())
app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      'http://localhost:8080',
      'http://localhost:3000',
      'https://gonzalo-bolognese.vercel.app/'
    ]
    if (ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, true)
    }

    if (!origin) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  }
}))

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
  const movie = moviesJSON.find(movie => movie.id === id)
  if (movie) return res.json(movie)
  res.status(404).json({ message: 'Movie not found' })
})

app.post('/movies', (req, res) => {
  const result = validateMovie(req.body)

  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }
  const newMovie = {
    id: randomUUID(), // Esto crea un uuid v4
    ...result.data
  }

  moviesJSON.push(newMovie)

  res.status(201).json(newMovie)
})

app.delete('/movies/:id', (req, res) => {
  const { id } = req.params
  const movieIndex = moviesJSON.findIndex(m => m.id === id)

  if (movieIndex < 0) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  moviesJSON.splice(movieIndex, 1)

  return res.json({ message: 'Movie deleted' })
})

app.patch('/movies/:id', (req, res) => {
  const result = validatePartialMovie(req.body)

  if (result.error) {
    res.status(400).json({ message: JSON.parse(result.error.message) })
  }

  const { id } = req.params
  const movieIndex = moviesJSON.findIndex(m => m.id === id)

  if (movieIndex < 0) {
    return res.status(400).json({ message: 'Movie not found' })
  }

  const updateMovie = {
    ...moviesJSON[movieIndex],
    ...result.data
  }

  moviesJSON[movieIndex] = updateMovie

  return res.json(updateMovie)
})

const PORT = process.env.PORT ?? 3000

app.listen(PORT, () => {
  console.log(`listening on port http://localhost:${PORT}`)
})
