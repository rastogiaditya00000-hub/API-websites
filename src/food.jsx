
import React, { useState } from "react";
import foodData from "./food.json";

function Food() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [foodType, setFoodType] = useState("All");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sortBy, setSortBy] = useState("default");
  const [cart, setCart] = useState([]);

  const foods = foodData.foods;

  const categories = [
    "All",
    ...new Set(foods.map((food) => food.category)),
  ];

  const filteredFoods = foods
    .filter((food) => {
      const matchesSearch =
        food.name.toLowerCase().includes(search.toLowerCase()) ||
        food.restaurant.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || food.category === category;

      const matchesType =
        foodType === "All" ||
        (foodType === "Veg" && food.isVeg) ||
        (foodType === "Non-Veg" && !food.isVeg);

      const matchesAvailability =
        !availableOnly || food.isAvailable;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesType &&
        matchesAvailability
      );
    })
    .sort((a, b) => {
      if (sortBy === "low") return a.price - b.price;
      if (sortBy === "high") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "delivery") {
        return a.deliveryTime - b.deliveryTime;
      }
      return 0;
    });

  const getFinalPrice = (food) =>
    Math.round(food.price - (food.price * food.discount) / 100);

  const addToCart = (food) => {
    if (!food.isAvailable) return;

    setCart((previousCart) => {
      const existing = previousCart.find(
        (item) => item.id === food.id
      );

      if (existing) {
        return previousCart.map((item) =>
          item.id === food.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...previousCart,
        { ...food, quantity: 1 },
      ];
    });
  };

  const changeQuantity = (id, amount) => {
    setCart((previousCart) =>
      previousCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const cartTotal = cart.reduce(
    (total, item) =>
      total + getFinalPrice(item) * item.quantity,
    0
  );

  const foodIcons = {
    Pizza: "🍕",
    Burger: "🍔",
    Indian: "🍛",
    Biryani: "🍚",
    "South Indian": "🥞",
    Snacks: "🍟",
    Dessert: "🍰",
    Drinks: "🥤",
    Sandwich: "🥪",
    Momos: "🥟",
  };

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        .food-app {
          min-height: 100vh;
          padding: 28px 5%;
          background: #f8fafc;
          color: #1e293b;
          font-family: Arial, sans-serif;
        }

        .food-header {
          padding: 35px 25px;
          border-radius: 22px;
          background: linear-gradient(135deg, #ff6b35, #ff9f1c);
          color: white;
          text-align: center;
          margin-bottom: 25px;
        }

        .food-header h1 {
          margin: 0 0 12px;
          font-size: clamp(28px, 4vw, 42px);
        }

        .food-header p {
          margin: 0;
          font-size: 16px;
        }

        .food-toolbar {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 12px;
          margin-bottom: 18px;
        }

        .food-toolbar input,
        .food-toolbar select {
          width: 100%;
          min-width: 0;
          padding: 13px 14px;
          border: 1px solid #dbe2ea;
          border-radius: 10px;
          background: white;
          font-size: 14px;
          outline: none;
        }

        .food-toolbar input:focus,
        .food-toolbar select:focus {
          border-color: #ff6b35;
          box-shadow: 0 0 0 3px #ff6b3520;
        }

        .food-categories {
          display: flex;
          gap: 9px;
          flex-wrap: wrap;
          margin: 20px 0;
        }

        .food-category {
          padding: 10px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 25px;
          background: white;
          cursor: pointer;
          font-weight: 600;
          transition: 0.2s;
        }

        .food-category:hover,
        .food-category.active {
          color: white;
          background: #ff6b35;
          border-color: #ff6b35;
        }

        .food-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 15px;
          margin-bottom: 22px;
        }

        .food-type-buttons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .food-type-buttons button {
          padding: 10px 14px;
          border: 1px solid #dbe2ea;
          border-radius: 9px;
          background: white;
          cursor: pointer;
        }

        .food-type-buttons button.active {
          color: #fff;
          background: #1e293b;
          border-color: #1e293b;
        }

        .food-available {
          display: flex;
          gap: 8px;
          align-items: center;
          font-size: 14px;
          cursor: pointer;
        }

        .food-count {
          margin: 20px 0;
          color: #64748b;
          font-size: 14px;
        }

        .food-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 20px;
        }

        .food-card {
          min-width: 0;
          overflow: hidden;
          border: 1px solid #e8edf3;
          border-radius: 17px;
          background: white;
          box-shadow: 0 5px 18px #0f172a08;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .food-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 28px #0f172a12;
        }

        .food-image {
          height: 145px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          background: linear-gradient(135deg, #fff0e7, #fff7d6);
          font-size: 65px;
        }

        .food-discount {
          position: absolute;
          top: 12px;
          left: 12px;
          padding: 6px 9px;
          border-radius: 7px;
          background: #e63946;
          color: white;
          font-size: 12px;
          font-weight: bold;
        }

        .food-veg {
          position: absolute;
          right: 12px;
          top: 12px;
          width: 18px;
          height: 18px;
          display: grid;
          place-items: center;
          border: 1.5px solid;
          border-radius: 4px;
          background: white;
        }

        .food-veg span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #16a34a;
        }

        .food-veg.nonveg {
          border-color: #dc2626;
        }

        .food-veg.nonveg span {
          background: #dc2626;
        }

        .food-details {
          padding: 16px;
        }

        .food-details h3 {
          margin: 0 0 8px;
          font-size: 17px;
          line-height: 1.4;
        }

        .food-restaurant {
          margin: 0 0 12px;
          color: #64748b;
          font-size: 13px;
        }

        .food-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          margin-bottom: 13px;
          font-size: 13px;
        }

        .food-rating {
          color: #a16207;
          font-weight: bold;
        }

        .food-time {
          color: #64748b;
        }

        .food-price-row {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 7px;
          margin-bottom: 15px;
        }

        .food-price {
          font-size: 21px;
          font-weight: bold;
          color: #0f172a;
        }

        .food-old-price {
          color: #94a3b8;
          font-size: 13px;
          text-decoration: line-through;
        }

        .food-save {
          color: #15803d;
          font-size: 12px;
          font-weight: bold;
        }

        .food-add-btn {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 10px;
          color: white;
          background: #ff6b35;
          font-size: 14px;
          font-weight: bold;
          cursor: pointer;
          transition: 0.2s;
        }

        .food-add-btn:hover {
          background: #e85a25;
        }

        .food-add-btn:disabled {
          background: #cbd5e1;
          cursor: not-allowed;
        }

        .food-empty {
          grid-column: 1 / -1;
          padding: 45px 15px;
          text-align: center;
          border-radius: 15px;
          background: white;
          color: #64748b;
        }

        .food-cart {
          margin-top: 35px;
          padding: 24px;
          border: 1px solid #e2e8f0;
          border-radius: 17px;
          background: white;
        }

        .food-cart h2 {
          margin-top: 0;
        }

        .food-cart-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding: 14px 0;
          border-bottom: 1px solid #e2e8f0;
        }

        .food-cart-name {
          font-weight: bold;
        }

        .food-cart-sub {
          margin-top: 5px;
          color: #64748b;
          font-size: 13px;
        }

        .food-quantity {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .food-quantity button {
          width: 30px;
          height: 30px;
          border: 1px solid #dbe2ea;
          border-radius: 7px;
          background: #f8fafc;
          cursor: pointer;
          font-size: 17px;
        }

        .food-cart-total {
          display: flex;
          justify-content: space-between;
          gap: 15px;
          margin-top: 20px;
          font-size: 20px;
          font-weight: bold;
        }

        @media (max-width: 1100px) {
          .food-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 750px) {
          .food-app {
            padding: 18px 4%;
          }

          .food-toolbar {
            grid-template-columns: 1fr 1fr;
          }

          .food-toolbar input {
            grid-column: 1 / -1;
          }

          .food-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 13px;
          }

          .food-image {
            height: 120px;
            font-size: 52px;
          }

          .food-details {
            padding: 12px;
          }

          .food-details h3 {
            font-size: 15px;
          }

          .food-options {
            align-items: flex-start;
          }
        }

        @media (max-width: 420px) {
          .food-grid {
            grid-template-columns: 1fr;
          }

          .food-image {
            height: 160px;
            font-size: 65px;
          }

          .food-toolbar {
            grid-template-columns: 1fr;
          }

          .food-toolbar input {
            grid-column: auto;
          }

          .food-cart-item {
            align-items: flex-start;
            flex-direction: column;
          }
        }
      `}</style>

      <div className="food-app">
        <header className="food-header">
          <h1>🍽️ Foodie Express</h1>
          <p>Your favourite food, delivered to your door!</p>
        </header>

        <div className="food-toolbar">
          <input
            type="text"
            placeholder="🔍 Search food or restaurant..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="default">Sort: Recommended</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="delivery">Fastest Delivery</option>
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item === "All" ? "All Categories" : item}
              </option>
            ))}
          </select>
        </div>

        <div className="food-categories">
          {categories.map((item) => (
            <button
              key={item}
              className={`food-category ${
                category === item ? "active" : ""
              }`}
              onClick={() => setCategory(item)}
            >
              {item === "All"
                ? "🍽️ All"
                : `${foodIcons[item] || "🍴"} ${item}`}
            </button>
          ))}
        </div>

        <div className="food-options">
          <div className="food-type-buttons">
            {["All", "Veg", "Non-Veg"].map((type) => (
              <button
                key={type}
                className={foodType === type ? "active" : ""}
                onClick={() => setFoodType(type)}
              >
                {type === "Veg"
                  ? "🟢 Veg"
                  : type === "Non-Veg"
                  ? "🔴 Non-Veg"
                  : "All Food"}
              </button>
            ))}
          </div>

          <label className="food-available">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
            />
            Only available food
          </label>
        </div>

        <p className="food-count">
          Showing {filteredFoods.length} food items
        </p>

        <div className="food-grid">
          {filteredFoods.length > 0 ? (
            filteredFoods.map((food) => (
              <article className="food-card" key={food.id}>
                <div className="food-image">
                  <span>
                    {foodIcons[food.category] || "🍴"}
                  </span>

                  <span className="food-discount">
                    {food.discount}% OFF
                  </span>

                  <span
                    className={`food-veg ${
                      food.isVeg ? "" : "nonveg"
                    }`}
                    title={food.isVeg ? "Vegetarian" : "Non-vegetarian"}
                  >
                    <span />
                  </span>
                </div>

                <div className="food-details">
                  <h3>{food.name}</h3>
                  <p className="food-restaurant">
                    {food.restaurant} · {food.category}
                  </p>

                  <div className="food-meta">
                    <span className="food-rating">
                      ⭐ {food.rating}
                    </span>
                    <span className="food-time">
                      🕒 {food.deliveryTime} min
                    </span>
                  </div>

                  <div className="food-price-row">
                    <span className="food-price">
                      ₹{getFinalPrice(food)}
                    </span>
                    <span className="food-old-price">
                      ₹{food.price}
                    </span>
                    <span className="food-save">
                      Save ₹{food.price - getFinalPrice(food)}
                    </span>
                  </div>

                  <button
                    className="food-add-btn"
                    disabled={!food.isAvailable}
                    onClick={() => addToCart(food)}
                  >
                    {food.isAvailable ? "+ Add to Cart" : "Currently Unavailable"}
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="food-empty">
              <h2>😕 No food found</h2>
              <p>Try another search or change your filters.</p>
            </div>
          )}
        </div>

        <section className="food-cart">
          <h2>🛒 Your Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</h2>

          {cart.length === 0 ? (
            <p>Your cart is empty. Add some delicious food!</p>
          ) : (
            <>
              {cart.map((item) => (
                <div className="food-cart-item" key={item.id}>
                  <div>
                    <div className="food-cart-name">{item.name}</div>
                    <div className="food-cart-sub">
                      ₹{getFinalPrice(item)} × {item.quantity} = ₹
                      {getFinalPrice(item) * item.quantity}
                    </div>
                  </div>

                  <div className="food-quantity">
                    <button
                      onClick={() => changeQuantity(item.id, -1)}
                      aria-label={`Decrease ${item.name} quantity`}
                    >
                      −
                    </button>

                    <strong>{item.quantity}</strong>

                    <button
                      onClick={() => changeQuantity(item.id, 1)}
                      aria-label={`Increase ${item.name} quantity`}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}

              <div className="food-cart-total">
                <span>Total Amount</span>
                <span>₹{cartTotal}</span>
              </div>
            </>
          )}
        </section>
      </div>
    </>
  );
}

export default Food;
