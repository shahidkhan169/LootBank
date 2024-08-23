import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { UserIcon, MenuIcon } from '@heroicons/react/solid'; // Ensure you have @heroicons/react installed

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const dropdownRef = useRef(null); // Ref for the dropdown
  const dashboardRef = useRef(null); // Ref for the dashboard

  const getToken = () => {
    // Adjust this to your method of storing tokens
    return localStorage.getItem('token');
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = getToken();
        const response = await axios.get('http://localhost:3000/transactions', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTransactions(response.data);
      } catch (err) {
        setError('Failed to load transactions.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

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

  if (loading) return <div className="text-center p-4">Loading...</div>;

  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;

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

      {/* Dashboard Sidebar */}
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

      {/* Content */}
      <div className={`transition-all duration-300 ${showDashboard ? 'ml-64' : 'ml-0'} w-full mt-6 p-8`}>
        <h1 className="text-2xl font-bold mb-4">Transaction History</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-3 px-4 border-b border-gray-200 text-center">Transaction ID</th>
                <th className="py-3 px-4 border-b border-gray-200 text-center">Amount</th>
                <th className="py-3 px-4 border-b border-gray-200 text-center">Type</th>
                <th className="py-3 px-4 border-b border-gray-200 text-center">Timestamp</th>
                <th className="py-3 px-4 border-b border-gray-200 text-center">Reference</th>
                <th className="py-3 px-4 border-b border-gray-200 text-center">Note</th>
                <th className="py-3 px-4 border-b border-gray-200 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-4 px-6 text-center">No transactions found</td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr key={transaction.transactionId}>
                    <td className="py-2 px-4 border-b border-gray-200 text-center">{transaction.transactionId}</td>
                    <td className={`py-2 px-4 border-b border-gray-200 text-center ${
                      transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${transaction.amount.toFixed(2)}
                    </td>
                    <td className={`py-2 px-4 border-b border-gray-200 text-center ${
                      transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                    } capitalize`}>
                      {transaction.type}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200 text-center">{new Date(transaction.timestamp).toLocaleString()}</td>
                    <td className="py-2 px-4 border-b border-gray-200 text-center">{transaction.reference}</td>
                    <td className="py-2 px-4 border-b border-gray-200 text-center">{transaction.note || 'N/A'}</td>
                    <td className={`py-2 px-4 border-b border-gray-200 text-center ${
                      transaction.status === 'success' ? 'text-green-600' : 'text-red-600'
                    } capitalize`}>
                      {transaction.status}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
