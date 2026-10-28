import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { loginSuccess, logout } from './redux/store';
import { ToastContainer, toast } from 'react-toastify';

const API_URL = 'https://imovies-mern-project-84xj.onrender.com';
const SEAT_ROWS = ['A', 'B', 'C', 'D', 'E'];
const SEAT_COLS = [1, 2, 3, 4, 5, 6, 7, 8];

export default function App() {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState('movies');
  const [movies, setMovies] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [language, setLanguage] = useState('');
  const [location, setLocation] = useState('');

  // Selected Movie & Seat Booking State
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showDate, setShowDate] = useState('2026-10-27');
  const [showTime, setShowTime] = useState('06:30 PM');
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  // Auth Form State
  const [isRegister, setIsRegister] = useState(false);
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '', role: 'user' });

  // Admin Add Movie State
  const [newMovie, setNewMovie] = useState({
    title: '', genre: 'Sci-Fi', language: 'English', theatre: 'PVR Treasure Island', location: 'Indore', price: 250, duration: '2h 30m', posterUrl: ''
  });

  const fetchMovies = async () => {
    try {
    const res = await axios.get(`${API_URL}/api/movies`, {
  params: { search, genre, language, location }
      });
      setMovies(res.data.movies || []);
    } catch (err) {
      toast.error('Could not load movies. Make sure backend server is running on port 5000.');
    }
  };

  const fetchBookings = async () => {
    if (!token) return;
    try {
  const res = await axios.get(`${API_URL}/api/bookings/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [search, genre, language, location]);

  useEffect(() => {
    if (token) fetchBookings();
  }, [token, activeTab]);

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
const res = await axios.post(`${API_URL}${endpoint}`, authForm);
      dispatch(loginSuccess(res.data));
      toast.success(res.data.message);
      setActiveTab('movies');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Authentication failed');
    }
  };

  const toggleSeat = (seatId, isBooked) => {
    if (isBooked) return;
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((s) => s !== seatId) : [...prev, seatId]
    );
  };

  const confirmBooking = async () => {
    if (!token) {
      toast.warning('Please login first to book tickets!');
      setActiveTab('auth');
      return;
    }
    if (selectedSeats.length === 0) {
      toast.warning('Please select at least 1 seat!');
      return;
    }
    try {
      const res = await axios.post(
   `${API_URL}/api/bookings`,
        {
          movieId: selectedMovie.id,
          showDate,
          showTime,
          seats: selectedSeats,
          paymentMethod
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Booking Confirmed! ID: ${res.data.booking.id}`);
      setSelectedSeats([]);
      setSelectedMovie(null);
      fetchMovies();
      setActiveTab('bookings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    }
  };

  const cancelBooking = async (id) => {
    try {
     await axios.patch(`${API_URL}/api/bookings/${id}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.info('Booking cancelled and seats released.');
      fetchBookings();
      fetchMovies();
    } catch (err) {
      toast.error('Failed to cancel booking');
    }
  };

  const handleAddMovie = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/movies`, newMovie, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('New movie added to IMovies!');
      setNewMovie({ title: '', genre: 'Sci-Fi', language: 'English', theatre: 'PVR Treasure Island', location: 'Indore', price: 250, duration: '2h 30m', posterUrl: '' });
      fetchMovies();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Admin access required');
    }
  };

  return (
    <div className="min-vh-100 bg-dark text-light">
      <ToastContainer position="top-right" autoClose={2500} />

      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-black border-bottom border-secondary px-4 py-3">
        <a className="navbar-brand fw-bold text-danger fs-4" href="#top" onClick={() => { setSelectedMovie(null); setActiveTab('movies'); }}>
          🎬 IMovies
        </a>
        <div className="ms-auto d-flex gap-2 align-items-center">
          <button className={`btn btn-sm ${activeTab === 'movies' ? 'btn-danger' : 'btn-outline-light'}`} onClick={() => { setSelectedMovie(null); setActiveTab('movies'); }}>
            Browse Movies
          </button>
          {user && (
            <button className={`btn btn-sm ${activeTab === 'bookings' ? 'btn-danger' : 'btn-outline-light'}`} onClick={() => { setSelectedMovie(null); setActiveTab('bookings'); }}>
              My Bookings
            </button>
          )}
          {user?.role === 'admin' && (
            <button className={`btn btn-sm ${activeTab === 'admin' ? 'btn-warning text-dark fw-bold' : 'btn-outline-warning'}`} onClick={() => { setSelectedMovie(null); setActiveTab('admin'); }}>
              Admin Panel
            </button>
          )}
          {user ? (
            <div className="d-flex align-items-center gap-2 ms-2">
              <span className="badge bg-secondary">{user.name} ({user.role})</span>
              <button className="btn btn-sm btn-outline-danger" onClick={() => dispatch(logout())}>Logout</button>
            </div>
          ) : (
            <button className="btn btn-sm btn-danger" onClick={() => setActiveTab('auth')}>Login / Register</button>
          )}
        </div>
      </nav>

      <div className="container py-4">
        {/* Movie Listing + Filter Section */}
        {activeTab === 'movies' && !selectedMovie && (
          <>
            <div className="row g-2 mb-4 p-3 bg-black rounded border border-secondary">
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control bg-dark text-light border-secondary"
                  placeholder="Search movies by title..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <select className="form-select bg-dark text-light border-secondary" value={genre} onChange={(e) => setGenre(e.target.value)}>
                  <option value="">All Genres</option>
                  <option value="Sci-Fi">Sci-Fi</option>
                  <option value="Action">Action</option>
                  <option value="Comedy">Comedy</option>
                </select>
              </div>
              <div className="col-md-3">
                <select className="form-select bg-dark text-light border-secondary" value={language} onChange={(e) => setLanguage(e.target.value)}>
                  <option value="">All Languages</option>
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                </select>
              </div>
              <div className="col-md-2">
                <select className="form-select bg-dark text-light border-secondary" value={location} onChange={(e) => setLocation(e.target.value)}>
                  <option value="">All Cities</option>
                  <option value="Indore">Indore</option>
                  <option value="Mumbai">Mumbai</option>
                </select>
              </div>
            </div>

            <div className="row g-4">
              {movies.map((m) => (
                <div className="col-md-6 col-lg-3" key={m.id}>
                  <div className="card bg-black text-light border-secondary h-100 shadow">
                    <img src={m.posterUrl} alt={m.title} className="card-img-top" style={{ height: '260px', objectFit: 'cover' }} />
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="badge bg-danger">{m.genre}</span>
                        <span className="text-warning fw-bold">★ {m.rating}</span>
                      </div>
                      <h5 className="card-title fw-bold">{m.title}</h5>
                      <p className="small text-secondary mb-1">{m.language} • {m.duration}</p>
                      <p className="small text-info mb-3">📍 {m.theatre}, {m.location}</p>
                      <button
                        className="btn btn-danger mt-auto w-100 fw-semibold"
                        onClick={() => {
                          setSelectedMovie(m);
                          setShowTime(m.showTimes?.[0] || '06:30 PM');
                          setSelectedSeats([]);
                        }}
                      >
                        Book Tickets (₹{m.price})
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Seat Selection & Payment Screen */}
        {selectedMovie && (
          <div className="card bg-black text-light border-secondary p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h3 className="fw-bold text-danger mb-0">{selectedMovie.title}</h3>
                <p className="text-secondary mb-0">{selectedMovie.theatre}, {selectedMovie.location} • ₹{selectedMovie.price}/seat</p>
              </div>
              <button className="btn btn-outline-light btn-sm" onClick={() => setSelectedMovie(null)}>← Back to Movies</button>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <label className="form-label small text-secondary">Select Date</label>
                <input type="date" className="form-control bg-dark text-light border-secondary" value={showDate} onChange={(e) => setShowDate(e.target.value)} />
              </div>
              <div className="col-md-8">
                <label className="form-label small text-secondary">Select Showtime</label>
                <div className="d-flex gap-2 flex-wrap">
                  {(selectedMovie.showTimes || ['10:30 AM', '02:15 PM', '06:30 PM', '09:45 PM']).map((time) => (
                    <button
                      key={time}
                      className={`btn btn-sm ${showTime === time ? 'btn-danger' : 'btn-outline-secondary text-light'}`}
                      onClick={() => { setShowTime(time); setSelectedSeats([]); }}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-center my-3">
              <div className="bg-secondary text-dark fw-bold py-1 mx-auto rounded mb-4" style={{ maxWidth: '450px' }}>
                CINEMA SCREEN THIS WAY
              </div>

              {SEAT_ROWS.map((row) => (
                <div key={row} className="d-flex justify-content-center gap-2 mb-2">
                  <span className="me-2 fw-bold text-secondary" style={{ width: '20px' }}>{row}</span>
                  {SEAT_COLS.map((col) => {
                    const seatId = `${row}${col}`;
                    const key = `${showDate}_${showTime}`;
                    const isBooked = (selectedMovie.bookedSeats?.[key] || []).includes(seatId);
                    const isSelected = selectedSeats.includes(seatId);
                    return (
                      <button
                        key={seatId}
                        disabled={isBooked}
                        onClick={() => toggleSeat(seatId, isBooked)}
                        className={`btn btn-sm ${
                          isBooked ? 'btn-secondary disabled' : isSelected ? 'btn-success' : 'btn-outline-light'
                        }`}
                        style={{ width: '42px' }}
                      >
                        {seatId}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="border-top border-secondary pt-3 mt-3 d-flex flex-wrap justify-content-between align-items-center">
              <div>
                <div>Selected Seats: <strong className="text-warning">{selectedSeats.join(', ') || 'None'}</strong></div>
                <div>Total Amount: <strong className="text-success fs-5">₹{selectedSeats.length * selectedMovie.price}</strong></div>
              </div>
              <div className="d-flex gap-2 align-items-center">
                <select className="form-select form-select-sm bg-dark text-light border-secondary" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                  <option value="UPI">UPI (GPay / PhonePe)</option>
                  <option value="Card">Credit / Debit Card</option>
                  <option value="NetBanking">NetBanking</option>
                </select>
                <button className="btn btn-danger fw-bold px-4" onClick={confirmBooking}>
                  Pay & Confirm Booking
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Booking History & Cancellation */}
        {activeTab === 'bookings' && (
          <div>
            <h4 className="fw-bold mb-3">🎟️ My Ticket Bookings</h4>
            {bookings.length === 0 ? (
              <div className="alert alert-secondary bg-black text-light border-secondary">No bookings yet. Book a movie ticket to see it here!</div>
            ) : (
              <div className="row g-3">
                {bookings.map((b) => (
                  <div className="col-md-6" key={b.id}>
                    <div className="card bg-black text-light border-secondary p-3">
                      <div className="d-flex justify-content-between">
                        <h5 className="fw-bold text-danger">{b.movieTitle}</h5>
                        <span className={`badge ${b.status === 'Confirmed' ? 'bg-success' : 'bg-secondary'}`}>{b.status}</span>
                      </div>
                      <p className="small text-secondary mb-1">Booking ID: <strong>{b.id}</strong> • {b.theatreName}</p>
                      <p className="mb-1">Date: <strong>{b.showDate}</strong> at <strong>{b.showTime}</strong></p>
                      <p className="mb-2">Seats: <strong className="text-warning">{b.seats.join(', ')}</strong> • Paid: <strong>₹{b.totalAmount}</strong> ({b.paymentMethod})</p>
                      {b.status === 'Confirmed' && (
                        <button className="btn btn-sm btn-outline-danger align-self-start" onClick={() => cancelBooking(b.id)}>
                          Cancel Booking & Refund
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Admin Dashboard */}
        {activeTab === 'admin' && (
          <div className="card bg-black text-light border-secondary p-4">
            <h4 className="fw-bold text-warning mb-3">⚙️ Admin Movie & Show Management Panel</h4>
            <form onSubmit={handleAddMovie} className="row g-3">
              <div className="col-md-6">
                <label className="form-label small">Movie Title</label>
                <input type="text" className="form-control bg-dark text-light border-secondary" required value={newMovie.title} onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })} />
              </div>
              <div className="col-md-3">
                <label className="form-label small">Genre</label>
                <input type="text" className="form-control bg-dark text-light border-secondary" value={newMovie.genre} onChange={(e) => setNewMovie({ ...newMovie, genre: e.target.value })} />
              </div>
              <div className="col-md-3">
                <label className="form-label small">Language</label>
                <input type="text" className="form-control bg-dark text-light border-secondary" value={newMovie.language} onChange={(e) => setNewMovie({ ...newMovie, language: e.target.value })} />
              </div>
              <div className="col-md-4">
                <label className="form-label small">Theatre Name</label>
                <input type="text" className="form-control bg-dark text-light border-secondary" value={newMovie.theatre} onChange={(e) => setNewMovie({ ...newMovie, theatre: e.target.value })} />
              </div>
              <div className="col-md-4">
                <label className="form-label small">City / Location</label>
                <input type="text" className="form-control bg-dark text-light border-secondary" value={newMovie.location} onChange={(e) => setNewMovie({ ...newMovie, location: e.target.value })} />
              </div>
              <div className="col-md-4">
                <label className="form-label small">Ticket Price (₹)</label>
                <input type="number" className="form-control bg-dark text-light border-secondary" value={newMovie.price} onChange={(e) => setNewMovie({ ...newMovie, price: e.target.value })} />
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-warning fw-bold">Add Movie & Publish Shows</button>
              </div>
            </form>
          </div>
        )}

        {/* Login / Register Screen */}
        {activeTab === 'auth' && (
          <div className="card bg-black text-light border-secondary p-4 mx-auto" style={{ maxWidth: '440px' }}>
            <h4 className="fw-bold text-center mb-3">{isRegister ? 'Create Account' : 'Sign In to IMovies'}</h4>
            <div className="alert alert-dark small py-2">
              <strong>Demo Credentials:</strong><br />
              Admin: <code>admin@imovies.com</code> / <code>admin123</code><br />
              User: <code>naman@imovies.com</code> / <code>user123</code>
            </div>
            <form onSubmit={handleAuth}>
              {isRegister && (
                <div className="mb-3">
                  <label className="form-label small">Full Name</label>
                  <input type="text" className="form-control bg-dark text-light border-secondary" required value={authForm.name} onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })} />
                </div>
              )}
              <div className="mb-3">
                <label className="form-label small">Email Address</label>
                <input type="email" className="form-control bg-dark text-light border-secondary" required value={authForm.email} onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })} />
              </div>
              <div className="mb-3">
                <label className="form-label small">Password</label>
                <input type="password" className="form-control bg-dark text-light border-secondary" required value={authForm.password} onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })} />
              </div>
              <button type="submit" className="btn btn-danger w-100 fw-bold mb-2">
                {isRegister ? 'Register' : 'Login'}
              </button>
            </form>
            <button className="btn btn-link text-secondary btn-sm" onClick={() => setIsRegister(!isRegister)}>
              {isRegister ? 'Already have an account? Login' : 'New user? Create an account'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
