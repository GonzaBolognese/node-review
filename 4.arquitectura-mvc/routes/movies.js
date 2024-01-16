import { Router } from 'express'
import { validateMovie, validatePartialMovie } from '../schemas/movies.js'
import { randomUUID } from 'node:crypto'

import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const moviesJSON = require('../movies.json')

const moviesRouter = Router()

moviesRouter.get('/', (req, res) => {
  const { genre } = req.query
  if (genre) {
    const listGenre = moviesJSON.filter((m) => m.genre.some(g => g.toLowerCase() === genre.toLowerCase()))
    return res.status(200).json(listGenre)
  }
  return res.status(200).json(moviesJSON)
})

moviesRouter.get('/:id', (req, res) => {
  const { id } = req.params
  const movie = moviesJSON.find(movie => movie.id === id)
  if (movie) return res.json(movie)
  res.status(404).json({ message: 'Movie not found' })
})

moviesRouter.post('/', (req, res) => {
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

moviesRouter.patch('/:id', (req, res) => {
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

moviesRouter.delete('/:id', (req, res) => {
  const { id } = req.params
  const movieIndex = moviesJSON.findIndex(m => m.id === id)

  if (movieIndex < 0) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  moviesJSON.splice(movieIndex, 1)

  return res.json({ message: 'Movie deleted' })
})
