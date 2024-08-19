import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './auth/Login';
import Register from './auth/Register';
import Profile from './pages/Profile'
import Credit from './pages/Credit';
import Transfer from './pages/Transfer';
import Balance from './pages/Balance';
import History from './pages/History'
import InnerHome from './pages/InnerHome'
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> 
        <Route path="/profile" element={<Profile />} />
        <Route path="/credit" element={<Credit />} />
        <Route path="/transfer" element={<Transfer />} />
        <Route path="/check-balance" element={<Balance />} />
        <Route path="/transaction-history" element={<History />} />
        <Route path="/innerhome" element={<InnerHome />} />
      </Routes>
    </Router>
  );
}

export default App;
