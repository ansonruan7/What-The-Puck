import React, { useState } from 'react';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import Home from './components/Home.js';
import Login from './components/Login.js';
import CreateAccount from './components/CreateAccount.js';
import { UserProvider } from './components/UserContext.js';


function App() {
  return (
    <Router>
      <UserProvider>
      <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/Login" element={<Login/>}/>
      <Route path="/CreateAccount" element={<CreateAccount/>}/>
      </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;
