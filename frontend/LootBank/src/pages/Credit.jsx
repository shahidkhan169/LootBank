import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { UserIcon } from '@heroicons/react/solid';
import { MenuIcon } from '@heroicons/react/outline';
import { CheckCircleIcon } from '@heroicons/react/outline'; // Import checkmark icon
import './Credit.css';
import successSound from '../assets/sound.mp3';

const Credit = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const dropdownRef = useRef(null);
  const dashboardRef = useRef(null);
  const [message, setMessage] = useState('');
  const [note, setNote] = useState('');
  const [mpin, setMpin] = useState('');
  const [amount, setAmount] = useState(''); // State for amount
  const [termsAccepted, setTermsAccepted] = useState(false); // State for terms acceptance
  const [isSuccessful, setIsSuccessful] = useState(false); // State for successful credit

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

  const getToken = () => {
    // Replace this with your logic to retrieve the Bearer token
    return localStorage.getItem('token'); // or another source of your token
  };

  const handleLogout = async () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    window.location.href = '/login'; // Redirect to login page
};

  const handleCredit = async () => {
    if (!termsAccepted) {
      return; // Simply return without processing if terms are not accepted
    }

    try {
      const token = getToken();
      const response = await axios.post(
        'http://localhost:3000/credit',
        { amount, mpin, note },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setMessage(response.data);
      setIsSuccessful(true);
      const audio = new Audio(successSound);
      audio.play();
      setTimeout(() => {
        setIsSuccessful(false);
        setMessage(''); // Clear message
        window.location.reload(); // Reload the page
      }, 4000); // 4 seconds for the success message
    } catch (error) {
      setMessage(error.response.data);
      setIsSuccessful(false);
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
          <h3 className="text-2xl font-bold text-white mb-4">Dashboard</h3>
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

        {/* Credit Content */}
        <div className={`transition-all duration-300 ${showDashboard ? 'ml-64' : 'ml-0'} w-full flex justify-center items-center`}>
          <div className={`bg-gray-200 p-8 rounded-lg w-full max-w-md mx-4 mt-8 min-h-[300px] ${isSuccessful ? 'pointer-events-none' : ''}`}>
            {isSuccessful ? (
              <div className="flex flex-col justify-center items-center mb-4 animate-scale-up">
                <CheckCircleIcon className="h-12 w-12 text-green-500 mb-2" />
                <span className="text-green-500 font-semibold text-2xl">Transaction Successful</span>
              </div>
            ) : (
              <>
                <div className="text-center text-3xl font-bold mb-6">
                  Credit Amount
                </div>
                <div className="flex flex-col mb-4">
                  <input
                    type="number"
                    className="p-2 bg-gray-200 border border-gray-800 placeholder:text-center rounded-lg focus:outline-none text-center"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Amount"
                  />
                </div>
                <div className="flex flex-col mb-4">
                  <input
                    type="text"
                    className="p-2 bg-gray-200 border border-gray-800 text-center rounded-lg focus:outline-none placeholder:text-center"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Note"
                  />
                </div>
                <div className="flex justify-center mb-4">
                  <input
                    type="password"
                    className="text-center text-3xl font-semibold bg-gray-200 border-b-2 border-gray-500 focus:outline-none w-24"
                    value={mpin}
                    onChange={(e) => setMpin(e.target.value)}
                    maxLength="4"
                  />
                </div>
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                  />
                  <label className="text-gray-700">I accept the terms and conditions</label>
                </div>
                <button
                  onClick={handleCredit}
                  className={`w-full p-2 rounded-lg ${termsAccepted ? 'bg-slate-500 text-white hover:bg-cyan-600' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`}
                  disabled={!termsAccepted}
                >
                  Credit
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Credit;
