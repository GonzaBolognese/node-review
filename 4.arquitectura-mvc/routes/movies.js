import { Router } from 'express'
import { MovieController } from '../controllers/movies.js'

const moviesRouter = Router()

moviesRouter.get('/', MovieController.getAll)
moviesRouter.get('/:id', MovieController.getById)
moviesRouter.post('/', MovieController.create)
moviesRouter.delete('/:id', MovieController.delete)
moviesRouter.patch('/:id', MovieController.patch)

export default moviesRouter
