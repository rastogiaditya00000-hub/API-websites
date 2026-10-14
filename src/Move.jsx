import React, { useEffect, useRef, useState } from "react";
import "./Move.css";

const API_KEY = "6930f06";
const API_URL = "https://www.omdbapi.com/";

const getMovieData = async (params) => {
  const query = new URLSearchParams({
    apikey: API_KEY,
    ...params,
  });

  const response = await fetch(`${API_URL}?${query.toString()}`);
  const data = await response.json();

  if (!response.ok || data.Response === "False") {
    throw new Error(data.Error || "Movie load nahi hui.");
  }

  return data;
};

const Move = () => {
  const [featured, setFeatured] = useState(null);
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);

  const searchRef = useRef(null);

  // Default featured movie + initial movie collection
  useEffect(() => {
    let active = true;

    const loadMovies = async () => {
      try {
        setLoading(true);
        setError("");

        const [featuredMovie, movieResults] = await Promise.all([
          getMovieData({ i: "tt3896198", plot: "full" }),
          getMovieData({ s: "Guardians", type: "movie", page: "1" }),
        ]);

        if (!active) return;

        setFeatured(featuredMovie);
        setMovies(movieResults.Search || []);
      } catch (err) {
        if (active) {
          setError(err.message || "Movies load nahi hui.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadMovies();

    return () => {
      active = false;
    };
  }, []);

  // Search movies by name
  const handleSearch = async (e) => {
    e.preventDefault();

    if (!search.trim()) {
      setError("Movie ka naam enter karo.");
      return;
    }

    try {
      setSearching(true);
      setError("");
      setShowFavorites(false);

      const data = await getMovieData({
        s: search.trim(),
        type: "movie",
        page: "1",
      });

      setMovies(data.Search || []);
    } catch (err) {
      setMovies([]);
      setError(err.message || "Movie search nahi hui.");
    } finally {
      setSearching(false);
    }
  };

  // Load full details when a movie is selected
  const openDetails = async (movie) => {
    setSelectedMovie(null);
    setDetailsError("");
    setDetailsLoading(true);

    try {
      const data = await getMovieData({
        i: movie.imdbID,
        plot: "full",
      });

      setSelectedMovie(data);
    } catch (err) {
      setDetailsError(err.message || "Movie details nahi mili.");
    } finally {
      setDetailsLoading(false);
    }
  };

  // Add or remove from watchlist
  const toggleFavorite = (movie) => {
    setFavorites((current) =>
      current.some((item) => item.imdbID === movie.imdbID)
        ? current.filter((item) => item.imdbID !== movie.imdbID)
        : [...current, movie]
    );
  };

  const visibleMovies = showFavorites
    ? favorites
    : movies;

  return (
    <div className="movie-app">
      <nav className="movie-nav">
        <a className="movie-logo" href="#movie-home">
          <span className="logo-symbol">M</span>
          <span>MOVIEX</span>
        </a>

        <div className="movie-nav-right">
          <a href="#movie-home" className="nav-home">
            Home
          </a>

          <button
            className={`watchlist-btn ${showFavorites ? "active" : ""}`}
            onClick={() => {
              setShowFavorites((current) => !current);
              setError("");
            }}
          >
            ♥ Watchlist ({favorites.length})
          </button>
        </div>
      </nav>

      <main id="movie-home">
        {/* Featured movie */}
        {featured && (
          <section
            className="movie-hero"
            style={{
              backgroundImage:
                featured.Poster && featured.Poster !== "N/A"
                  ? `linear-gradient(90deg, #090b12 0%, rgba(9,11,18,.93) 35%, rgba(9,11,18,.48) 75%, rgba(9,11,18,.55) 100%), url("${featured.Poster}")`
                  : "linear-gradient(120deg, #17162c, #090b12)",
            }}
          >
            <div className="hero-content">
              <span className="hero-label">
                <span className="live-dot"></span>
                EDITOR'S SPOTLIGHT
              </span>

              <p className="hero-kicker">YOUR NEXT MOVIE NIGHT STARTS HERE</p>

              <h1>{featured.Title}</h1>

              <div className="hero-meta">
                <span>{featured.Year}</span>
                <span>{featured.Rated}</span>
                <span>{featured.Runtime}</span>
              </div>

              <div className="hero-rating">
                <span className="gold-star">★</span>
                <strong>{featured.imdbRating || "N/A"}</strong>
                <span className="rating-label">IMDb Rating</span>
              </div>

              <div className="hero-genres">
                {(featured.Genre || "")
                  .split(",")
                  .filter(Boolean)
                  .map((genre) => (
                    <span key={genre}>{genre.trim()}</span>
                  ))}
              </div>

              <p className="hero-plot">{featured.Plot}</p>

              <p className="hero-director">
                <span>DIRECTOR</span>
                {featured.Director}
              </p>

              <div className="hero-actions">
                <button
                  className="primary-btn"
                  onClick={() => setSelectedMovie(featured)}
                >
                  <span>▶</span> Movie Details
                </button>

                <button
                  className={`secondary-btn ${
                    favorites.some(
                      (item) => item.imdbID === featured.imdbID
                    )
                      ? "saved"
                      : ""
                  }`}
                  onClick={() => toggleFavorite(featured)}
                >
                  ♥{" "}
                  {favorites.some(
                    (item) => item.imdbID === featured.imdbID
                  )
                    ? "Added to Watchlist"
                    : "Add to Watchlist"}
                </button>
              </div>
            </div>

            {featured.Poster && featured.Poster !== "N/A" && (
              <div className="hero-poster">
                <img src={featured.Poster} alt={featured.Title} />
                <span>NOW SHOWING</span>
              </div>
            )}

            <div className="hero-bottom">
              MOVIEX <span>•</span> DISCOVER YOUR NEXT FAVOURITE
            </div>
          </section>
        )}

        {!featured && loading && (
          <div className="movie-loading hero-loading">
            <span className="movie-spinner"></span>
            <p>Preparing your cinema experience...</p>
          </div>
        )}

        {/* Search and movie collection */}
        <section className="movie-library" id="movie-list">
          <div className="library-heading">
            <div>
              <span className="section-overline">THE MOVIE COLLECTION</span>
              <h2>
                {showFavorites
                  ? "My Watchlist"
                  : search.trim()
                    ? `Results for "${search}"`
                    : "Explore Movies"}
              </h2>
              <p>Find your next favourite film.</p>
            </div>

            <span className="collection-count">
              {visibleMovies.length} FILMS
            </span>
          </div>

          <form className="movie-search" onSubmit={handleSearch}>
            <span className="search-icon">⌕</span>

            <input
              ref={searchRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search movies... e.g. Avatar, Batman, Avengers"
              aria-label="Search movies"
            />

            {search && (
              <button
                type="button"
                className="clear-search"
                onClick={() => {
                  setSearch("");
                  setError("");
                  searchRef.current?.focus();
                }}
                aria-label="Clear search"
              >
                ×
              </button>
            )}

            <button type="submit" disabled={searching}>
              {searching ? "Searching..." : "Search Movies"}
            </button>
          </form>

          {!showFavorites && (
            <div className="movie-quick-search">
              <span>TRY:</span>
              {["Avengers", "Batman", "Avatar", "Spider-Man"].map(
                (term) => (
                  <button
                    type="button"
                    key={term}
                    onClick={() => {
                      setSearch(term);
                      setError("");
                      setSearching(true);

                      getMovieData({
                        s: term,
                        type: "movie",
                        page: "1",
                      })
                        .then((data) => setMovies(data.Search || []))
                        .catch((err) => {
                          setMovies([]);
                          setError(err.message || "Search failed.");
                        })
                        .finally(() => setSearching(false));
                    }}
                  >
                    {term}
                  </button>
                )
              )}
            </div>
          )}

          {error && (
            <div className="movie-error" role="alert">
              <span>!</span>
              <p>{error}</p>
              <button
                onClick={() => {
                  setError("");
                  if (search.trim()) {
                    getMovieData({
                      s: search.trim(),
                      type: "movie",
                      page: "1",
                    })
                      .then((data) => setMovies(data.Search || []))
                      .catch((err) => setError(err.message))
                      .finally(() => setSearching(false));
                  }
                }}
              >
                Retry
              </button>
            </div>
          )}

          {(loading || searching) && (
            <div className="movie-loading">
              <span className="movie-spinner"></span>
              <p>Finding great movies...</p>
            </div>
          )}

          {!loading && !searching && !error && (
            <>
              {visibleMovies.length > 0 ? (
                <div className="movie-grid">
                  {visibleMovies.map((movie) => {
                    const isFavorite = favorites.some(
                      (item) => item.imdbID === movie.imdbID
                    );

                    return (
                      <article
                        className="movie-card"
                        key={movie.imdbID}
                      >
                        <div className="movie-card-poster">
                          {movie.Poster && movie.Poster !== "N/A" ? (
                            <img
                              src={movie.Poster}
                              alt={movie.Title}
                              loading="lazy"
                            />
                          ) : (
                            <div className="no-poster">
                              <span>🎬</span>
                              <p>POSTER UNAVAILABLE</p>
                            </div>
                          )}

                          <span className="movie-type">
                            {movie.Type || "Movie"}
                          </span>

                          <button
                            className={`favorite-icon ${
                              isFavorite ? "is-favorite" : ""
                            }`}
                            onClick={() => toggleFavorite(movie)}
                            aria-label={
                              isFavorite
                                ? "Remove from watchlist"
                                : "Add to watchlist"
                            }
                          >
                            {isFavorite ? "♥" : "♡"}
                          </button>

                          <button
                            className="poster-view-btn"
                            onClick={() => openDetails(movie)}
                          >
                            View Details
                          </button>
                        </div>

                        <div className="movie-card-body">
                          <span className="movie-year">{movie.Year}</span>
                          <h3>{movie.Title}</h3>

                          <button
                            className="details-link"
                            onClick={() => openDetails(movie)}
                          >
                            Explore Movie <span>↗</span>
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="movie-empty">
                  <span>🎬</span>
                  <h3>
                    {showFavorites
                      ? "Your watchlist is empty"
                      : "No movies to display"}
                  </h3>
                  <p>
                    {showFavorites
                      ? "Add movies using the heart button to save them here."
                      : "Search for a movie to discover its poster and details."}
                  </p>

                  {showFavorites && (
                    <button onClick={() => setShowFavorites(false)}>
                      Explore Movies
                    </button>
                  )}
                </div>
              )}
            </>
          )}

          <div className="movie-pagination-note">
            <span>✦</span> MORE TO DISCOVER — SEARCH ANY MOVIE BY NAME
          </div>
        </section>
      </main>

      {/* Movie details modal */}
      {(selectedMovie || detailsLoading || detailsError) && (
        <div
          className="movie-modal-overlay"
          onClick={() => {
            setSelectedMovie(null);
            setDetailsError("");
          }}
        >
          <div
            className="movie-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Movie details"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => {
                setSelectedMovie(null);
                setDetailsError("");
              }}
              aria-label="Close movie details"
            >
              ×
            </button>

            {detailsLoading ? (
              <div className="movie-loading">
                <span className="movie-spinner"></span>
                <p>Loading movie details...</p>
              </div>
            ) : detailsError ? (
              <div className="movie-empty">
                <p>{detailsError}</p>
              </div>
            ) : selectedMovie ? (
              <div className="modal-layout">
                <div className="modal-poster">
                  {selectedMovie.Poster &&
                  selectedMovie.Poster !== "N/A" ? (
                    <img
                      src={selectedMovie.Poster}
                      alt={selectedMovie.Title}
                    />
                  ) : (
                    <div className="no-poster">No Poster</div>
                  )}
                </div>

                <div className="modal-content">
                  <span className="section-overline">MOVIE DETAILS</span>
                  <h2>{selectedMovie.Title}</h2>

                  <div className="modal-meta">
                    <span>{selectedMovie.Year}</span>
                    <span>{selectedMovie.Rated}</span>
                    <span>{selectedMovie.Runtime}</span>
                  </div>

                  <div className="modal-rating">
                    ★ {selectedMovie.imdbRating || "N/A"}{" "}
                    <span>IMDb Rating</span>
                  </div>

                  <p className="modal-plot">{selectedMovie.Plot}</p>

                  <div className="detail-row">
                    <strong>Genre</strong>
                    <span>{selectedMovie.Genre}</span>
                  </div>

                  <div className="detail-row">
                    <strong>Director</strong>
                    <span>{selectedMovie.Director}</span>
                  </div>

                  <div className="detail-row">
                    <strong>Cast</strong>
                    <span>{selectedMovie.Actors}</span>
                  </div>

                  <div className="detail-row">
                    <strong>Released</strong>
                    <span>{selectedMovie.Released}</span>
                  </div>

                  <div className="detail-row">
                    <strong>Awards</strong>
                    <span>{selectedMovie.Awards}</span>
                  </div>

                  <button
                    className="primary-btn modal-watchlist"
                    onClick={() => toggleFavorite(selectedMovie)}
                  >
                    ♥{" "}
                    {favorites.some(
                      (item) => item.imdbID === selectedMovie.imdbID
                    )
                      ? "In Your Watchlist"
                      : "Add to Watchlist"}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      <footer className="movie-footer">
        <a className="movie-logo" href="#movie-home">
          <span className="logo-symbol">M</span> MOVIEX
        </a>
        <p>Built for movie lovers.</p>
        <small>Movie information provided by OMDb API.</small>
      </footer>
    </div>
  );
};

export default Move;