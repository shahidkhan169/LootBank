import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserIcon } from '@heroicons/react/solid';
import { MenuIcon } from '@heroicons/react/outline';

const CheckBalance = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const dropdownRef = useRef(null);
  const dashboardRef = useRef(null);
  const [message, setMessage] = useState('');
  const [mpin, setMpin] = useState('');
  const [balance, setBalance] = useState(null);
  const navigate = useNavigate(); // Navigate hook for redirection

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dashboardRef.current && !dashboardRef.current.contains(event.target)) {
        setShowDashboard(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    window.location.href = '/login'; // Redirect to login page
};

  const handleCheckBalance = async () => {
    try {
      // Clear previous message
      setMessage('');

      // Fetch balance with token in header
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3000/check-balance', { mpin }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Update balance and set success message
      setBalance(response.data.balance);
    } catch (error) {
      // Display error message
      setMessage(error.response?.data || 'An error occurred');
      setBalance(null); // Clear balance if there's an error
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-200">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-10 flex justify-between items-center p-6 bg-gray-800 text-white">
        <div className="ml-4 flex items-center text-3xl font-bold">
          <MenuIcon
            className="h-10 w-10 mr-4 cursor-pointer"
            onClick={() => setShowDashboard(!showDashboard)}
          />
          LootBank
        </div>
        <div className="flex items-center space-x-9">
          <Link to="/innerhome" className="hover:text-gray-300">Home</Link>
          <Link to="/about" className="hover:text-gray-300">About Us</Link>
          <div className="relative">
            <button
              className="flex items-center text-white"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <UserIcon className={`h-8 w-8 ${showDropdown ? 'h-12 w-12' : ''}`} />
            </button>
            {showDropdown && (
              <div ref={dropdownRef} className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg">
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="flex mt-20 justify-center items-center flex-1">
        {/* Sidebar */}
        <div
          ref={dashboardRef}
          className={`transition-transform duration-300 ${showDashboard ? 'translate-x-0' : '-translate-x-full'} fixed top-0 left-0 h-full bg-gray-800 p-8 z-20`}
        >
          <h3 className="text-2xl font-bold mb-4 text-white">Dashboard</h3>
          <ul>
            <li>
              <Link to="/profile" className="block w-full py-2 px-4 hover:bg-gray-600 rounded text-white text-left" onClick={() => setShowDashboard(false)}>Profile</Link>
            </li>
            <li>
              <Link to="/transaction-history" className="block w-full py-2 px-4 hover:bg-gray-600 rounded text-white text-left" onClick={() => setShowDashboard(false)}>History</Link>
            </li>
            <li>
              <Link to="/credit" className="block w-full py-2 px-4 hover:bg-gray-600 rounded text-white text-left" onClick={() => setShowDashboard(false)}>Credit</Link>
            </li>
            <li>
              <Link to="/transfer" className="block w-full py-2 px-4 hover:bg-gray-600 rounded text-white text-left" onClick={() => setShowDashboard(false)}>Transfer</Link>
            </li>
            <li>
              <Link to="/check-balance" className="block w-full py-2 px-4 hover:bg-gray-600 rounded text-white text-left" onClick={() => setShowDashboard(false)}>Check Balance</Link>
            </li>
          </ul>
        </div>

        {/* Check Balance Content */}
        <div className={`transition-all duration-300 ${showDashboard ? 'ml-64' : 'ml-0'} w-full flex justify-center items-center`}>
          <div className={`bg-gray-200 p-8 rounded-lg w-full max-w-md mx-4 mt-8 min-h-[300px]`}>
            {message && (
              <div className={`text-center mb-4 ${balance !== null ? 'text-black' : 'text-red-500'}`}>
                {message}
              </div>
            )}
            <div className="text-center text-3xl font-bold mb-6">
              Check Balance
            </div>
            <div className="flex flex-col items-center mb-4">
              <input
                type="password"
                className="text-center text-xl font-semibold bg-gray-200 border-b-2 border-gray-500 focus:outline-none w-24 mb-4"
                value={mpin}
                onChange={(e) => setMpin(e.target.value)}
                maxLength="4"
                placeholder="MPIN"
              />
              <button
                onClick={handleCheckBalance}
                className="px-4 py-2 rounded-lg bg-slate-500 text-white hover:bg-cyan-600 "
              >
                Check Balance
              </button>
            </div>
            {balance !== null && (
              <div className="w-full text-center p-2 rounded-lg text-2xl ">
                Balance: ${balance.toFixed(2)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckBalance;
