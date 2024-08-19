import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import backgroundImage from '../assets/image1.png'; // Adjust the path to your image file
import './Home.css'; // Import the custom CSS file

function Home() {
  const trustRef = useRef(null);
  const privacyRef = useRef(null);
  const securityRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (trustRef.current) observer.observe(trustRef.current);
    if (privacyRef.current) observer.observe(privacyRef.current);
    if (securityRef.current) observer.observe(securityRef.current);

    return () => {
      if (trustRef.current) observer.unobserve(trustRef.current);
      if (privacyRef.current) observer.unobserve(privacyRef.current);
      if (securityRef.current) observer.unobserve(securityRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar with fixed position */}
      <nav className="fixed top-0 left-0 right-0 z-10 flex justify-between items-center p-6 bg-gray-800 text-white">
        <div className="ml-17 flex items-center text-3xl font-bold">
          {/* SVG Image */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-10 w-10 mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
            />
          </svg>
          {/* Text */}
          LootBank
        </div>
        <div className="flex items-center space-x-4 ml-auto">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          <Link to="/about" className="hover:text-gray-300">About Us</Link>
        </div>
        <div className="ml-6">
          <Link to="/login">
            <button className="bg-slate-500 hover:bg-cyan-600 text-white py-2 px-4 rounded">
              Login
            </button>
          </Link>
        </div>
      </nav>

      {/* Content below the navbar */}
      <div className="flex-2 mt-8 p-8 flex justify-center items-center">
        <div className="w-full bg-white shadow-lg flex">
          <div className="w-1/2 p-6 mt-40 ml-14">
            <h2 className="text-6xl font-bold mb-4 slide-in-left">Stay connected to</h2>
            <h2 className="text-6xl font-bold mb-4 slide-in-left">your accounts 24/7</h2>
            <p className="text-2xl fade-in">secure online banking for your everyday</p>
            <p className="text-2xl fade-in">financial needs during these challenging times.</p>
          </div>
          <div className="w-1/2 p-6 flex justify-center items-center">
            <img
              src={backgroundImage}
              alt="Background"
              className="object-contain fade-in"
              style={{ width: '90%', height: 'auto' }}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between space-x-4 px-8 py-6 mt-6">
        <div ref={trustRef} className="w-1/3 bg-white shadow-lg p-6 flex flex-col items-center justify-center" style={{ height: '180px' }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-16 h-16 mb-4" // Enlarge the icon
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          <h2 className="text-2xl font-bold">Trust</h2>
          <p>Your Financial Ally</p>
        </div>
        <div ref={privacyRef} className="w-1/3 bg-white shadow-lg p-6 flex flex-col items-center justify-center" style={{ height: '180px' }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-16 h-16 mb-4" // Enlarge the icon
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
            />
          </svg>
          <h2 className="text-2xl font-bold">Privacy</h2>
          <p>Your Data Protected</p>
        </div>
        <div ref={securityRef} className="w-1/3 bg-white shadow-lg p-6 flex flex-col items-center justify-center" style={{ height: '180px' }}>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-16 h-16 mb-4" // Enlarge the icon
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
            />
          </svg>
          <h2 className="text-2xl font-bold">Security</h2>
          <p>Safeguarding Your Assets</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
