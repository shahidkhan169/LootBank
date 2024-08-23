import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { UserIcon } from '@heroicons/react/solid'; // Ensure you have @heroicons/react installed
import { MenuIcon } from '@heroicons/react/outline'; // Icon for the dashboard toggle

const Profile = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const dropdownRef = useRef(null); // Ref for the dropdown
  const dashboardRef = useRef(null); // Ref for the dashboard
  const [user, setUser] = useState({
    name: '',
    userId: '',
    email: '',
    accountNo: '',
    phoneNumber: '',
    dob: '',
    age: '',
    address: '',
    nationality: '',
    state: '',
    district: ''
  });

  // Retrieve the Bearer token from localStorage
  const token = localStorage.getItem('token'); 

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        console.error('No auth token found. Redirecting to login.');
        return;
      }

      try {
        const response = await axios.get('http://localhost:3000/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        if (error.response && error.response.status === 403) {
          // If the token is invalid or expired, redirect to the login page
          window.location.href = '/login';
        }
      }
    };

    fetchUserData();
  }, [token]);

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

  return (
    <div className="min-h-screen flex flex-col">
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

      {/* Content */}
      <div className="flex mt-20">
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

        {/* Profile Content */}
        <div className={`transition-all duration-300 ${showDashboard ? 'ml-64' : 'ml-0'} w-full p-8`}>
          <div className="flex">
            {/* User Info */}
            <div className="w-full h-[380px] bg-gray-200 p-4 rounded-lg">
              <div className="flex items-center mb-4">
                <UserIcon className="h-24 w-24 text-gray-600" />
                <div className="ml-4 p-5">
                  <h2 className="text-4xl font-bold">{user.name}</h2>
                  <p className="text-xl font-semibold">{user.userId}</p>
                  <p className="text-xl font-semibold">{user.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-lg font-semibold">Phone Number: {user.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-lg font-semibold">
                    Date of Birth: {new Date(user.dob).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-lg font-semibold">Age: {user.age}</p>
                </div>
                <div>
                  <p className="text-lg font-semibold">Address: {user.address}</p>
                </div>
                <div>
                  <p className="text-lg font-semibold">Nationality: {user.nationality}</p>
                </div>
                <div>
                  <p className="text-lg font-semibold">State: {user.state}</p>
                </div>
                <div>
                  <p className="text-lg font-semibold">District: {user.district}</p>
                </div>
                <div>
                  <p className="text-lg font-semibold">Account No: {user.accountNo}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
