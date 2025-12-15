import express from 'express';
import { db } from '../config/firebase';
import swaggerDocs from './swagger';
import rateLimiter from './middlewares/rateLimiter';

const API_KEY = process.env.API_KEY;
const PORT = 3001;

const DB_COLLECTION = db.collection('favouriteMovies');

interface IMovie {
  result: {
    Title: string;
    Year: string;
    Rated: string;
    Released: string;
    Runtime: string;
    Genre: string;
    Director: string;
    Writer: string;
    Actors: string;
    Plot: string;
    Language: string;
    Country: string;
    Awards: string;
    Poster: string;
    Ratings: {
      Source: string;
      Value: string;
    }[];
    Metascore: string;
    imdbRating: string;
    imdbVotes: string;
    imdbID: string;
    Type: string;
    DVD: string;
    BoxOffice: string;
    Production: string;
    Website: string;
    Response: 'True' | 'False';
  };
}

const app = express();

app.use(express.json());
app.use(rateLimiter({
  windowInSeconds: 60, maxRequests: 100,
}));

/**
 * @swagger
 * /imdbSearchByName:
 *   get:
 *     summary: Search IMDB by movie name
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - name: query
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie name to search for
 *     responses:
 *       200:
 *         description: IMDB search results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Missing query parameter
 *       401:
 *         description: Missing or invalid API key
 *       500:
 *         description: Failed to fetch IMDB data
 */
app.get('/imdbSearchByName', async (req, res) => {
  const query = req.query.query;

  if (!query) {
    return res.status(400).json({ error: 'Missing query parameter' });
  }

  const apiKey = req.headers.authorization || API_KEY;

  if (!apiKey) {
    return res.status(401).json({ error: 'Missing API key. Please provide authorization header.' });
  }

  try {
    const response = await fetch(
      `https://api.collectapi.com/imdb/imdbSearchByName?query=${encodeURIComponent(query as string)}`,
      {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          authorization: `apikey ${apiKey}`,
        },
      },
    );

    const data = await response.json();

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error || 'Failed to fetch IMDB data' });
  }
});

/**
 * @swagger
 * /imdbSearchByID:
 *   get:
 *     summary: Search IMDB by movie id
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - name: id
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie id to search for
 *     responses:
 *       200:
 *         description: IMDB search results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Missing query parameter
 *       401:
 *         description: Missing or invalid API key
 *       500:
 *         description: Failed to fetch IMDB data
 */
app.get('/imdbSearchById', async (req, res) => {
  const id = req.query.id;

  if (!id) {
    return res.status(400).json({ error: 'Missing id parameter' });
  }

  const apiKey = req.headers.authorization || API_KEY;

  if (!apiKey) {
    return res.status(401).json({ error: 'Missing API key. Please provide authorization header.' });
  }

  try {
    const response = await fetch(
      `https://api.collectapi.com/imdb/imdbSearchById?movieId=${encodeURIComponent(id as string)}`,
      {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          authorization: `apikey ${apiKey}`,
        },
      },
    );

    const data = await response.json();

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error || 'Failed to fetch IMDB data' });
  }
});

/**
 * @swagger
 * /addFavoritesMoviesById:
 *   post:
 *     summary: Add favorite movie by id
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - name: id
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie id to search for
 *     responses:
 *       200:
 *         description: Favorite movie added
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Missing id parameter
 *       401:
 *         description: Missing or invalid API key
 *       500:
 *         description: Failed to fetch IMDB data
 */
app.post('/addFavoritesMoviesById', async (req, res) => {
  const id = req.query.id;

  if (!id) {
    return res.status(400).json({ error: 'Missing id parameter' });
  }

  const apiKey = req.headers.authorization || API_KEY;

  if (!apiKey) {
    return res.status(401).json({ error: 'Missing API key. Please provide authorization header.' });
  }

  let response;

  try {
    response = await fetch(
      `https://api.collectapi.com/imdb/imdbSearchById?movieId=${encodeURIComponent(id as string)}`,
      {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          authorization: `apikey ${apiKey}`,
        },
      },
    );
  } catch (error) {
    return res.status(500).json({ error: error || 'Failed to fetch IMDB data' });
  }

  try {
    const data: IMovie = await response.json();

    await DB_COLLECTION.doc(data.result.imdbID).set(data);

    res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error || 'Failed to add favorite movie' });
  }
});

/**
 * @swagger
 * /getFavoritesMovies:
 *   get:
 *     summary: Get favorite movies
 *     responses:
 *       200:
 *         description: Favorite movies List
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
app.get('/getFavoritesMovies', async (req, res) => {
  const favoriteMoviesSnapshot = await DB_COLLECTION.get();

  const favoriteMovies = favoriteMoviesSnapshot.docs.map((favoriteMovie) => ({
    id: favoriteMovie.id,
    ...favoriteMovie.data(),
  }));

  res.status(200).json(favoriteMovies);
});

/**
 * @swagger
 * /deleteFromFavoritesMoviesById:
 *   delete:
 *     summary: Delete favorite movie by id
 *     parameters:
 *       - name: id
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie id to delete
 *     responses:
 *       200:
 *         description: Movie deleted successfully
 */
app.delete('/deleteFromFavoritesMoviesById', async (req, res) => {
  const id = req.query.id;

  if (!id) {
    return res.status(400).json({ error: 'Missing id parameter' });
  }

  const movieSnapshot = await DB_COLLECTION.doc(id as string).get();

  if (!movieSnapshot.exists) {
    return res.status(404).json({ error: 'Movie not found' });
  }

  DB_COLLECTION.doc(id as string).delete();

  res.json({ message: 'Movie deleted successfully' });
});

swaggerDocs(app);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
