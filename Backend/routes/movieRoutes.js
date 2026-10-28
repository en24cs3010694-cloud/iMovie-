const express = require('express');
const { verifyAdmin } = require('../middleware/auth');
const router = express.Router();

module.exports = (store) => {
  // GET /api/movies - Search, filter & pagination
  router.get('/', (req, res) => {
    const { search = '', genre = '', language = '', theatre = '', location = '', page = 1, limit = 10 } = req.query;
    let filtered = store.movies.filter(m => {
      const matchSearch = m.title.toLowerCase().includes(search.toLowerCase());
      const matchGenre = !genre || m.genre.toLowerCase() === genre.toLowerCase();
      const matchLang = !language || m.language.toLowerCase() === language.toLowerCase();
      const matchTheatre = !theatre || m.theatre.toLowerCase().includes(theatre.toLowerCase());
      const matchLoc = !location || m.location.toLowerCase() === location.toLowerCase();
      return matchSearch && matchGenre && matchLang && matchTheatre && matchLoc;
    });
    const startIndex = (Number(page) - 1) * Number(limit);
    const paginated = filtered.slice(startIndex, startIndex + Number(limit));
    res.json({
      total: filtered.length,
      page: Number(page),
      movies: paginated
    });
  });

  // GET /api/movies/:id
  router.get('/:id', (req, res) => {
    const movie = store.movies.find(m => m.id === req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json(movie);
  });

  // POST /api/movies - Admin Add Movie
  router.post('/', verifyAdmin, (req, res) => {
    const { title, description, genre, language, duration, rating, theatre, location, posterUrl, showTimes, price } = req.body;
    if (!title || !genre || !language) {
      return res.status(400).json({ message: 'Title, genre, and language are required' });
    }
    const newMovie = {
      id: 'm_' + Date.now(),
      title,
      description: description || 'Blockbuster theatrical release in Dolby Atmos.',
      genre,
      language,
      duration: duration || '2h 30m',
      rating: Number(rating) || 8.5,
      theatre: theatre || 'PVR Treasure Island',
      location: location || 'Indore',
      posterUrl: posterUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600',
      showTimes: showTimes || ['10:30 AM', '02:15 PM', '06:30 PM', '09:45 PM'],
      price: Number(price) || 250,
      bookedSeats: {}
    };
    store.movies.unshift(newMovie);
    res.status(201).json({ message: 'Movie added successfully', movie: newMovie });
  });

  // DELETE /api/movies/:id - Admin Delete Movie
  router.delete('/:id', verifyAdmin, (req, res) => {
    store.movies = store.movies.filter(m => m.id !== req.params.id);
    res.json({ message: 'Movie deleted successfully' });
  });

  return router;
};
