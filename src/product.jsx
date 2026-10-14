
import React, { useState } from "react";
import "./product.css";

const Product = () => {
    const [task, setTask] = useState("");
    const [todos, setTodos] = useState([]);

    const addTodo = () => {
        if (task.trim() === "") return;

        setTodos([...todos, task.trim()]);
        setTask("");
    };

    const dlt = (index) => {
        setTodos(todos.filter((_, i) => i !== index));
    };

    return (
        <div className="product-container">
            <h1>My Todo List</h1>

            <div className="todo-card">
                <div className="todo-input">
                    <input
                        type="text"
                        placeholder="Enter your task..."
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") addTodo();
                        }}
                    />

                    <button className="add-btn" onClick={addTodo}>
                        + Add
                    </button>
                </div>

                <ul className="todo-list">
                    {todos.map((todo, index) => (
                        <li key={index}>
                            <span>{todo}</span>

                            <button
                                className="delete-btn"
                                onClick={() => dlt(index)}
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Product;

