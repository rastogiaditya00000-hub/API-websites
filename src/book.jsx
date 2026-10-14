import { useState } from "react";
import data from "./books_practice.json";

const Book = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");

  let books = data.books.filter((book) =>
    `${book.title} ${book.author} ${book.genre}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

 

  return (
    <div style={{ padding: "25px", fontFamily: "Arial" }}>
      <h1>Book Store</h1>


      <p>Total Books: {books.length}</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
        }}
      >
        {books.map((book) => (
          <div
            key={book.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "12px",
              padding: "18px",
              boxShadow: "0 2px 8px #eee",
            }}
          >
            <h3>{book.title}</h3>
            <p>Author: {book.author}</p>
            <p>Genre: {book.genre}</p>
            <p>Year: {book.year}</p>
            <h3>₹{book.price}</h3>
            <p>⭐ {book.rating}</p>

            <p style={{ color: book.inStock ? "green" : "red" }}>
              {book.inStock ? "In Stock" : "Out of Stock"}
            </p>
          </div>
        ))}
      </div>

      {books.length === 0 && <p>No books found!</p>}
    </div>
  );
};

export default Book;