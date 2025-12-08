# 🎬 IMDB API

A RESTful API service that provides movie search functionality and favorites management using the CollectAPI IMDB database. Built with Node.js, Express, and includes comprehensive Swagger documentation.

## 🚀 Getting Started
### 🔑 Getting Your API Key

1. Visit [CollectAPI IMDB API](https://collectapi.com/api/imdb/imdb-api?tab=pricing)
2. Sign up for a free account
3. Subscribe to the IMDB API (free tier available)
4. Copy your API key from the dashboard
5. Your API key will be in the format: `apikey YOUR_API_KEY_HERE`

### 📦 Installation

#### Option 1: Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/MykhailoPV/imdb-api.git
   cd imdb-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   ```bash
   echo "API_KEY=YOUR_API_KEY_HERE" > .env
   ```

4. **Start the server**
   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:3001`

### 🔐 Authentication

The API supports two authentication methods:

1. **Environment Variable**: Set `API_KEY` in your `.env` file (used as fallback)
2. **Swagger UI**: Click the "Authorize" button and enter your API key

### 📍 Endpoints

#### Search Movies by Name
```
GET /imdbSearchByName?query=inception
```
Search for movies by title.

#### Search Movie by ID
```
GET /imdbSearchById?id=tt1375666
```
Get detailed information about a specific movie using its IMDB ID.

#### Add to Favorites
```
POST /addFavoritesMoviesById?id=tt1375666
```
Add a movie to your favorites list by IMDB ID.

#### Get Favorites
```
GET /getFavoritesMovies
```
Retrieve your list of favorite movies.

#### Remove from Favorites
```
DELETE /deleteFromFavoritesMoviesById?id=tt1375666
```
Remove a movie from your favorites list.

## 📁 Project Structure

```
imdb-api/
├── src/
│   ├── server.js          # Main application file
│   ├── swagger.js         # Swagger configuration
│   └── middlewares/
│       └── rateLimiter.js # Rate limiting middleware
├── dockerfile             # Docker configuration
├── docker-compose.yml     # Docker Compose setup
├── package.json           # Dependencies
├── .env                   # Environment variables (not in repo)
└── README.md             # Documentation
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
API_KEY=apikey YOUR_COLLECTAPI_KEY_HERE
```

### Rate Limiting

Default: 100 requests per 60 seconds per IP address

Modify in `src/server.js`:
```javascript
app.use(rateLimiter({ windowInSeconds: 60, maxRequests: 100 }));
```
