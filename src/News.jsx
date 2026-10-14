import React, { useCallback, useEffect, useRef, useState } from "react";
import "./News.css";

const API_KEY = "92eeaeab93db9d36242ec43a97febce8";

const News = () => {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("general");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const initialLoadDone = useRef(false);

  const fetchNews = useCallback(async (keyword = "", selectedCategory = "general") => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        apikey: API_KEY,
        lang: "en",
        country: "in",
        max: "10",
      });

      let endpoint;

      if (keyword.trim()) {
        endpoint = "search";
        params.set("q", keyword.trim());
      } else {
        endpoint = "top-headlines";
        params.set("category", selectedCategory);
      }

      const url = `https://gnews.io/api/v4/${endpoint}?${params.toString()}`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        const message = Array.isArray(data.errors)
          ? data.errors.join(", ")
          : data.message || data.error || `API error: ${response.status}`;

        throw new Error(`${message} (HTTP ${response.status})`);
      }

      if (!Array.isArray(data.articles) || data.articles.length === 0) {
        setArticles([]);
        setError("News nahi mili. Dusra keyword ya category try karo.");
        return;
      }

      setArticles(data.articles);
    } catch (err) {
      setArticles([]);

      if (err.message === "Failed to fetch") {
        setError(
          "Network/CORS error. Internet, API key aur localhost par access check karo."
        );
      } else {
        setError(err.message || "News load nahi hui. Dobara try karo.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Page khulte hi news load karo; React StrictMode mein duplicate call rokne ki koshish.
  useEffect(() => {
    if (initialLoadDone.current) return;

    initialLoadDone.current = true;
    fetchNews("", "general");
  }, [fetchNews]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchNews(search, category);
  };

  const handleCategory = (e) => {
    const value = e.target.value;
    setCategory(value);
    setSearch("");
    fetchNews("", value);
  };

  return (
    <main className="news-page">
      <header className="news-header">
        <div className="news-brand">
          <span className="brand-icon">N</span>
          <h1>Daily<span>News</span></h1>
        </div>
        <p>Your daily destination for stories that matter.</p>
      </header>

      <section className="news-controls">
        <form className="news-search" onSubmit={handleSearch}>
          <input
            type="search"
            placeholder="Search news, e.g. India, cricket, technology..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search news"
          />

          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Search"}
          </button>
        </form>

        <div className="news-filter">
          <label htmlFor="news-category">Category</label>
          <select
            id="news-category"
            value={category}
            onChange={handleCategory}
            disabled={loading}
          >
            <option value="general">General</option>
            <option value="world">World</option>
            <option value="nation">India / Nation</option>
            <option value="business">Business</option>
            <option value="technology">Technology</option>
            <option value="entertainment">Entertainment</option>
            <option value="sports">Sports</option>
            <option value="science">Science</option>
            <option value="health">Health</option>
          </select>

          <button
            className="news-refresh"
            type="button"
            disabled={loading}
            onClick={() => fetchNews(search, category)}
          >
            Refresh
          </button>
        </div>
      </section>

      <section className="news-results">
        <div className="news-section-heading">
          <div>
            <span className="news-eyebrow">LATEST UPDATES</span>
            <h2>{search.trim() ? `Results for "${search}"` : "Top Headlines"}</h2>
          </div>

          <span className="news-count">
            {articles.length} articles
          </span>
        </div>

        {loading && (
          <div className="news-status">
            <span className="news-spinner" />
            <p>Fetching news for you...</p>
          </div>
        )}

        {!loading && error && (
          <div className="news-status news-error" role="alert">
            <h3>Unable to load news</h3>
            <p>{error}</p>
            <button onClick={() => fetchNews(search, category)}>
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && articles.length > 0 && (
          <div className="news-grid">
            {articles.map((article, index) => (
              <article className="news-card" key={article.url || index}>
                {article.image ? (
                  <img
                    className="news-image"
                    src={article.image}
                    alt={article.title || "News"}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="news-image-placeholder">
                    DAILY NEWS
                  </div>
                )}

                <div className="news-content">
                  <div className="news-meta">
                    <span className="news-source">
                      {article.source?.name || "News"}
                    </span>

                    {article.publishedAt && (
                      <time dateTime={article.publishedAt}>
                        {new Date(article.publishedAt).toLocaleDateString()}
                      </time>
                    )}
                  </div>

                  <h3>{article.title}</h3>

                  <p className="news-description">
                    {article.description || "Open the article to read more."}
                  </p>

                  <a
                    className="news-read-more"
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read Full Article <span>↗</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer className="news-footer">
        News for learning and personal projects · Powered by GNews
      </footer>
    </main>
  );
};

export default News;