import React from 'react'
import Nav from './Nav'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import About from './about'
import Home from './home'
import Contact from './Contact'
import Product from './product'
import Weather from './weather'

import News from './News'
import Recipes from './Recipes'
import Move from './Move'
import Book from './book'
import Gadgets from './gadgets'
import Food from './food'
import Emp from './employee'
function App() {
  return (
   <>
   <BrowserRouter>
   <Nav/>
   <Routes>

    <Route path="/" element={<Home/>}/>
    <Route path="/about" element={<About/>}/>
    <Route path="/product" element={<Product/>}/>
    <Route path="/contact" element={<Contact/>}/>
    <Route path="/weather" element={<Weather/>}/>
    <Route path="/move" element={<Move/>}/>
    <Route path="/news" element={<News/>}/>
    <Route path="/recipes" element={<Recipes/>}/>
    <Route path="/book" element={<Book/>}/>
    <Route path="/gadgets" element={<Gadgets/>}/>
    <Route path="/food" element={<Food/>}/>
    <Route path="/Emp" element={<Emp/>}/>

   </Routes>
   
   </BrowserRouter>
   </>
  )
}

export default App
