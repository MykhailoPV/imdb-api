import express from "express";
import swaggerDocs from "./swagger";
import rateLimiter from "./middlewares/rateLimiter";

const API_KEY = process.env.API_KEY;
const PORT = 3001;

interface IMovie {
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
  Response: "True" | "False";
}


let favoritesMovies: IMovie[] = [];

const app = express();
app.use(express.json());
app.use(rateLimiter({ windowInSeconds: 60, maxRequests: 100 }));

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
app.get("/imdbSearchByName", async (req, res) => {
  const query = req.query.query;

  if (!query) {
    return res.status(400).json({ error: "Missing query parameter" });
  }

  const apiKey = req.headers.authorization || API_KEY;

  if (!apiKey) {
    return res.status(401).json({ error: "Missing API key. Please provide authorization header." });
  }

  try {
    const response = await fetch(
      `https://api.collectapi.com/imdb/imdbSearchByName?query=${encodeURIComponent(query as string)}`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
          authorization: `apikey ${apiKey}`,
        },
      }
    );

    const data = await response.json();

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch IMDB data" });
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
app.get("/imdbSearchById", async (req, res) => {
  const id = req.query.id;

  if (!id) {
    return res.status(400).json({ error: "Missing id parameter" });
  }

  const apiKey = req.headers.authorization || API_KEY;

  if (!apiKey) {
    return res.status(401).json({ error: "Missing API key. Please provide authorization header." });
  }

  try {
    const response = await fetch(
      `https://api.collectapi.com/imdb/imdbSearchById?movieId=${encodeURIComponent(id as string)}`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
          authorization: `apikey ${apiKey}`,
        },
      }
    );

    const data = await response.json();

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch IMDB data" });
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
app.post("/addFavoritesMoviesById", async (req, res) => {
  const id = req.query.id;

  if (!id) {
    return res.status(400).json({ error: "Missing id parameter" });
  }

  const apiKey = req.headers.authorization || API_KEY;

  if (!apiKey) {
    return res.status(401).json({ error: "Missing API key. Please provide authorization header." });
  }

  try {
    const response = await fetch(
      `https://api.collectapi.com/imdb/imdbSearchById?movieId=${encodeURIComponent(id as string)}`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
          authorization: `apikey ${apiKey}`,
        },
      }
    );

    const data = await response.json();

    favoritesMovies.push(data);

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch IMDB data" });
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
app.get("/getFavoritesMovies", async (req, res) => {
  res.json(favoritesMovies);
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
 */
app.delete("/deleteFromFavoritesMoviesById", async (req, res) => {
  const id = req.query.id;

  if (!id) {
    return res.status(400).json({ error: "Missing id parameter" });
  }

  const movie = favoritesMovies.find((movie) => movie.imdbID === id);

  if (!movie) {
    return res.status(404).json({ error: "Movie not found" });
  }

  favoritesMovies = favoritesMovies.filter((movie) => movie.imdbID === id);

  res.json(favoritesMovies);
});

swaggerDocs(app);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});