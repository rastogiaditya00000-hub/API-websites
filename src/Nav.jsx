import React from 'react'
import { Link } from 'react-router-dom'
import './Nav.css'

const Nav = () => {
    const data = [
        {
            item: "Quiz",
            url: "/"
        },
        // {
        //     item: "About",
        //     url: "/about"
        // },
        // {
        //     item: "Contact",
        //     url: "/contact"
        // },
        {
            item: "To Do List",
            url: "/product"
        },
        {
            item: "Weather",
            url: "/weather"
        },
        {
            item: "Movie",
            url: "/move"
        },
        {
            item: "News",
            url: "/news"
        },
        {
            item: "Recipes",
            url: "/recipes"
        },
        {
            item: "Book",
            url: "/book"
        },
        {
            item: "Gadgets",
            url: "/gadgets"
        },
        {
            item: "Food",
            url: "/food"
        },
        {
            item: "Employee",
            url: "/emp"
        },
    ]

    return (
        <>
            <nav className="navbar">
              

                <div className="nav-links">
                    {
                        data.map((a, index) => {
                            return (
                                <Link
                                    to={a.url}
                                    key={index}
                                    className="nav-link"
                                >
                                    {a.item}
                                </Link>
                            )
                        })
                    }
                </div>
            </nav>
        </>
    )
}

export default Nav