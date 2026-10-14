
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./contact.css";

const Contact = () => {
  const [clr, setClr] = useState("red");

  return (
    <div className="contact-page">
      <div className="contact-card">
        <span className="contact-badge">✨ COLOR PLAYGROUND</span>

        <h2>Choose Your Color</h2>

        <p className="contact-desc">
          Click a button and watch the magic happen!
        </p>

        <div className="color-buttons">
          <button className="btn-red" onClick={() => setClr("red")}>
            Red
          </button>

          <button className="btn-green" onClick={() => setClr("green")}>
            Green
          </button>

          <button className="btn-blue" onClick={() => setClr("blue")}>
            Blue
          </button>
        </div>

        <div className="color-preview">
          <div
            className="color-circle"
            style={{ backgroundColor: clr }}
          ></div>

          <h1 style={{ color: clr }}>
            This is {clr} color
          </h1>

          <p>
            Selected color: <strong>{clr.toUpperCase()}</strong>
          </p>
        </div>

        <Link className="about-link" to="/about">
          Explore About <span>→</span>
        </Link>
      </div>
    </div>
  );
};

export default Contact;
