import express, { json } from 'express'
import { createMovieRouter } from './routes/movies.js'
import { corsMiddleware } from './middlewares/cors.js'
import { MovieModel } from './models/mysql/movie.js'

export const createApp = ({ movieModel }) => {
  const app = express()
  app.disable('x-powered-by')
  app.use(json())
  app.use(corsMiddleware())

  app.use('/movies', createMovieRouter({ movieModel: MovieModel }))

  const PORT = process.env.PORT ?? 3000

  app.listen(PORT, () => {
    console.log(`listening on port http://localhost:${PORT}`)
  })
}
