import mysql from 'mysql2/promise'

const config = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: '5566',
  database: 'moviesdb'
}

const connection = await mysql.createConnection(config)

export class MovieModel {
  static async getAll ({ genre }) {
    if (genre) {
      const lowerCaseGenre = genre.toLowerCase()
      const result = []

      const [genreDB] = await connection.query(
        'SELECT id FROM genre WHERE LOWER(title) = ?;',
        [lowerCaseGenre]
      )

      const [movies] = await connection.query(
        'SELECT BIN_TO_UUID(movie_id) movie_id FROM movie_genre WHERE genre_id=?;',
        [genreDB[0].id]
      )

      await movies.map(async m => {
        const [movieData] = await connection.query(
          'SELECT BIN_TO_UUID(id) id, title, year, director, duration, poster, rate FROM movie WHERE BIN_TO_UUID(id)=?;',
          [m.movie_id]
        )
        result.push(movieData)
      })

      console.log(result)
    } else {
      const [movies] = await connection.query(
        'SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id FROM movie;'
      )

      console.log(movies)
    }
  }

  static async getById ({ id }) {
    const [movie] = await connection.query(
      'SELECT BIN_TO_UUID(id) id, title, year, director, duration, poster, rate FROM movie WHERE BIN_TO_UUID(id) = ?;',
      [id]
    )

    return movie[0]
  }

  static async create ({ input }) {
    const {
      title,
      year,
      director,
      duration,
      poster,
      rate
    } = input

    const [uuidResult] = await connection.query('SELECT UUID() uuid;')
    const [{ uuid }] = uuidResult

    try {
      await connection.query(
        `INSERT INTO movie (id, title, year, director, duration, poster, rate)
          VALUES (UUID_TO_BIN("${uuid}"), ?, ?, ?, ?, ?, ?);`,
        [title, year, director, duration, poster, rate]
      )
    } catch (e) {
      // puede enviarle información sensible
      throw new Error('Error creating movie')
    }

    const [movies] = await connection.query(
      `SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id
        FROM movie WHERE id = UUID_TO_BIN(?);`,
      [uuid]
    )

    return movies[0]
  }

  static async delete ({ id }) {

  }

  static async update ({ id, input }) {

  }
}
