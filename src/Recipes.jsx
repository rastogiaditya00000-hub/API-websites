import React, { useState } from "react";
import "./Recipes.css";

const Recipes = () => {
    const [search, setSearch] = useState("");
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const searchRecipes = async (e) => {
        e.preventDefault();

        if (!search.trim()) {
            setError("Please enter a food name!");
            setMeals([]);
            return;
        }

        try {
            setLoading(true);
            setError("");
            setMeals([]);

            const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(search.trim())}`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Failed to fetch recipes");
            }

            const data = await response.json();

            if (data.meals) {
                setMeals(data.meals);
            } else {
                setError("Recipe nahi mili. Dusra food name try karo!");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const getIngredients = (meal) => {
        return Array.from({ length: 20 }, (_, i) => {
            const ingredient = meal[`strIngredient${i + 1}`];
            const measure = meal[`strMeasure${i + 1}`];

            if (ingredient && ingredient.trim()) {
                return {
                    ingredient: ingredient.trim(),
                    measure: measure?.trim() || "",
                };
            }

            return null;
        }).filter(Boolean);
    };

    return (
        <div className="recipe-page">
            <header className="recipe-header">
                <h1>🍽️ Recipe Finder</h1>
                <p>Search your favourite food and discover its recipe.</p>
            </header>

            <form className="recipe-search" onSubmit={searchRecipes}>
                <input
                    type="text"
                    placeholder="Enter food name... e.g. Chicken"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Searching..." : "Search Recipe"}
                </button>
            </form>

            {loading && (
                <p className="recipe-message">Loading recipes...</p>
            )}

            {error && (
                <p className="recipe-error">{error}</p>
            )}

            <div className="recipe-grid">
                {meals.map((meal) => (
                    <article className="recipe-card" key={meal.idMeal}>
                        <img
                            src={meal.strMealThumb}
                            alt={meal.strMeal}
                            className="recipe-image"
                        />

                        <div className="recipe-content">
                            <h2>{meal.strMeal}</h2>

                            <div className="recipe-meta">
                                <span>{meal.strCategory || "Food"}</span>
                                <span>{meal.strArea || "Various"}</span>
                            </div>

                            <h3>Ingredients</h3>

                            <ul className="ingredient-list">
                                {getIngredients(meal).map((item, index) => (
                                    <li key={index}>
                                        {item.ingredient}
                                        {item.measure && ` — ${item.measure}`}
                                    </li>
                                ))}
                            </ul>

                            <h3>Instructions</h3>

                            <details className="recipe-details">
                                <summary>View Full Recipe</summary>
                                <p>{meal.strInstructions}</p>
                            </details>

                            {meal.strYoutube && (
                                <a
                                    className="recipe-video"
                                    href={meal.strYoutube}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    ▶ Watch Recipe Video
                                </a>
                            )}
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
};

export default Recipes;