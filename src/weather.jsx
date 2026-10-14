import React, { useState } from "react";
import "./Weather.css";

const Weather = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getWeather = async () => {
    if (city.trim() === "") {
      setError("Please enter city name");
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const API_KEY ="ea81065848db4aeaa58113651260810";

      const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(
        city
      )}`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Weather not found");
      }

      setWeather(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="weather-container">
      <h1>Weather App</h1>

      <div className="search-box">
        <input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              getWeather();
            }
          }}
        />

        <button onClick={getWeather}>
          Search
        </button>
      </div>

      {loading && <p className="loading">Loading weather...</p>}

      {error && <p className="error">{error}</p>}

      {weather && (
        <div className="weather-card">
          <h2>
            {weather.location.name}, {weather.location.country}
          </h2>

          <img
            src={`https:${weather.current.condition.icon}`}
            alt={weather.current.condition.text}
          />

          <h3>{weather.current.temp_c}°C</h3>

          <p>{weather.current.condition.text}</p>

          <div className="weather-info">
            <div>
              <strong>Feels Like</strong>
              <span>{weather.current.feelslike_c}°C</span>
            </div>

            <div>
              <strong>Humidity</strong>
              <span>{weather.current.humidity}%</span>
            </div>

            <div>
              <strong>Wind</strong>
              <span>{weather.current.wind_kph} km/h</span>
            </div>

            <div>
              <strong>Cloud</strong>
              <span>{weather.current.cloud}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;