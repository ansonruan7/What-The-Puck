import React, { useState } from 'react';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import Home from './components/Home.js';


function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home/>}/>
      </Routes>
    </Router>
  );
}

export default App;
